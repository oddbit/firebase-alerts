import {AppInfo} from "./app-info";
import {AppCrash} from "./app-crash";
import {Localization} from "../localization";

export interface IWebhook {
  url: string;
  language?: string;
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
    this.language = Localization.defaultLanguage;
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
