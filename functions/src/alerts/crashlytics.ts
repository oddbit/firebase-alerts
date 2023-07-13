
import {firestore} from "firebase-admin";
import {logger} from "firebase-functions/v2";
import {crashlytics} from "firebase-functions/v2/alerts";
import {post} from "request";
import {AppCrash} from "../models/app-crash";
import {AppInfo, IAppInfo} from "../models/app-info";
import {Webhook} from "../models/webhook";
import {makeFirebaseAppsSettingsUrl, makeFirestoreAppInfoUrl} from "../urls";
import {DiscordWebhook} from "../webhook-plugins/discord";
import {GoogleChatWebhook} from "../webhook-plugins/google-chat";
import {SlackWebhook} from "../webhook-plugins/slack";

const functionOpts = {
  region: process.env.LOCATION,
  secrets: ["WEBHOOK_SLACK", "WEBHOOK_DISCORD", "WEBHOOK_GOOGLE_CHAT"],
};

/**
 * Handle crashlytics event
 *
 * @param {AppCrash} appCrash
 * @return {Promise}
 */
async function handleCrashlyticsEvent(appCrash: AppCrash):
  Promise<object | void> {
  logger.debug("[handleCrashlyticsEvent]", appCrash);

  // Update and ensure that there is a Firestore document for this app id
  await firestore()
      .collection("apps")
      .doc(appCrash.appId)
      .set({
        appId: appCrash.appId,
        lastIssue: firestore.FieldValue.serverTimestamp(),
        issueCount: firestore.FieldValue.increment(1),
      }, {merge: true});


  const appInfoSnap = await firestore()
      .collection("apps")
      .doc(appCrash.appId)
      .get();

  logger.debug("[handleCrashlyticsEvent] App info", appInfoSnap.data());

  const appInfo = new AppInfo(appInfoSnap.data() as IAppInfo);
  if (!appInfo.bundleId) {
    // Will need to add this information explicitly by copying the bundle id
    // from Firebase Console project overview. The console log below will
    // provide links to add the configuration.
    logger.warn(
        "[handleCrashlyticsEvent] No bundle id for app. Fix it manually", {
          appInfo,
          settings: makeFirebaseAppsSettingsUrl(),
          firestore: makeFirestoreAppInfoUrl(appInfo),
        });
  }

  const webhooks: Webhook[] = [];

  if (process.env.WEBHOOK_SLACK) {
    logger.debug("[handleCrashlyticsEvent] Found slack webhook");
    webhooks.push(new SlackWebhook({
      url: process.env.WEBHOOK_SLACK,
      language: process.env.LANGUAGE,
    }));
  }

  if (process.env.WEBHOOK_DISCORD) {
    logger.debug("[handleCrashlyticsEvent] Found Discord webhook");
    webhooks.push(new DiscordWebhook({
      url: process.env.WEBHOOK_DISCORD,
      language: process.env.LANGUAGE,
    }));
  }

  if (process.env.WEBHOOK_GOOGLE_CHAT) {
    logger.debug("[handleCrashlyticsEvent] Found Google Chat webhook");
    webhooks.push(new GoogleChatWebhook({
      url: process.env.WEBHOOK_GOOGLE_CHAT,
      language: process.env.LANGUAGE,
    }));
  }

  if (webhooks.length === 0) {
    logger.error("No webhooks defined. Please reconfigure the extension!");
    return;
  }

  const promises = [];
  for (const webhook of webhooks) {
    logger.debug("[handleCrashlyticsEvent] Webhook", webhook);
    const webhookPayload = {
      body: JSON.stringify(webhook.createCrashlyticsMessage(appInfo, appCrash)),
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

    appCrash.tags.push("critical");

    return handleCrashlyticsEvent(appCrash);
  });

export const fatal =
  crashlytics.onNewFatalIssuePublished(functionOpts, (event) => {
    logger.debug("onNewFatalIssuePublished", event);

    const appCrash = AppCrash.fromCrashlytics(event);

    appCrash.tags.push("critical");

    return handleCrashlyticsEvent(appCrash);
  });


export const nonfatal =
  crashlytics.onNewNonfatalIssuePublished(functionOpts, (event) => {
    logger.debug("onNewNonfatalIssuePublished", event);

    const appCrash = AppCrash.fromCrashlytics(event);

    return handleCrashlyticsEvent(appCrash);
  });

export const regression =
  crashlytics.onRegressionAlertPublished(functionOpts, (event) => {
    logger.debug("onRegressionAlertPublished", event);

    const appCrash = AppCrash.fromCrashlytics(event);

    appCrash.tags.push("regression");

    return handleCrashlyticsEvent(appCrash);
  });
