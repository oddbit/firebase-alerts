
import {crashlytics} from "firebase-functions/v2/alerts";
import {logger} from "firebase-functions/v2";
import {firestore} from "firebase-admin";
import {postRequest} from "../utils/https";
import {AppCrash} from "./app-crash";
import {IWebhook, Webhook, WebhookPlatform} from "../webhook";
import {
  GoogleChatCard,
  GoogleChatCardButton,
  GoogleChatCardSection,
} from "../google-chat/card";
import {GithubInfo, IGithubInfo} from "../github/github-info";
import {Localization} from "../localization";


const crashlyticsImg = "https://firebase.google.com/static/images/summit/pathways/crashlytics.png";

/**
 * Support for translating the webhook information to other languages
 */
const l10n = {
  "openFirebaseConsole": {
    "en": "Open Firebase Console",
  },
  "createGithubIssue": {
    "en": "Create Github Issue",
  },
  "searchGithubIssue": {
    "en": "Search Similar Github Issues",
  },
};

/**
 * Handle crashlytics event
 *
 * @param {AppCrash} appCrash
 * @return {Promise}
 */
async function handleCrashlyticsEvent(appCrash: AppCrash):
  Promise<Promise<object | null>> {
  logger.debug("[handleCrashlyticsEvent]", appCrash);

  const githubInfoSnap = await firestore().collection("firebase-alert-github")
      .doc(appCrash.appId)
      .get();

  logger.debug("[handleCrashlyticsEvent] Github info", githubInfoSnap.data());

  const githubInfo = githubInfoSnap.exists ?
    new GithubInfo(githubInfoSnap.data() as IGithubInfo) :
    null;

  appCrash.tags.push(...(githubInfo?.defaultTags ?? []));

  const snap = await firestore().collection("firebase-alert-webhooks").get();
  const promises = snap.docs.map((doc) => {
    const webhook = new Webhook(doc.data() as IWebhook);
    const localizations = new Localization(l10n, webhook.language);

    if (webhook.platform == WebhookPlatform.GoogleChat) {
      logger.debug("[handleCrashlyticsEvent] Google Chat webhook", webhook);
      const googleChatCard = new GoogleChatCard({
        title: "Crashlytics",
        subtitle: appCrash.eventTitle,
        imageUrl: crashlyticsImg,
      });

      const cardSection = new GoogleChatCardSection({
        header: appCrash.issueTitle,
      });

      cardSection.buttons.push(
          new GoogleChatCardButton({
            text: localizations.translate("openFirebaseConsole"),
            url: appCrash.firebaseConsoleUrl,
          })
      );

      if (githubInfo) {
        // Github info is an optional state.
        cardSection.buttons.push(
            new GoogleChatCardButton({
              text: localizations.translate("createGithubIssue"),
              url: githubInfo.makeGithubIssueUrl(appCrash),
            }), new GoogleChatCardButton({
              text: localizations.translate("searchGithubIssue"),
              url: githubInfo.makeGithubSearchUrl(appCrash),
            }),
        );
      }

      googleChatCard.sections.push(cardSection);

      try {
        return postRequest(webhook.url, googleChatCard.toJson());
      } catch (error) {
        logger.error("[handleCrashlyticsEvent] Failed posting webhook.", {
          error,
          webhook,
          appCrash,
          googleChatCard,
        });

        // Failing softly so we can proceed with other webhooks.
        return Promise.resolve(null);
      }
    } else {
      logger.warn(
          `[handleCrashlyticsEvent] Unsupported webhook: ${webhook.platform}`
      );

      // Failing softly so we can proceed with other webhooks.
      return Promise.resolve(null);
    }
  });

  return Promise.all(promises);
}


export const anr = crashlytics.onNewAnrIssuePublished(async (event) => {
  logger.debug("onNewAnrIssuePublished", event);

  const appCrash = AppCrash.fromCrashlytics(event);

  appCrash.tags.push("critical");

  return handleCrashlyticsEvent(appCrash);
});

export const fatalcrash =
  crashlytics.onNewFatalIssuePublished((event) => {
    logger.debug("onNewFatalIssuePublished", event);

    const appCrash = AppCrash.fromCrashlytics(event);

    appCrash.tags.push("critical");

    return handleCrashlyticsEvent(appCrash);
  });


export const nonfatalcrash =
  crashlytics.onNewNonfatalIssuePublished((event) => {
    logger.debug("onNewNonfatalIssuePublished", event);

    const appCrash = AppCrash.fromCrashlytics(event);

    return handleCrashlyticsEvent(appCrash);
  });

export const regression = crashlytics.onRegressionAlertPublished((event) => {
  logger.debug("onRegressionAlertPublished", event);

  const appCrash = AppCrash.fromCrashlytics(event);

  appCrash.tags.push("regression");

  return handleCrashlyticsEvent(appCrash);
});
