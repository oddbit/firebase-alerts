
import {logger} from "firebase-functions/v2";
import {crashlytics} from "firebase-functions/v2/alerts";
import {post} from "request";
import {AppCrash} from "../models/app-crash";
import {Webhook} from "../models/webhook";
import {EnvConfig} from "../utils/env-config";
import {DiscordWebhook} from "../webhook-plugins/discord";
import {GoogleChatWebhook} from "../webhook-plugins/google-chat";
import {SlackWebhook} from "../webhook-plugins/slack";
import {GemeniService} from "../services/gemeni.service";

const functionOpts = {
  region: process.env.LOCATION,
  secrets: ["WEBHOOK_URL", "API_KEY_GEMENI"],
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
 * @param {AppCrash} appCrash
 * @return {Promise}
 */
async function handleCrashlyticsEvent(appCrash: AppCrash):
  Promise<object | void> {
  logger.debug("[handleCrashlyticsEvent]", appCrash);

  if (appCrash.appId !== EnvConfig.appId) {
    logger.debug(
        "[handleCrashlyticsEvent] Skipping crash for different app", {
          appId: appCrash.appId,
          expectedAppId: EnvConfig.appId,
        });
    return;
  }

  const promises = [];
  for (const webhook of EnvConfig.webhooks.map(webhookPluginFromUrl)) {
    logger.debug("[handleCrashlyticsEvent] Webhook", webhook);
    const crashlyticsMessage = webhook.createCrashlyticsMessage(appCrash);
    const webhookPayload = {
      body: JSON.stringify(crashlyticsMessage),
    };

    try {
      logger.info("[handleCrashlyticsEvent] Calling webhook", webhookPayload);
      promises.push(post(webhook.url, webhookPayload, (err, res) => {
        if (err) throw err;
        logger.info("[handleCrashlyticsEvent] Webhook call OK", res);
      }));
    } catch (error) {
      logger.error("[handleCrashlyticsEvent] Failed posting webhook.", {
        error,
        webhook,
        appCrash,
        webhookPayload,
      });
    }
  }

  return Promise.all(promises);
}

export const anr =
  crashlytics.onNewAnrIssuePublished(functionOpts, async (event) => {
    logger.debug("onNewAnrIssuePublished", event);
  
    const appCrash = AppCrash.fromCrashlytics(event);
    if (EnvConfig.apiKeyGemeni) {
      logger.debug("Call Gemeni API for explanation");
      const gemeniService = new GemeniService(EnvConfig.apiKeyGemeni);
      appCrash.explanation = await gemeniService.explainCrash(event);
      logger.debug("Gemeni explanation", appCrash.explanation);
    }

    appCrash.tags.push("critical");

    return handleCrashlyticsEvent(appCrash);
  });

export const fatal =
  crashlytics.onNewFatalIssuePublished(functionOpts, async (event) => {
    logger.debug("onNewFatalIssuePublished", event);

    const appCrash = AppCrash.fromCrashlytics(event);
    if (EnvConfig.apiKeyGemeni) {
      logger.debug("Call Gemeni API for explanation");
      const gemeniService = new GemeniService(EnvConfig.apiKeyGemeni);
      appCrash.explanation = await gemeniService.explainCrash(event);
      logger.debug("Gemeni explanation", appCrash.explanation);
    }
    appCrash.tags.push("critical");

    return handleCrashlyticsEvent(appCrash);
  });


export const nonfatal =
  crashlytics.onNewNonfatalIssuePublished(functionOpts, async (event) => {
    logger.debug("onNewNonfatalIssuePublished", event);

    const appCrash = AppCrash.fromCrashlytics(event);
    if (EnvConfig.apiKeyGemeni) {
      logger.debug("Call Gemeni API for explanation");
      const gemeniService = new GemeniService(EnvConfig.apiKeyGemeni);
      appCrash.explanation = await gemeniService.explainCrash(event);
      logger.debug("Gemeni explanation", appCrash.explanation);
    }

    return handleCrashlyticsEvent(appCrash);
  });

export const regression =
  crashlytics.onRegressionAlertPublished(functionOpts, async (event) => {
    logger.debug("onRegressionAlertPublished", event);

    const appCrash = AppCrash.fromCrashlytics(event);
    if (EnvConfig.apiKeyGemeni) {
      logger.debug("Call Gemeni API for explanation");
      const gemeniService = new GemeniService(EnvConfig.apiKeyGemeni);
      appCrash.explanation = await gemeniService.explainCrash(event);
      logger.debug("Gemeni explanation", appCrash.explanation);
    }

    appCrash.tags.push("regression");

    return handleCrashlyticsEvent(appCrash);
  });
