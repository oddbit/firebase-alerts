import {EnvConfig} from "../utils/env-config";
import {Localization} from "../utils/localization";
import {AppCrash} from "../models/app-crash";
import {AppInfo} from "../models/app-info";
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
 * Declares a webhook implementation for Slack
 */
export class SlackWebhook extends Webhook {
  /**
   * Creates a JSON payload for a Slack card.
   * @see https://developers.google.com/chat/api/reference/rest/v1/cards#card
   *
   * @param {AppInfo} appInfo
   * @param {AppCrash} appCrash
   * @return {object} A Slack card message payload
   */
  createCrashlyticsMessage(appInfo: AppInfo, appCrash: AppCrash): object {
    const l10n = new Localization(EnvConfig.language);
    const bundleId = appInfo.bundleId ?? l10n.translate("missingBundleId");

    const slackMessage = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Crashlytics",
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
              "*Bundle id*",
              "`" + bundleId + "`",
            ].join("\n"),
          },
          fields: [
            {
              type: "mrkdwn",
              text: "*Platform*\n`"+ appInfo.platform +"`",
            },
            {
              type: "mrkdwn",
              text: "*Version*\n`"+ appCrash.appVersion +"`",
            },
          ],
          accessory: {
            type: "image",
            image_url: crashlyticsImgUrl,
            alt_text: "Crashlytics icon",
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
          text: "Firebase",
        },
      },

    ]);

    if (appInfo.bundleId) {
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
            url: makeCrashlyticsIssueUrl(appInfo, appCrash),
            action_id: "crashlytics-action-view",
          },
        },
      ]);
    } else {
      // No bundle ID present. Prompt the user to try and fix it.
      slackMessage.blocks.push(...[
        {
          type: "section",
          text: {
            type: "plain_text",
            text: l10n.translate("descriptionOpenFirebaseAppsSettings"),
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: l10n.translate("openFirebaseAppsSettings"),
            },
            value: "firebase_settings_" + EnvConfig.projectId,
            url: makeFirebaseAppsSettingsUrl(),
            action_id: "firebase-open-settings",
          },
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: l10n.translate("descriptionOpenFirestoreAppInfo"),
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: l10n.translate("openFirestoreAppInfo"),
            },
            value: "open_firestore_" + appCrash.issueId,
            url: makeFirestoreAppInfoUrl(appInfo),
            action_id: "view-document-firestore",
          },
        },
      ]);
    }

    // =========================================================================
    // =========================================================================
    // Github Section
    //

    if (appInfo.github) {
      slackMessage.blocks.push(...[
        {
          type: "divider",
        },
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Github",
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
              text: l10n.translate("createGithubIssue"),
            },
            value: "create_new_github_issue",
            url: makeGithubIssueUrl(appInfo, appCrash),
            action_id: "button-action-create-github-issue",
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
              text: l10n.translate("searchGithubIssue"),
            },
            value: "search_github_issue",
            url: makeGithubSearchUrl(appInfo, appCrash),
            action_id: "button-action-search-github-issue",
          },
        },
      ],
      );
    }

    return slackMessage;
  }
}
