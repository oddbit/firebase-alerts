import {Localization} from "../utils/localization";
import {AppCrash} from "../models/app-crash";
import {Webhook} from "../models/webhook";
import {
  crashlyticsImgUrl,
  makeCrashlyticsIssueUrl,
  makeRepositoryIssueUrl,
  makeRepositorySearchUrl,
} from "../urls";
import {EnvConfig} from "../utils/env-config";

/**
 * Declares a webhook implementation for Google Chat
 */
export class GoogleChatWebhook extends Webhook {
  /**
   * Creates a JSON payload for a Google Chat card.
   * @see https://developers.google.com/chat/api/reference/rest/v1/cards#card
   *
   * @param {AppCrash} appCrash
   * @return {object} A Google Chat card message payload
   */
  createCrashlyticsMessage(appCrash: AppCrash): object {
    const l10n = new Localization(EnvConfig.language);

    const googleChatCards =
    {
      // The webhook API expects an array of cards, even if it's only one
      cardsV2: [] as object[],
    };

    const googleChatCard = {
      cardId: Date.now() + "-" + Math.round((Math.random() * 10000)),
      card: {
        header: {
          title: "Crashlytics",
          subtitle: l10n.translate(appCrash.issueType),
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
                  topLabel: l10n.translate("labelBundleId"),
                  text: `${EnvConfig.bundleId} (${EnvConfig.platform})`,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("labelVersion"),
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

    firebaseSection.widgets.push({
      buttonList: {
        buttons: [
          {
            text: l10n.translate("openCrashlyticsIssue"),
            onClick: {
              openLink: {
                url: makeCrashlyticsIssueUrl(appCrash),
              },
            },
          },
        ],
      },
    });

    // =========================================================================
    // =========================================================================
    // Github Section
    //

    if (EnvConfig.repositoryUrl) {
      googleChatCard.card.sections.push({
        header: "Repository",
        widgets: [
          {
            buttonList: {
              buttons: [
                {
                  text: l10n.translate("createIssue"),
                  onClick: {
                    openLink: {
                      url: makeRepositoryIssueUrl(appCrash),
                    },
                  },
                },
                {
                  text: l10n.translate("searchIssue"),
                  onClick: {
                    openLink: {
                      url: makeRepositorySearchUrl(appCrash),
                    },
                  },
                },
              ],
            },
          },
        ],
      });
    }

    return googleChatCards;
  }
}
