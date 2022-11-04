import {Localization} from "../localization";
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
 * Declares a webhook implementation for Discord
 */
export class DiscordWebhook extends Webhook {
  /**
   * Creates a JSON payload for a Discord card.
   * @see https://developers.google.com/chat/api/reference/rest/v1/cards#card
   *
   * @param {AppInfo} appInfo
   * @param {AppCrash} appCrash
   * @return {object} A Discord card message payload
   */
  createCrashlyticsMessage(appInfo: AppInfo, appCrash: AppCrash): object {
    const l10n = new Localization(this.language);
    const bundleId = appInfo.bundleId ?? l10n.translate("missingBundleId");

    const discordMessage = {
      content: null,
      embeds: [] as object[],
    };

    const crashlyticsInfo = {
      title: appCrash.issueTitle,
      url: appInfo.bundleId ?
        makeCrashlyticsIssueUrl(appInfo, appCrash) :
        undefined,
      color: 16763432,
      author: {
        name: "Crashlytics",
        icon_url: crashlyticsImgUrl,
      },
      fields: [
        {
          name: l10n.translate("labelVersion"),
          value: appCrash.appVersion,
          inline: true,
        },
        {
          name: l10n.translate("labelPlatform"),
          value: appInfo.platform,
          inline: true,
        },
        {
          name: l10n.translate("labelBundleId"),
          value: bundleId,
        },
      ] as object[],
    };

    discordMessage.embeds.push(crashlyticsInfo);

    // =========================================================================
    // =========================================================================
    // Firebase section
    //
    if (!appInfo.bundleId) {
      // No bundle ID present. Prompt the user to try and fix it.
      crashlyticsInfo.fields.push({
        name: "Firebase",
        value: [
          l10n.translate("descriptionOpenFirebaseAppsSettings"),
          `[${l10n.translate("openFirebaseAppsSettings")}]`+
          `(${makeFirebaseAppsSettingsUrl()})`,
          "",
          l10n.translate("descriptionOpenFirestoreAppInfo"),
          `[${l10n.translate("openFirestoreAppInfo")}]` +
          `(${makeFirestoreAppInfoUrl(appInfo)})`,
        ].join("\n"),
      });
    }

    // =========================================================================
    // =========================================================================
    // Github Section
    //

    if (appInfo.github) {
      crashlyticsInfo.fields.push({
        name: "Github",
        value: [
          l10n.translate("descriptionCreateNewIssue"),
          `[${l10n.translate("createGithubIssue")}]` +
          `(${makeGithubIssueUrl(appInfo, appCrash)})`,
          "",
          l10n.translate("descriptionSearchSimilarIssues"),
          `[${l10n.translate("searchGithubIssue")}]` +
          `(${makeGithubSearchUrl(appInfo, appCrash)})`,
        ].join("\n"),
      });
    }

    return discordMessage;
  }
}
