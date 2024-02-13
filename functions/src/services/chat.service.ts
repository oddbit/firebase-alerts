import axios from "axios";
import { logger } from "firebase-functions/v2";
import { AppCrash } from '../models/app-crash';
import { Webhook } from "../models/webhook";
import { EnvConfig } from '../utils/env-config';
import { DiscordWebhook } from "../webhook-plugins/discord";
import { GoogleChatWebhook } from "../webhook-plugins/google-chat";
import { SlackWebhook } from "../webhook-plugins/slack";

export class ApiService {

  constructor(webhookUrl: string) {
    this.webhook = ApiService.webhookPluginFromUrl(webhookUrl);
  }

  private readonly webhook: Webhook;

  /**
   * Handle crashlytics event
   *
   * @param {AppCrash} appCrash
   * @return {Promise}
   */
  public async sendCrashlyticsMessage(appCrash: AppCrash): Promise<void> {
    logger.debug("[sendCrashlyticsMessage]", appCrash);

    if (appCrash.appId !== EnvConfig.appId) {
      logger.debug(
        "[sendCrashlyticsMessage] Skipping crash for different app", {
        appId: appCrash.appId,
        expectedAppId: EnvConfig.appId,
      });
      return;
    }


    logger.debug("[sendCrashlyticsMessage] Webhook", this.webhook);
    const crashlyticsMessage = this.webhook.createCrashlyticsMessage(appCrash);

    try {
      const res = await axios.post(this.webhook.url, crashlyticsMessage);
      logger.info('[sendCrashlyticsMessage] Webhook call OK', res.status);
    } catch (error) {
      logger.error("[sendCrashlyticsMessage] Failed posting webhook.", {
        error,
        webhook: this.webhook,
        appCrash,
        crashlyticsMessage,
      });
      throw error;
    }
  }

  /**
   * Factory method for returning a Webhook plugin based on the URL
   *
   * @param {string} url Webhook URL
   * @return {Webhook} plugin
   */
  private static webhookPluginFromUrl(url: string): Webhook {
    const language = EnvConfig.language;
    if (url?.startsWith("https://chat.googleapis.com")) {
      logger.debug("[handleCrashlyticsEvent] Found Google Chat webhook");
      return new GoogleChatWebhook({ url, language });
    } else if (url?.startsWith("https://discord.com")) {
      logger.debug("[handleCrashlyticsEvent] Found Discord webhook");
      return new DiscordWebhook({ url, language });
    } else if (url?.startsWith("https://hooks.slack.com")) {
      logger.debug("[handleCrashlyticsEvent] Found slack webhook");
      return new SlackWebhook({ url, language });
    } else {
      throw new Error("Unknown webhook type: " + url);
    }
  }
}
