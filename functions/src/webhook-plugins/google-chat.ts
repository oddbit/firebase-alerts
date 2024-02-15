import { AppCrash } from "../models/app-crash";
import { InAppFeedback, NewTesterDevice } from "../models/app-distribution";
import { PerformanceAlert } from "../models/performance-alert";
import { Webhook } from "../models/webhook";
import {
  appDistributionImgUrl,
  crashlyticsImgUrl,
  makeCrashlyticsIssueUrl,
  makeRepositoryIssueUrl,
  makeRepositorySearchUrl,
  performaceImgUrl,
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
          title: l10n.translate("crashlytics"),
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
                  topLabel: l10n.translate("bundleId"),
                  text: `${EnvConfig.bundleId} (${EnvConfig.platform})`,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("appVersion"),
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
            text: l10n.translate("ctaViewIssueCrashlytics"),
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
                  text: l10n.translate("ctaCreateIssue"),
                  onClick: {
                    openLink: {
                      url: makeRepositoryIssueUrl(appCrash),
                    },
                  },
                },
                {
                  text: l10n.translate("ctaSearchIssue"),
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
   * Creates a JSON payload for a message about new tester device
   *
   * @param {NewTesterDevice} newTesterDevice
   * @return {object} Message payload
   */
  public createNewTesterDeviceMessage(
    newTesterDevice: NewTesterDevice,
  ): object {
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
          title: l10n.translate("appDistribution"),
          subtitle: l10n.translate("labelNewTesterDevice"),
          imageUrl: appDistributionImgUrl,
          imageType: "CIRCLE",
          imageAltText: l10n.translate("imgAltAppDistribution"),
        },
        sections: [
          {
            widgets: [
              {
                decoratedText: {
                  topLabel: l10n.translate("tester"),
                  text: `${newTesterDevice.testerName} (${newTesterDevice.testerEmail})`,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("bundleId"),
                  text: `${EnvConfig.bundleId} (${EnvConfig.platform})`,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("labelDeviceModel"),
                  text: newTesterDevice.deviceModel,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("labelDeviceIdentifier"),
                  text: newTesterDevice.deviceIdentifier,
                },
              },
            ],
          },
        ] as object[],
      },
    };

    googleChatCards.cardsV2.push(googleChatCard);

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
          title: l10n.translate("appDistribution"),
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
                  topLabel: l10n.translate("tester"),
                  text: `${appFeedback.testerName} (${appFeedback.testerEmail})`,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("bundleId"),
                  text: `${EnvConfig.bundleId} (${EnvConfig.platform})`,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("appVersion"),
                  text: appFeedback.appVersion,
                },
              },
              {
                buttonList: {
                  buttons: [
                    {
                      text: l10n.translate("ctaOpenAppFeedback"),
                      onClick: {
                        openLink: {
                          url: appFeedback.feedbackConsoleUri,
                        },
                      },
                    },
                    {
                      text: l10n.translate("ctaViewScreenshot"),
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
        ] as object[],
      },
    };

    googleChatCards.cardsV2.push(googleChatCard);

    return googleChatCards;
  }

  /**
   * Creates a JSON payload for a message about a performance alert
   *
   * @param performanceAlert {PerformanceAlert} Performance alert
   * @return {object} Message payload
   */
  createPerformanceAlertMessage(
    performanceAlert: PerformanceAlert,
  ): object {
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
          title: l10n.translate("performance"),
          subtitle: `${performanceAlert.metricType}: ${performanceAlert.eventType}`,
          imageUrl: performaceImgUrl,
          imageType: "CIRCLE",
          imageAltText: l10n.translate("imgAltPerformance"),
        },
        sections: [
          {
            widgets: [
              {
                decoratedText: {
                  topLabel: l10n.translate("bundleId"),
                  text: `${EnvConfig.bundleId} (${EnvConfig.platform})`,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("appVersion"),
                  text: performanceAlert.appVersion,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("alertCondition"),
                  text: `${performanceAlert.thresholdValue} ${performanceAlert.thresholdUnit}`,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("violation"),
                  text: `${performanceAlert.violationValue} ${performanceAlert.violationUnit}`,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("percentile"),
                  text: `${performanceAlert.conditionPercentile}`,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("metricType"),
                  text: performanceAlert.metricType,
                },
              },
              {
                decoratedText: {
                  topLabel: l10n.translate("numSamples"),
                  text: `${performanceAlert.numSamples}`,
                },
              },
              {
                buttonList: {
                  buttons: [
                    {
                      text: l10n.translate("ctaInvestigate"),
                      onClick: {
                        openLink: {
                          url: performanceAlert.investigateUri,
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        ] as object[],
      },
    };

    googleChatCards.cardsV2.push(googleChatCard);

    return googleChatCards;
  }
}
