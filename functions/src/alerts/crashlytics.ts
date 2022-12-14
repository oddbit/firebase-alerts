
import {firestore} from "firebase-admin";
import {logger} from "firebase-functions/v2";
import {crashlytics} from "firebase-functions/v2/alerts";
import {post} from "request";
import {AppCrash} from "../models/app-crash";
import {AppInfo, IAppInfo} from "../models/app-info";
import {IWebhook} from "../models/webhook";
import {makeFirebaseAppsSettingsUrl, makeFirestoreAppInfoUrl} from "../urls";
import {derivePlatformTypeFromUrl, webhookPlugins} from "../webhook-plugins";

/**
 * Handle crashlytics event
 *
 * @param {AppCrash} appCrash
 * @return {Promise}
 */
async function handleCrashlyticsEvent(appCrash: AppCrash):
  Promise<Promise<object | null>> {
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

  const webhooksSnap = await firestore()
      .collection("webhooks")
      .get();

  const promises = webhooksSnap.docs
      .map((doc) => doc.data() as IWebhook)
      .map((data) => {
        const platform = derivePlatformTypeFromUrl(data.url);
        // Ensure that there is a plugin registered for the current webhook
        if (!(platform in webhookPlugins)) {
          logger.error("[handleCrashlyticsEvent] Unsupported webhook: ", data);
          // Failing softly so we can proceed with other webhooks.
          return Promise.resolve();
        }

        // Call the builder function to create an instance of the
        // current platform webhook.
        logger.debug(`[handleCrashlyticsEvent] ${platform} webhook`, data);
        const webhook = webhookPlugins[platform](data);

        const webhookPayload = {
          body: JSON.stringify(
              webhook.createCrashlyticsMessage(appInfo, appCrash),
          ),
        };

        try {
          logger.info("[handleCrashlyticsEvent] Call webhook", webhookPayload);
          return post(webhook.url, webhookPayload, (err, res) => {
            if (err) throw err;
            logger.info("[handleCrashlyticsEvent] Webhook call OK", res);
          });
        } catch (error) {
          logger.error("[handleCrashlyticsEvent] Failed posting webhook.", {
            error,
            webhook,
            appCrash,
            webhookPayload,
          });

          // Failing softly so we can proceed with other webhooks.
          return Promise.resolve();
        }
      });

  return Promise.all(promises);
}


export const anr = crashlytics.onNewAnrIssuePublished(async (event) => {
  logger.debug("onNewAnrIssuePublished", event);

  const appCrash = AppCrash.fromCrashlytics(event);

  appCrash.tags.push("critical");

  return handleCrashlyticsEvent(appCrash);
});

export const fatal =
  crashlytics.onNewFatalIssuePublished((event) => {
    logger.debug("onNewFatalIssuePublished", event);

    const appCrash = AppCrash.fromCrashlytics(event);

    appCrash.tags.push("critical");

    return handleCrashlyticsEvent(appCrash);
  });


export const nonfatal =
  crashlytics.onNewNonfatalIssuePublished((event) => {
    logger.debug("onNewNonfatalIssuePublished", event);

    const appCrash = AppCrash.fromCrashlytics(event);

    return handleCrashlyticsEvent(appCrash);
  });

export const regression = crashlytics.onRegressionAlertPublished((event) => {
  logger.debug("onRegressionAlertPublished", event);

  const appCrash = AppCrash.fromCrashlytics(event);

  appCrash.tags.push("regression");

  return handleCrashlyticsEvent(appCrash);
});
