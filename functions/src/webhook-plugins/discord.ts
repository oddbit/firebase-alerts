import {Localization} from "../utils/localization";
import {AppCrash} from "../models/app-crash";
import {Webhook} from "../models/webhook";
import {
  appDistributionImgUrl,
  crashlyticsImgUrl,
  makeCrashlyticsIssueUrl,
  makeRepositoryIssueUrl,
  makeRepositorySearchUrl,
} from "../urls";
import {EnvConfig} from "../utils/env-config";
import { InAppFeedback } from "../models/app-distribution";

/**
 * Declares a webhook implementation for Discord
 */
export class DiscordWebhook extends Webhook {
  /**
   * Creates a JSON payload for a Discord card.
   * @see https://developers.google.com/chat/api/reference/rest/v1/cards#card
   *
   * @param {AppCrash} appCrash
   * @return {object} A Discord card message payload
   */
  createCrashlyticsMessage(appCrash: AppCrash): object {
    const l10n = new Localization(EnvConfig.language);
    const bundleId = EnvConfig.bundleId;

    const discordMessage = {
      content: null,
      embeds: [] as object[],
    };

    const crashlyticsInfo = {
      title: appCrash.issueTitle,
      url: makeCrashlyticsIssueUrl(appCrash),
      color: 16763432,
      author: {
        name: l10n.translate("labelCrashlytics"),
        icon_url: crashlyticsImgUrl,
      },
      fields: [
        {
          name: l10n.translate("labelVersion"),
          value: "`" + appCrash.appVersion + "`",
          inline: true,
        },
        {
          name: l10n.translate("labelPlatform"),
          value: EnvConfig.platform,
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
    // Issue tracker Section
    //

    if (EnvConfig.repositoryUrl) {
      crashlyticsInfo.fields.push({
        name: l10n.translate("labelIssueTracker"),
        value: [
          l10n.translate("descriptionCreateNewIssue"),
          `[${l10n.translate("createIssue")}]` +
          `(${makeRepositoryIssueUrl(appCrash)})`,
          "",
          l10n.translate("descriptionSearchSimilarIssues"),
          `[${l10n.translate("searchIssue")}]` +
          `(${makeRepositorySearchUrl(appCrash)})`,
        ].join("\n"),
      });
    }

    return discordMessage;
  }

    /**
   * Creates a JSON payload for a message about new app feedback
   *
   * @param {InAppFeedback} appFeedback
   * @return {object} A Slack card message payload
   */
  createAppFeedbackMessage(appFeedback: InAppFeedback): object {
    const l10n = new Localization(EnvConfig.language);

    const discordMessage = {
      content: null,
      embeds: [] as object[],
    };

    const messageInfo = {
      title: l10n.translate("labelInAppFeedback"),
      url: appFeedback.feedbackConsoleUri,
      color: 16763432,
      author: {
        name: l10n.translate("labelAppDistribution"),
        icon_url: appDistributionImgUrl,
      },
      fields: [
        {
          name: l10n.translate("labelTester"),
          value: `*${appFeedback.testerName}* <${appFeedback.testerEmail}>`,
          inline: true,
        },
        {
          name: l10n.translate("labelVersion"),
          value: appFeedback.appVersion,
        },
        {
          name: l10n.translate("labelPlatform"),
          value: EnvConfig.platform,
          inline: true,
        },
        {
          name: l10n.translate("labelBundleId"),
          value: EnvConfig.bundleId,
        },
      ] as object[],
    };

    discordMessage.embeds.push(messageInfo);

    return discordMessage;
  }
}
