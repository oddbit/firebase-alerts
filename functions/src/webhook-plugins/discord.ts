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
 * Declares a webhook implementation for Discord
 */
export class DiscordWebhook extends Webhook {
  /**
   * Creates a JSON payload for a Discord card.
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
        name: l10n.translate("crashlytics"),
        icon_url: crashlyticsImgUrl,
      },
      fields: [
        {
          name: l10n.translate("appVersion"),
          value: "`" + appCrash.appVersion + "`",
          inline: true,
        },
        {
          name: l10n.translate("platform"),
          value: EnvConfig.platform,
          inline: true,
        },
        {
          name: l10n.translate("bundleId"),
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
          `[${l10n.translate("ctaCreateIssue")}]` +
            `(${makeRepositoryIssueUrl(appCrash)})`,
          "",
          l10n.translate("descriptionSearchSimilarIssues"),
          `[${l10n.translate("ctaSearchIssue")}]` +
            `(${makeRepositorySearchUrl(appCrash)})`,
        ].join("\n"),
      });
    }

    return discordMessage;
  }

  /**
   * Creates a JSON payload for a message about new tester device
   *
   * @param {NewTesterDevice} newTesterDevice
   * @return {object} Message payload
   */
  public createNewTesterDeviceMessage(
    newTesterDevice: NewTesterDevice
  ): object {
    const l10n = new Localization(EnvConfig.language);

    const discordMessage = {
      content: null,
      embeds: [] as object[],
    };

    const messageInfo = {
      title: l10n.translate("labelNewTesterDevice"),
      color: 16763432,
      author: {
        name: l10n.translate("appDistribution"),
        icon_url: appDistributionImgUrl,
      },
      fields: [
        {
          name: l10n.translate("tester"),
          value: `*${newTesterDevice.testerName}* <${newTesterDevice.testerEmail}>`,
          inline: true,
        },
        {
          name: l10n.translate("labelDeviceModel"),
          value: newTesterDevice.deviceModel,
        },
        {
          name: l10n.translate("labelDeviceIdentifier"),
          value: newTesterDevice.deviceIdentifier,
        },
        {
          name: l10n.translate("platform"),
          value: EnvConfig.platform,
          inline: true,
        },
        {
          name: l10n.translate("bundleId"),
          value: EnvConfig.bundleId,
        },
      ] as object[],
    };

    discordMessage.embeds.push(messageInfo);

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
        name: l10n.translate("appDistribution"),
        icon_url: appDistributionImgUrl,
      },
      fields: [
        {
          name: l10n.translate("tester"),
          value: `*${appFeedback.testerName}* <${appFeedback.testerEmail}>`,
          inline: true,
        },
        {
          name: l10n.translate("appVersion"),
          value: appFeedback.appVersion,
        },
        {
          name: l10n.translate("platform"),
          value: EnvConfig.platform,
          inline: true,
        },
        {
          name: l10n.translate("bundleId"),
          value: EnvConfig.bundleId,
        },
      ] as object[],
    };

    discordMessage.embeds.push(messageInfo);

    return discordMessage;
  }

  /**
   * Creates a JSON payload for a message about a performance alert
   *
   * @param performanceAlert {PerformanceAlert} Performance alert
   * @return {object} Message payload
   */
  createPerformanceAlertMessage(performanceAlert: PerformanceAlert): object {
    const l10n = new Localization(EnvConfig.language);

    const discordMessage = {
      content: null,
      embeds: [] as object[],
    };

    const messageInfo = {
      title: performanceAlert.eventName,
      url: performanceAlert.investigateUri,
      color: 16763432,
      author: {
        name: l10n.translate("performance"),
        icon_url: performaceImgUrl,
      },
      fields: [
        {
          name: l10n.translate("appVersion"),
          value: performanceAlert.appVersion,
          inline: true,
        },
        {
          name: l10n.translate("platform"),
          value: EnvConfig.platform,
          inline: true,
        },
        {
          name: l10n.translate("bundleId"),
          value: EnvConfig.bundleId,
        },
        {
          name: l10n.translate("alertCondition"),
          value: `${performanceAlert.thresholdValue} ${performanceAlert.thresholdUnit}`,
        },
        {
          name: l10n.translate("violation"),
          value: `${performanceAlert.violationValue} ${performanceAlert.violationUnit}`,
        },
        {
          name: l10n.translate("percentile"),
          value: performanceAlert.conditionPercentile,
        },
        {
          name: l10n.translate("metricType"),
          value: performanceAlert.metricType,
        },
        {
          name: l10n.translate("numSamples"),
          value: performanceAlert.numSamples,
        },
      ] as object[],
    };

    discordMessage.embeds.push(messageInfo);

    return discordMessage;
  }
}
