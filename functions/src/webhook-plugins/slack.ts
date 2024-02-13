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
 * Declares a webhook implementation for Slack
 * @see https://api.slack.com/messaging/webhooks
 */
export class SlackWebhook extends Webhook {

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
            text: l10n.translate("labelAppDistribution"),
          },
        },
        {
          type: "section",
          block_id: "app-distribution-info-block",
          text: {
            type: "mrkdwn",
            text: [
              `*${l10n.translate('labelTester')}*`,
              `*${appFeedback.testerName}* <${appFeedback.testerEmail}>`,
            ].join("\n"),
          },
          fields: [
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("labelPlatform")}*
                \`${EnvConfig.platform}\``,
            },
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("labelVersion")}*
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

    slackMessage.blocks.push(...[
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

    ]);

    slackMessage.blocks.push(...[
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
            text: l10n.translate("openAppFeedback"),
          },
          value: "app_feedback_report",
          url: appFeedback.feedbackConsoleUri,
          action_id: "app-feedback-action-view",
        },
      },
    ]);
    // =========================================================================
    // The actual feedback
    slackMessage.blocks.push(...[
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
            text: l10n.translate("openScreenshot"),
          },
          value: "app_feedback_screenshot",
          url: appFeedback.screenshotUri,
          action_id: "app-feedback-action-view-screenshot",
        },
      },
    ]);

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
            text: l10n.translate("labelCrashlytics"),
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
              `*${l10n.translate("labelBundleId")}*`,
              "`" + EnvConfig.bundleId + "`",
            ].join("\n"),
          },
          fields: [
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("labelPlatform")}*
                \`${EnvConfig.platform}\``,
            },
            {
              type: "mrkdwn",
              text: `
                *${l10n.translate("labelVersion")}*
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

    slackMessage.blocks.push(...[
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

    ]);

    slackMessage.blocks.push(...[
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
            text: l10n.translate("openCrashlyticsIssue"),
          },
          value: "crashlytics_issue_" + appCrash.issueId,
          url: makeCrashlyticsIssueUrl(appCrash),
          action_id: "crashlytics-action-view",
        },
      },
    ]);

    // =========================================================================
    // =========================================================================
    // Issue tracker Section
    //

    if (EnvConfig.repositoryUrl) {
      slackMessage.blocks.push(...[
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
              text: l10n.translate("createIssue"),
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
              text: l10n.translate("searchIssue"),
            },
            value: "search_issue",
            url: makeRepositorySearchUrl(appCrash),
            action_id: "button-action-search-issue",
          },
        },
      ],
      );
    }

    return slackMessage;
  }
}
