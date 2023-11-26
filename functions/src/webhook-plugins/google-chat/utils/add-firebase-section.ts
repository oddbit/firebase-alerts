import {AppInfo} from "../../../models/app-info";
import {GoogleChatCard} from "../../../models/google-chat";
import {
  makeFirebaseAppsSettingsUrl,
  makeFirestoreAppInfoUrl,
} from "../../../urls";
import {EnvConfig} from "../../../utils/env-config";
import {Localization} from "../../../utils/localization";

/**
   * Adds a Firebase section to the Google Chat card
   * @param {GoogleChatCard} googleChatCard
   * @param {AppInfo} appInfo
   * @param {string} url
   * @return {void}
  */
export function addFirebaseSection(
    googleChatCard: GoogleChatCard,
    appInfo: AppInfo,
    url: string
): void {
  const l10n = new Localization(EnvConfig.language);
  const firebaseSection = {
    header: "Firebase",
    widgets: [] as object[],
  };
  googleChatCard.card.sections.push(firebaseSection);

  if (appInfo.bundleId) {
  // Need the bundle ID in order to link to Firebase Console
    firebaseSection.widgets.push({
      buttonList: {
        buttons: [
          {
            text: l10n.translate("openCrashlyticsIssue"),
            onClick: {
              openLink: {
                url: url,
              },
            },
          },
        ],
      },
    });
  } else {
    firebaseSection.widgets.push({
      buttonList: {
        buttons: [
          {
            text: l10n.translate("openFirebaseAppsSettings"),
            onClick: {
              openLink: {
                url: makeFirebaseAppsSettingsUrl(),
              },
            },
          },
          {
            text: l10n.translate("openFirestoreAppInfo"),
            onClick: {
              openLink: {
                url: makeFirestoreAppInfoUrl(appInfo),
              },
            },
          },
        ],
      },
    });
  }
}
