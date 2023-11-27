import {Localization} from "../../utils/localization";
import {AppCrash} from "../../models/app-crash";
import {AppInfo} from "../../models/app-info";
import {Webhook} from "../../models/webhook";
import {
  crashlyticsImgUrl,
  makeCrashlyticsIssueUrl,
  performanceImgUrl,
} from "../../urls";
import {EnvConfig} from "../../utils/env-config";
import {
  PerformanceEvent,
  ThresholdAlertPayload}
  from "firebase-functions/v2/alerts/performance";
import {addFirebaseSection} from "./utils/add-firebase-section";
import {addGithubSection} from "./utils/add-github-section";
import {createGoogleChatCard} from "./utils/create-google-chat-card";

/**
 * Declares a webhook implementation for Google Chat
 */
export class GoogleChatWebhook extends Webhook {
  /**
   * Creates a JSON payload for a Google Chat card.
   * @see https://developers.google.com/chat/api/reference/rest/v1/cards#card
   *
   * @param {AppInfo} appInfo
   * @param {AppCrash} appCrash
   * @return {object} A Google Chat card message payload
   */
  createCrashlyticsMessage(appInfo: AppInfo, appCrash: AppCrash): object {
    const l10n = new Localization(EnvConfig.language);
    const googleChatCard = createGoogleChatCard(
        appInfo,
        "Crashlytics",
        l10n.translate(appCrash.issueType),
        crashlyticsImgUrl, "Avatar for Crashlytics"
    );
    googleChatCard.card.sections[0].widgets.push({
      decoratedText: {
        topLabel: l10n.translate("labelVersion"),
        text: appCrash.appVersion,
      },
    });
    addFirebaseSection(
        googleChatCard,
        appInfo,
        makeCrashlyticsIssueUrl(appInfo, appCrash)
    );
    addGithubSection(
        googleChatCard,
        appInfo,
        appCrash.issueTitle,
        appCrash.tags
    );

    return {
      // The webhook API expects an array of cards, even if it's only one
      cardsV2: [googleChatCard],
    };
  }

  /**
   * Creates a JSON payload for a Google Chat card.
   * @see https://developers.google.com/chat/api/reference/rest/v1/cards#card
   *
   * @param {AppInfo} appInfo
   * @param {PerformanceEvent<ThresholdAlertPayload>} appPerformance
   * @return {object} A Google Chat card message payload
   */
  createPerformanceMessage(
      appInfo: AppInfo,
      appPerformance: PerformanceEvent<ThresholdAlertPayload>
  ): object {
    const l10n = new Localization(EnvConfig.language);
    const {
      appVersion,
      metricType,
      eventType,
      eventName,
      investigateUri,
    } = appPerformance.data.payload;

    const googleChatCard = createGoogleChatCard(
        appInfo,
        "Performance",
        l10n.translate(`${metricType} of ${eventType}: ${eventName}`),
        performanceImgUrl,
        "Avatar for Crashlytics"
    );
    // eslint-disable-next-line max-len
    googleChatCard.card.sections[0].header = `⚠️ Performance Alert for ${eventType}: ${eventName} ⚠️`;
    googleChatCard.card.sections[0].widgets.push({
      decoratedText: {
        topLabel: l10n.translate("labelVersion"),
        text: appVersion ?? l10n.translate("missingAppVersion"),
      },
    });
    addFirebaseSection(googleChatCard, appInfo, investigateUri);
    addGithubSection(
        googleChatCard,
        appInfo,
        `Performance Alert for ${eventType}: ${eventName}`, ["performance"]
    );

    return {
      // The webhook API expects an array of cards, even if it's only one
      cardsV2: [googleChatCard],
    };
  }
}
