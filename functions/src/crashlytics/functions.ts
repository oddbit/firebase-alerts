
import {crashlytics} from "firebase-functions/v2/alerts";
import {logger} from "firebase-functions/v2";
import {firestore} from "firebase-admin";
import {AppCrash} from "./app-crash";
import {IWebhook, Webhook, WebhookPlatform} from "../webhook/webhook";
import {
  GoogleChatCard,
  GoogleChatCardButton,
  GoogleChatCardSection,
} from "../google-chat/card";
import {Localization} from "../localization";
import {AppInfo, IAppInfo} from "../app-info/app-info";
import {projectId} from "../config";
import {post} from "request";


const crashlyticsImg = "https://firebase.google.com/static/images/summit/pathways/crashlytics.png";

/**
 * Generate a URL to Firebase Console for the issue
 *
 * @param {AppInfo} appInfo
 * @param {AppCrash} appCrash
 * @return {string} URL to Firebase console
 */
function makeFirebaseConsoleUrl(appInfo: AppInfo, appCrash: AppCrash): string {
  return `https://console.firebase.google.com/project/${projectId}/crashlytics/app/${appInfo.platform}:${appInfo.bundleId}/issues/${appCrash.issueId}`;
}


/**
 * Make an Github URL to create an issue from this app crash
 *
 * @param {AppInfo} appInfo
 * @param {AppCrash} appCrash
 * @return {string} URL to create a github issue
 */
function makeGithubIssueUrl(appInfo: AppInfo, appCrash: AppCrash): string {
  const attributes = [
    `title=${encodeURI(appCrash.eventTitle)}`,
    `labels=${appCrash.tags.map((tag) => encodeURI(tag)).join(",")}`,
  ];

  return `https://github.com/${appInfo.repo}/issues/new?${attributes.join("&")}`;
}

/**
 * Make an Github URL to search for issues from this app crash
 *
 * @param {AppInfo} appInfo
 * @param {AppCrash} appCrash
 * @return {string} URL to search for github issues
 */
function makeGithubSearchUrl(appInfo: AppInfo, appCrash: AppCrash): string {
  return `https://github.com/${appInfo.repo}/issues?q=${encodeURI(appCrash.eventTitle)}`;
}

/**
 * Handle crashlytics event
 *
 * @param {AppCrash} appCrash
 * @return {Promise}
 */
async function handleCrashlyticsEvent(appCrash: AppCrash):
  Promise<Promise<object | null>> {
  logger.debug("[handleCrashlyticsEvent]", appCrash);

  // Update and ensure that there is a Firestore document for this app id
  await firestore()
      .collection("firebase-alert-apps")
      .doc(appCrash.appId)
      .set({
        lastIssue: firestore.FieldValue.serverTimestamp(),
        issueCount: firestore.FieldValue.increment(1),
      }, {merge: true});


  const appInfoSnap = await firestore().collection("firebase-alert-apps")
      .doc(appCrash.appId)
      .get();

  logger.debug("[handleCrashlyticsEvent] App info", appInfoSnap.data());

  const appInfo = new AppInfo(appInfoSnap.data() as IAppInfo);

  const webhooksSnap = await firestore()
      .collection("firebase-alert-webhooks")
      .get();

  const promises = webhooksSnap.docs.map((doc) => {
    const webhook = new Webhook(doc.data() as IWebhook);
    const localizations = new Localization(webhook.language);

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

      if (!appInfo.bundleId) {
        logger.warn("[handleCrashlyticsEvent] No bundle id for app", appInfo);
      } else {
        // Need the package ID in order to link to Firebase Console
        cardSection.buttons.push(
            new GoogleChatCardButton({
              text: localizations.translate("openFirebaseConsole"),
              url: makeFirebaseConsoleUrl(appInfo, appCrash),
            })
        );
      }

      if (appInfo.repo) {
        // Github info is an optional state.
        cardSection.buttons.push(
            new GoogleChatCardButton({
              text: localizations.translate("createGithubIssue"),
              url: makeGithubIssueUrl(appInfo, appCrash),
            }), new GoogleChatCardButton({
              text: localizations.translate("searchGithubIssue"),
              url: makeGithubSearchUrl(appInfo, appCrash),
            }),
        );
      }

      googleChatCard.sections.push(cardSection);

      try {
        const opts = {body: JSON.stringify(googleChatCard.toJson())};
        logger.info("[handleCrashlyticsEvent] Call webhook", opts);
        return post(webhook.url, opts, (err, res) => {
          if (err) {
            throw err;
          }
          logger.info("[handleCrashlyticsEvent] Webhook call OK", res);
        });
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
