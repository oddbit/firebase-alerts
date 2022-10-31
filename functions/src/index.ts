import {initializeApp} from "firebase-admin/app";
import {firestore, logger} from "firebase-functions/v1";
import {IWebhook, Webhook, WebhookPlatform} from "./webhook";

initializeApp();

export * from "./crashlytics/functions";

/**
 * Update new webhook documents default values.
 */
export const bootstrapwebhook = firestore
    .document("system-alert-webhooks/{id}")
    .onWrite((snap) => {
      if (!snap.after.exists) {
        logger.debug("Nothing to do on delete");
        return;
      }

      const webhook = snap.after.data() as IWebhook;
      if (!webhook.url) {
        logger.warn("Document didn't contain any webhook URL. Removing");
        return snap.after.ref.delete();
      }

      webhook.platform = derivePlatformTypeFromUrl(webhook.url);
      webhook.language ??= "en";

      if (JSON.stringify(webhook) === JSON.stringify(snap.after.data())) {
        logger.debug("No changes applied. Stop here.");
        return;
      }

      return snap.after.ref.update(webhook as object);
    });

/**
 * Derive which platform that this webhook is referring to based on its URL
 *
 * @param {string} url Webhook URL
 * @return {WebhookPlatform}
 */
function derivePlatformTypeFromUrl(url: string): WebhookPlatform {
  if (url.startsWith("https://chat.googleapis.com")) {
    return WebhookPlatform.GoogleChat;
  }

  throw Error("Unsupported webhook URL: " + url);
}
