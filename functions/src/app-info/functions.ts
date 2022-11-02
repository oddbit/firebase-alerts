import {firestore, logger} from "firebase-functions/v1";
import {AppPlatform, IAppInfo} from "./app-info";

/**
 * Update new webhook documents default values.
 */
export const bootstrap = firestore
    .document("firebase-alerts-apps/{id}")
    .onWrite((snap, context) => {
      if (!snap.after.exists) {
        logger.debug("Nothing to do on delete");
        return null;
      }

      const appInfo = snap.after.data() as IAppInfo;

      appInfo.appId = context.params.id;
      appInfo.platform = derivePlatformTypeFromId(context.params.id);
      appInfo.issueCount ??= 0;
      appInfo.lastIssue ??= new Date();

      if (JSON.stringify(appInfo) === JSON.stringify(snap.after.data())) {
        logger.debug("No changes applied. Stop here.");
        return null;
      }

      return snap.after.ref.update(appInfo as object);
    });

/**
 * Derive which app platform that this app info is referring to based on its URL
 *
 * @param {string} appId app ID
 * @return {AppPlatform}
 */
function derivePlatformTypeFromId(appId: string): AppPlatform {
  if (appId.includes("android")) {
    return AppPlatform.Android;
  } else if (appId.includes("ios")) {
    return AppPlatform.iOS;
  }

  throw Error("Unsupported webhook URL: " + appId);
}

