import {AppInfo} from "../models/app-info";
import {AppCrash} from "../models/app-crash";
import {Localization} from "../localization";
import {Webhook} from "../models/webhook";
import {
  crashlyticsImgUrl,
  makeCrashlyticsIssueUrl,
  makeFirebaseAppsSettingsUrl,
  makeFirestoreAppInfoUrl,
  makeGithubIssueUrl,
  makeGithubSearchUrl,
} from "../urls";


/**
 * Declares a webhook implementation for Google Chat
 */
export class GoogleChatWebhook extends Webhook {
  /**
   * Creates a JSON payload for a Google Chat card.
   * @see https://developers.google.com/chat/api/reference/rest/v1/cards#card
   *
   * @param {AppInfo} appInfo
   * @param {AppCrash} appCrash
   * @return {object} A Google Chat card message payload
   */
  createCrashlyticsMessage(appInfo: AppInfo, appCrash: AppCrash): object {
    const localizations = new Localization(this.language);
    const bundleId = appInfo.bundleId ??
      localizations.translate("missingBundleId");

    const googleChatCards =
    {
      cardsV2: [] as object[],
    };

    const googleChatCard = {
      cardId: Date.now() + "-" + Math.round((Math.random() * 10000)),
      card: {
        header: {
          title: "Crashlytics",
          subtitle: appCrash.eventTitle,
          imageUrl: crashlyticsImgUrl,
          imageType: "CIRCLE",
          imageAltText: "Avatar for Crashlytics",
        },
        sections: [
          {
            header: appCrash.issueTitle,
            widgets: [
              {
                decoratedText: {
                  topLabel: localizations.translate("labelBundleId"),
                  text: `${bundleId} (${appInfo.platform})`,
                },
              },
              {
                decoratedText: {
                  topLabel: localizations.translate("labelVersion"),
                  text: appCrash.appVersion,
                },
              },
            ],
          },
        ] as object[],
      },
    };

    googleChatCards.cardsV2.push(googleChatCard);

    // =========================================================================
    // =========================================================================
    // Firebase section
    //
    const firebaseSection = {
      header: "Firebase",
      widgets: [] as object[],
    };
    googleChatCard.card.sections.push(firebaseSection);

    if (appInfo.bundleId) {
      // Need the bundle ID in order to link to Firebase Console
      firebaseSection.widgets.push({
        buttonList: {
          buttons: [
            {
              text: localizations.translate("openCrashlyticsIssue"),
              onClick: {
                openLink: {
                  url: makeCrashlyticsIssueUrl(appInfo, appCrash),
                },
              },
            },
          ],
        },
      });
    } else {
      firebaseSection.widgets.push({
        buttonList: {
          buttons: [
            {
              text: localizations.translate("openFirebaseAppsSettings"),
              onClick: {
                openLink: {
                  url: makeFirebaseAppsSettingsUrl(),
                },
              },
            },
            {
              text: localizations.translate("openFirestoreAppInfo"),
              onClick: {
                openLink: {
                  url: makeFirestoreAppInfoUrl(appInfo),
                },
              },
            },
          ],
        },
      });
    }

    // =========================================================================
    // =========================================================================
    // Github Section
    //

    if (appInfo.repo) {
      googleChatCard.card.sections.push({
        header: "Github",
        widgets: [
          {
            buttonList: {
              buttons: [
                {
                  text: localizations.translate("createGithubIssue"),
                  onClick: {
                    openLink: {
                      url: makeGithubIssueUrl(appInfo, appCrash),
                    },
                  },
                },
                {
                  text: localizations.translate("searchGithubIssue"),
                  onClick: {
                    openLink: {
                      url: makeGithubSearchUrl(appInfo, appCrash),
                    },
                  },
                },
              ],
            },
          },
        ],
      });
    }

    // The webhook API expects an array of cards, even if it's only one
    return googleChatCards;
  }
}
