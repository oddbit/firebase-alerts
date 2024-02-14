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
 * Declares a webhook implementation for Slack
 * @see https://api.slack.com/messaging/webhooks
 */
export class SlackWebhook extends Webhook {
  /**
   * Creates a JSON payload for a message about new tester device
   *
   * @param {NewTesterDevice} newTesterDevice
   * @return {object} Message payload
   */
  createNewTesterDeviceMessage(newTesterDevice: NewTesterDevice): object {
    const l10n = new Localization(EnvConfig.language);

    const slackMessage = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: [
              l10n.translate("appDistribution"),
              l10n.translate("labelNewTesterDevice"),
            ].join(" - "),
          },
        },
        {
          type: "section",
          block_id: "app-distribution-info-block",
          text: {
            type: "mrkdwn",
            text: [
              `*${l10n.translate("tester")}*`,
              `*${newTesterDevice.testerName}* <${newTesterDevice.testerEmail}>`,
              `*${l10n.translate("bundleId")}*`,
              `\`${EnvConfig.bundleId}\``,
              `*${l10n.translate("labelDeviceIdentifier")}*`,
              `\`${newTesterDevice.deviceIdentifier}\``,
              `*${l10n.translate("labelDeviceModel")}*`,
              `${newTesterDevice.deviceModel}`,
            ].join("\n"),
          },
          accessory: {
            type: "image",
            image_url: appDistributionImgUrl,
            alt_text: l10n.translate("imgAltAppDistribution"),
          },
        },
      ] as object[],
    };

    return slackMessage;
  }

  /**
   * Creates a JSON payload for a Slack message about new app feedback
   *
   * @param {InAppFeedback} appFeedback
   * @return {object} A Slack card message payload
   */
  createAppFeedbackMessage(appFeedback: InAppFeedback): object {
    const l10n = new Localization(EnvConfig.language);

    const slackMessage = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: [
              l10n.translate("appDistribution"),
              l10n.translate("labelInAppFeedback"),
            ].join(" - "),
          },
        },
        {
          type: "section",
          block_id: "app-distribution-info-block",
          text: {
            type: "mrkdwn",
            text: [
              `*${l10n.translate("tester")}*`,
              `*${appFeedback.testerName}* <${appFeedback.testerEmail}>`,
              `*${l10n.translate("bundleId")}*`,
              `${EnvConfig.bundleId}`,
            ].join("\n"),
          },
          fields: [
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("platform")}*
                \`${EnvConfig.platform}\``,
            },
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("appVersion")}*
                \`${appFeedback.appVersion}\``,
            },
          ],
          accessory: {
            type: "image",
            image_url: appDistributionImgUrl,
            alt_text: l10n.translate("imgAltAppDistribution"),
          },
        },
      ] as object[],
    };

    // =========================================================================
    // =========================================================================
    // Firebase section
    //

    slackMessage.blocks.push(
      ...[
        {
          type: "divider",
        },
        {
          type: "header",
          text: {
            type: "plain_text",
            text: l10n.translate("labelInAppFeedback"),
          },
        },
      ]
    );

    slackMessage.blocks.push(
      ...[
        {
          type: "section",
          text: {
            type: "plain_text",
            text: l10n.translate("descriptionViewInFirebaseConsole"),
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: l10n.translate("ctaOpenAppFeedback"),
            },
            value: "app_feedback_report",
            url: appFeedback.feedbackConsoleUri,
            action_id: "app-feedback-action-view",
          },
        },
      ]
    );
    // =========================================================================
    // The actual feedback
    slackMessage.blocks.push(
      ...[
        {
          type: "section",
          text: {
            type: "plain_text",
            text: appFeedback.text,
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: l10n.translate("ctaViewScreenshot"),
            },
            value: "app_feedback_screenshot",
            url: appFeedback.screenshotUri,
            action_id: "app-feedback-action-view-screenshot",
          },
        },
      ]
    );

    return slackMessage;
  }

  /**
   * Creates a JSON payload for a Slack card.
   *
   * @param {AppCrash} appCrash
   * @return {object} A Slack card message payload
   */
  createCrashlyticsMessage(appCrash: AppCrash): object {
    const l10n = new Localization(EnvConfig.language);

    const slackMessage = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: l10n.translate("crashlytics"),
          },
        },
        {
          type: "section",
          block_id: "crashlytics-info-block",
          text: {
            type: "mrkdwn",
            text: [
              `*${l10n.translate(appCrash.issueType)}*`,
              appCrash.issueTitle,
              `*${l10n.translate("bundleId")}*`,
              "`" + EnvConfig.bundleId + "`",
            ].join("\n"),
          },
          fields: [
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("platform")}*
                \`${EnvConfig.platform}\``,
            },
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("appVersion")}*
                \`${appCrash.appVersion}\``,
            },
          ],
          accessory: {
            type: "image",
            image_url: crashlyticsImgUrl,
            alt_text: l10n.translate("imgAltCrashlytics"),
          },
        },
      ] as object[],
    };

    // =========================================================================
    // =========================================================================
    // Firebase section
    //

    slackMessage.blocks.push(
      ...[
        {
          type: "divider",
        },
        {
          type: "header",
          text: {
            type: "plain_text",
            text: l10n.translate("labelFirebase"),
          },
        },
      ]
    );

    slackMessage.blocks.push(
      ...[
        {
          type: "section",
          text: {
            type: "plain_text",
            text: l10n.translate("descriptionViewInCrashlytics"),
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: l10n.translate("ctaViewIssueCrashlytics"),
            },
            value: "crashlytics_issue_" + appCrash.issueId,
            url: makeCrashlyticsIssueUrl(appCrash),
            action_id: "crashlytics-action-view",
          },
        },
      ]
    );

    // =========================================================================
    // =========================================================================
    // Issue tracker Section
    //

    if (EnvConfig.repositoryUrl) {
      slackMessage.blocks.push(
        ...[
          {
            type: "divider",
          },
          {
            type: "header",
            text: {
              type: "plain_text",
              text: l10n.translate("labelIssueTracker"),
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: l10n.translate("descriptionCreateNewIssue"),
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: l10n.translate("ctaCreateIssue"),
              },
              value: "create_new_issue",
              url: makeRepositoryIssueUrl(appCrash),
              action_id: "button-action-create-issue",
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: l10n.translate("descriptionSearchSimilarIssues"),
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: l10n.translate("ctaSearchIssue"),
              },
              value: "search_issue",
              url: makeRepositorySearchUrl(appCrash),
              action_id: "button-action-search-issue",
            },
          },
        ]
      );
    }

    return slackMessage;
  }

  /**
   * Creates a JSON payload for a message about a performance alert
   *
   * @param performanceAlert {PerformanceAlert} Performance alert
   * @return {object} Message payload
   */
  createPerformanceAlertMessage(performanceAlert: PerformanceAlert): object {
    const l10n = new Localization(EnvConfig.language);

    const slackMessage = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: [
              l10n.translate("performance"),
              performanceAlert.eventName,
            ].join(" - "),
          },
        },
        {
          type: "section",
          block_id: "performance-alert-info-block",
          text: {
            type: "mrkdwn",
            text: [
              `*${l10n.translate("bundleId")}*`,
              `${EnvConfig.bundleId}`,
            ].join("\n"),
          },
          fields: [
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("platform")}*
                \`${EnvConfig.platform}\``,
            },
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("appVersion")}*
                \`${performanceAlert.appVersion}\``,
            },
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("alertCondition")}*
                ${performanceAlert.thresholdValue} ${
                performanceAlert.thresholdUnit
              }`,
            },
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("violation")}*
                ${performanceAlert.violationValue} ${
                performanceAlert.violationUnit
              }`,
            },
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("percentile")}*
                ${performanceAlert.conditionPercentile}`,
            },
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("metricType")}*
                ${performanceAlert.metricType}`,
            },
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("numSamples")}*
                ${performanceAlert.numSamples}`,
            },
          ],
          accessory: {
            type: "image",
            image_url: performaceImgUrl,
            alt_text: l10n.translate("imgAltPerformance"),
          },
        },
      ] as object[],
    };

    // =========================================================================
    // =========================================================================
    // Firebase section
    //

    slackMessage.blocks.push(
      ...[
        {
          type: "divider",
        },
        {
          type: "header",
          text: {
            type: "plain_text",
            text: ``,
          },
        },
      ]
    );

    slackMessage.blocks.push(
      ...[
        {
          type: "section",
          text: {
            type: "plain_text",
            text: `${performanceAlert.metricType}: ${performanceAlert.eventType}`,
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: l10n.translate("ctaInvestigate"),
            },
            value: "performance_alert_investigate",
            url: performanceAlert.investigateUri,
            action_id: "performance-alert-action-investigate",
          },
        },
      ]
    );

    return slackMessage;
  }
}
