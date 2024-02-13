import { AppCrash } from "../models/app-crash";
import { InAppFeedback } from "../models/app-distribution";
import { Webhook } from "../models/webhook";
import {
  appDistributionImgUrl,
  crashlyticsImgUrl,
  makeCrashlyticsIssueUrl,
  makeRepositoryIssueUrl,
  makeRepositorySearchUrl,
} from "../urls";
import { EnvConfig } from "../utils/env-config";
import { Localization } from "../utils/localization";

/**
 * Declares a webhook implementation for Google Chat
 * @see https://developers.google.com/chat/api/reference/rest/v1/cards#card
 */
export class GoogleChatWebhook extends Webhook {
  /**
   * Creates a JSON payload for a Google Chat card.
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
          title: l10n.translate("labelCrashlytics"),
          subtitle: l10n.translate(appCrash.issueType),
          imageUrl: crashlyticsImgUrl,
          imageType: "CIRCLE",
          imageAltText: l10n.translate("imgAltCrashlytics"),
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
      header: l10n.translate("labelFirebase"),
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
    // Issue tracker Section
    //

    if (EnvConfig.repositoryUrl) {
      googleChatCard.card.sections.push({
        header: l10n.translate("labelIssueTracker"),
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

  /**
   * Creates a JSON payload for a message about new app feedback
   *
   * @param {InAppFeedback} appFeedback
   * @return {object} A Slack card message payload
   */
  createAppFeedbackMessage(appFeedback: InAppFeedback): object {
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
          title: l10n.translate("labelAppDistribution"),
          subtitle: l10n.translate("labelInAppFeedback"),
          imageUrl: appDistributionImgUrl,
          imageType: "CIRCLE",
          imageAltText: l10n.translate("imgAltAppDistribution"),
        },
        sections: [
          {
            widgets: [
              {
                decoratedText: {
                  topLabel: l10n.translate("labelTester"),
                  text: `${appFeedback.testerName} (${appFeedback.testerEmail})`,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("labelBundleId"),
                  text: `${EnvConfig.bundleId} (${EnvConfig.platform})`,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("labelVersion"),
                  text: appFeedback.appVersion,
                },
              },
              {
                buttonList: {
                  buttons: [
                    {
                      text: l10n.translate("openAppFeedback"),
                      onClick: {
                        openLink: {
                          url: appFeedback.feedbackConsoleUri,
                        },
                      },
                    },
                    {
                      text: l10n.translate("openScreenshot"),
                      onClick: {
                        openLink: {
                          url: appFeedback.screenshotUri,
                        },
                      },
                    },
                  ],
                },
              },
              {
                "divider": {}
              },
              {
                textParagraph: {
                  text: appFeedback.text,
                }
              }
            ],
          },
          // {
          //   header: l10n.translate("labelUserFeedback"),
          //   widgets: [
          //     {
          //       text: appFeedback.text,
          //     },
          //   ],
          // },
        ] as object[],
      },
    };

    googleChatCards.cardsV2.push(googleChatCard);

    return googleChatCards;
  }
}
