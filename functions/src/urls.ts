import {AppCrash} from "./models/app-crash";
import {EnvConfig} from "./utils/env-config";

export const crashlyticsImgUrl = "https://github.com/oddbit/firebase-alerts/raw/main/icons/crashlytics.png";
export const appDistributionImgUrl = "https://github.com/oddbit/firebase-alerts/raw/main/icons/app-distribution.png";
export const performaceImgUrl = "https://github.com/oddbit/firebase-alerts/raw/main/icons/performance.png";

/**
 * Generate a URL to Firebase Console for the issue
 *
 * @param {AppCrash} appCrash
 * @return {string} URL to Firebase console
 */
export function makeCrashlyticsIssueUrl(appCrash: AppCrash): string {
  return `https://console.firebase.google.com/project/${EnvConfig.projectId}/crashlytics/app/${EnvConfig.platform}:${EnvConfig.bundleId}/issues/${appCrash.issueId}`;
}

/**
 * Generate a URL to Firebase Console apps settings
 *
 * @return {string} URL to Firebase console
 */
export function makeFirebaseAppsSettingsUrl(): string {
  return `https://console.firebase.google.com/project/${EnvConfig.projectId}/settings/general`;
}

/**
 * Make a repository URL to create an issue from this app crash
 *
 * @param {AppCrash} appCrash
 * @return {string} URL to create a github issue
 */
export function makeRepositoryIssueUrl(appCrash: AppCrash): string {
  const repositoryUrl = EnvConfig.repositoryUrl;
  if (repositoryUrl.startsWith("https://github.com")) {    
    const attributes = [
      `title=${encodeURI(appCrash.issueTitle)}`,
      `labels=${appCrash.tags.map((tag) => encodeURI(tag)).join(",")}`,
    ];

    return `${repositoryUrl}/issues/new?${attributes.join("&")}`;
  }

  throw new Error("Unknown repository type: " + repositoryUrl);
}

/**
 * Make a repository URL to search for issues from this app crash
 *
 * @param {AppCrash} appCrash
 * @return {string} URL to search for github issues
 */
export function makeRepositorySearchUrl(appCrash: AppCrash): string {
  const repositoryUrl = EnvConfig.repositoryUrl;
  if (repositoryUrl.startsWith("https://github.com")) {    
    return `${repositoryUrl}/issues?q=${encodeURI(appCrash.issueTitle)}`;
  }

  throw new Error("Unknown repository type: " + repositoryUrl);
}

