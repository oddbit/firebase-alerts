import {IWebhook, Webhook} from "../models/webhook";
import {GoogleChatWebhook} from "./google-chat";
import {SlackWebhook} from "./slack";

export enum WebhookPlatform {
  GoogleChat,
  Slack,
  Discord,
  Unknown,
}

/**
 * Declares a webhook builder type that is used to generically support
 * future webhook platforms.
 */
type WebhookBuilder = (webhook: IWebhook) => Webhook;

/**
 * Contains a lookup map of supported webhooks
 */
export const webhookPlugins: {[key: string]: WebhookBuilder} = {
  [WebhookPlatform.GoogleChat]: (webhook) => new GoogleChatWebhook(webhook),
  [WebhookPlatform.Slack]: (webhook) => new SlackWebhook(webhook),
};

/**
 * Derive which platform that this webhook is referring to based on its URL
 *
 * @param {string} url Webhook URL
 * @return {WebhookPlatform}
 */
export function derivePlatformTypeFromUrl(url: string): WebhookPlatform {
  if (url?.startsWith("https://chat.googleapis.com")) {
    return WebhookPlatform.GoogleChat;
  } else if (url?.startsWith("https://discord.com")) {
    return WebhookPlatform.Discord;
  } else if (url?.startsWith("https://hooks.slack.com")) {
    return WebhookPlatform.Slack;
  }

  return WebhookPlatform.Unknown;
}
