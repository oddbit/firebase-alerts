import {firestore} from "firebase-admin";
import {logger} from "firebase-functions/v2";
import {
  PerformanceEvent,
  ThresholdAlertPayload} from "firebase-functions/v2/alerts/performance";
import {AppInfo, IAppInfo} from "../models/app-info";
import {makeFirebaseAppsSettingsUrl, makeFirestoreAppInfoUrl} from "../urls";
import {AppCrash} from "../models/app-crash";

/**
 * Update app performance and log info
 *
 * @param {PerformanceEvent<ThresholdAlertPayload>} event
 * @param {string} logType
 * @return {Promise<AppInfo>}
 */
export async function updateAppLogInfo(
    event: PerformanceEvent<ThresholdAlertPayload> | AppCrash,
    logType: string
): Promise<AppInfo> {
// Update and ensure that there is a Firestore document for this app id
  await firestore()
      .collection("apps")
      .doc(event.appId)
      .set({
        appId: event.appId,
        lastIssue: firestore.FieldValue.serverTimestamp(),
        issueCount: firestore.FieldValue.increment(1),
      }, {merge: true});

  const appInfoSnap = await firestore()
      .collection("apps")
      .doc(event.appId)
      .get();

  logger.debug("["+logType+ "] App info", appInfoSnap.data());

  const appInfo = new AppInfo(appInfoSnap.data() as IAppInfo);
  if (!appInfo.bundleId) {
  // Will need to add this information explicitly by copying the bundle id
  // from Firebase Console project overview. The console log below will
  // provide links to add the configuration.
    logger.warn(
        "["+logType+"] No bundle id for app. Fix it manually", {
          appInfo,
          settings: makeFirebaseAppsSettingsUrl(),
          firestore: makeFirestoreAppInfoUrl(appInfo),
        });
  }
  return appInfo;
}
