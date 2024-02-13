import axios from "axios";
import { logger } from "firebase-functions/v2";
import { AppCrash } from '../models/app-crash';
import { Webhook } from "../models/webhook";
import { EnvConfig } from '../utils/env-config';
import { DiscordWebhook } from "../webhook-plugins/discord";
import { GoogleChatWebhook } from "../webhook-plugins/google-chat";
import { SlackWebhook } from "../webhook-plugins/slack";
import { InAppFeedback, NewTesterDevice } from "../models/app-distribution";

export class ApiService {

  constructor(webhookUrl: string) {
    this.webhook = ApiService.webhookPluginFromUrl(webhookUrl);
    logger.debug("[ApiService] constructor", this.webhook);
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
    const payload = this.webhook.createCrashlyticsMessage(appCrash);
    return this.sendMessage(appCrash.appId, payload);
  }

  /**
   * Send a message for in app feedback
   *
   * @param {InAppFeedback} appFeedback
   * @return {Promise}
   */
  public async sendInAppFeedback(appFeedback: InAppFeedback): Promise<void> {
    logger.debug("[sendInAppFeedback]", appFeedback);
    const payload = this.webhook.createAppFeedbackMessage(appFeedback);
    return this.sendMessage(appFeedback.appId, payload);
  }

  /**
   * Send a message for new tester device
   *
   * @param {NewTesterDevice} newTesterDevice
   * @return {Promise}
   */
  public async sendNewTesterDeviceMessage(newTesterDevice: NewTesterDevice): 
    Promise<void> {
      logger.debug("[sendNewTesterDeviceMessage]", newTesterDevice);
      const payload = this.webhook.createNewTesterDeviceMessage(
        newTesterDevice,
      );
      return this.sendMessage(newTesterDevice.appId, payload);
    }

  /**
   * Sends the message to the webhook API endpoint
   * 
   * @param {string} appId App ID
   * @param {object} payload JSON payload
   * @returns {Promise<void>}
   */
  private async sendMessage(appId: string, payload: object): Promise<void> {
    logger.debug("[sendMessage]", payload);

    if (appId !== EnvConfig.appId) {
      logger.debug(
        "[sendMessage] Skipping message because not the expected app.", {
        eventAppId: appId,
        expectedAppId: EnvConfig.appId,
      });
      return;
    }

    try {
      const res = await axios.post(this.webhook.url, payload);
      logger.info('[sendCrashlyticsMessage] Webhook call OK', res.status);
    } catch (error) {
      logger.error("[sendCrashlyticsMessage] Failed posting webhook.", {
        error,
        webhook: this.webhook,
        payload,
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
