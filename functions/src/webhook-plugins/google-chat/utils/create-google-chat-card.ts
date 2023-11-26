import {AppInfo} from "../../../models/app-info";
import {GoogleChatCard} from "../../../models/google-chat";
import {EnvConfig} from "../../../utils/env-config";
import {Localization} from "../../../utils/localization";

/**
  * Create a Google Chat card
  * @param {AppInfo} appInfo
  * @param {string} title
  * @param {string} subtitle
  * @param {string} imageUrl
  * @param {string} imageAltText
  * @return {GoogleChatCard} A Google Chat card
  */
export function createGoogleChatCard(
    appInfo: AppInfo,
    title: string,
    subtitle: string,
    imageUrl: string,
    imageAltText: string
): GoogleChatCard {
  const l10n = new Localization(EnvConfig.language);
  const bundleId = appInfo.bundleId ?? l10n.translate("missingBundleId");

  return {
    cardId: Date.now() + "-" + Math.round((Math.random() * 10000)),
    card: {
      header: {
        title: title,
        subtitle: subtitle,
        imageUrl: imageUrl,
        imageType: "CIRCLE",
        imageAltText: imageAltText,
      },
      sections: [
        {
          header: title,
          widgets: [
            {
              decoratedText: {
                topLabel: l10n.translate("labelBundleId"),
                text: `${bundleId} (${appInfo.platform})`,
              },
            },
          ],
        },
      ],
    },
  };
}
