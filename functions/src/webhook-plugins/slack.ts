import {EnvConfig} from "../utils/env-config";
import {Localization} from "../utils/localization";
import {AppCrash} from "../models/app-crash";
import {Webhook} from "../models/webhook";
import {
  crashlyticsImgUrl,
  makeCrashlyticsIssueUrl,
  makeRepositoryIssueUrl,
  makeRepositorySearchUrl,
} from "../urls";

/**
 * Declares a webhook implementation for Slack
 */
export class SlackWebhook extends Webhook {
  /**
   * Creates a JSON payload for a Slack card.
   * @see https://developers.google.com/chat/api/reference/rest/v1/cards#card
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
