import {AppInfo} from "../../../models/app-info";
import {GoogleChatCard} from "../../../models/google-chat";
import {makeGithubIssueUrl, makeGithubSearchUrl} from "../../../urls";
import {EnvConfig} from "../../../utils/env-config";
import {Localization} from "../../../utils/localization";

/**
   * Adds a Github section to the Google Chat card
   * @param {GoogleChatCard} googleChatCard
   * @param {AppInfo} appInfo
   * @param {string} issueTitle
   * @param {string[]} tags
   * @return {void}
   */
export function addGithubSection(
    googleChatCard: GoogleChatCard,
    appInfo: AppInfo,
    issueTitle: string,
    tags: string[]) {
  const l10n = new Localization(EnvConfig.language);
  if (appInfo.github) {
    googleChatCard.card.sections.push({
      header: "Github",
      widgets: [
        {
          buttonList: {
            buttons: [
              {
                text: l10n.translate("createGithubIssue"),
                onClick: {
                  openLink: {
                    url: makeGithubIssueUrl(
                        appInfo,
                        issueTitle,
                        tags
                    ),
                  },
                },
              },
              {
                text: l10n.translate("searchGithubIssue"),
                onClick: {
                  openLink: {
                    url: makeGithubSearchUrl(
                        appInfo,
                        issueTitle,
                    ),
                  },
                },
              },
            ],
          },
        },
      ],
    });
  }
}
