import {AppInfo} from "./app-info";
import {AppCrash} from "./app-crash";

export enum WebhookPlatform {
  GoogleChat = "google-chat",
  Unknown = "unknown",
}

export interface IWebhook {
  url: string;
  language: string;
}

/**
 * Declares Webhook class
 */
export abstract class Webhook implements IWebhook {
  /**
   * Constructor
   *
   * @param {IWebhook} webhook Webhook data
   */
  constructor(webhook: IWebhook) {
    this.url = webhook.url;
    this.language = webhook.language;
  }


  /**
   * Derive which platform that this webhook is referring to based on its URL
   *
   * @param {string} url Webhook URL
   * @return {WebhookPlatform}
   */
  public static derivePlatformTypeFromUrl(url: string): WebhookPlatform {
    if (url?.startsWith("https://chat.googleapis.com")) {
      return WebhookPlatform.GoogleChat;
    }

    return WebhookPlatform.Unknown;
  }

  public readonly url: string;
  public readonly language: string;

  /**
   * Create message payload for the webhook to send a crashlytics message
   *
   * @param {AppInfo} appInfo
   * @param {AppCrash} appCrash
   * @return {object} Webhook body payload
   */
  public abstract createCrashlyticsMessage(
    appInfo: AppInfo,
    appCrash: AppCrash,
  ): object;
}
