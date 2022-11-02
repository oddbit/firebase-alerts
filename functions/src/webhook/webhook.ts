import {AppInfo} from "../app-info/app-info";
import {AppCrash} from "../crashlytics/app-crash";

export enum WebhookPlatform {
  GoogleChat = "google-chat",
}

export interface IWebhook {
  url: string;
  platform: WebhookPlatform;
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
    this.platform = webhook.platform;
    this.language = webhook.language;
  }

  public readonly url: string;
  public readonly platform: WebhookPlatform;
  public readonly language: string;

  /**
   * Create message payload for the webhook to send a crashlytics message
   *
   * @param {AppInfo} appInfo
   * @param {AppCrash} appCrash
   * @return {object} Webhook body payload
   */
  abstract createCrashlyticsMessage(
    appInfo: AppInfo,
    appCrash: AppCrash,
  ): object;
}
