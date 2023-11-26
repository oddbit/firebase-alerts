import {logger} from "firebase-functions/v2";
import {performance} from "firebase-functions/v2/alerts";
import {post} from "request";
import {Webhook} from "../models/webhook";
import {EnvConfig} from "../utils/env-config";
import {DiscordWebhook} from "../webhook-plugins/discord";
import {SlackWebhook} from "../webhook-plugins/slack";
import {
  PerformanceEvent,
  ThresholdAlertPayload,
} from "firebase-functions/v2/alerts/performance";
import {updateAppLogInfo} from "../utils/update-app-log-info";
import {GoogleChatWebhook} from "../webhook-plugins/google-chat/google-chat";

const functionOpts = {
  region: process.env.LOCATION,
  secrets: ["WEBHOOK_MANDATORY", "WEBHOOK_OPTIONAL"],
};

/**
 * Factory method for returning a Webhook plugin based on the URL
 *
 * @param {string} url Webhook URL
 * @return {Webhook} plugin
 */
function webhookPluginFromUrl(url: string): Webhook {
  if (url?.startsWith("https://chat.googleapis.com")) {
    logger.debug("[handleCrashlyticsEvent] Found Google Chat webhook");
    return new GoogleChatWebhook({url, language: EnvConfig.language});
  } else if (url?.startsWith("https://discord.com")) {
    logger.debug("[handleCrashlyticsEvent] Found Discord webhook");
    return new DiscordWebhook({url, language: EnvConfig.language});
  } else if (url?.startsWith("https://hooks.slack.com")) {
    logger.debug("[handleCrashlyticsEvent] Found slack webhook");
    return new SlackWebhook({url, language: EnvConfig.language});
  } else {
    throw new Error("Unknown webhook type: " + url);
  }
}

/**
 * Handle crashlytics event
 *
 * @param {PerformanceEvent<ThresholdAlertPayload>} appPerformance
 * @return {Promise}
 */
async function handlePerformanceEvent(
    appPerformance: PerformanceEvent<ThresholdAlertPayload>
): Promise<object | void> {
  logger.debug("[handleCrashlyticsEvent]", appPerformance);
  const appInfo = await updateAppLogInfo(
      appPerformance, "handlePerformanceEvent")
    ;

  const webhooks: Webhook[] = EnvConfig.webhooks.map(webhookPluginFromUrl);

  if (webhooks.length === 0) {
    throw new Error("No webhooks defined. Please reconfigure the extension!");
  }

  const promises = [];
  for (const webhook of webhooks) {
    logger.debug("[handlePerformanceEvent] Webhook", webhook);
    const webhookPayload = {
      body: JSON.stringify(
          webhook.createPerformanceMessage(appInfo, appPerformance)
      ),
    };

    try {
      logger.info("[handlePerformanceEvent] Calling webhook", webhookPayload);
      promises.push(post(webhook.url, webhookPayload, (err, res) => {
        if (err) throw err;
        logger.info("[handlePerformanceEvent] Webhook call OK", res);
      }));
    } catch (error) {
      logger.error("[handlePerformanceEvent] Failed posting webhook.", {
        error,
        webhook,
        performanceEvent: appPerformance,
        webhookPayload,
      });
    }
  }

  return Promise.all(promises);
}


export const threshold =
  performance.onThresholdAlertPublished(functionOpts, (event) => {
    logger.debug("onThresholdAlertPublished", event);
    return handlePerformanceEvent(event);
  });
