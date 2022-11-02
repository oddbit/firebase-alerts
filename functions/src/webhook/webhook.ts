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
export class Webhook implements IWebhook {
  /**
   * Constructor
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
}
