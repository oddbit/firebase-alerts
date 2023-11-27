import {AppInfo} from "./models/app-info";
import {AppCrash} from "./models/app-crash";
import {EnvConfig} from "./utils/env-config";

const imageBaseURL = "https://github.com/oddbit/firebase-alerts/raw/main/icons";
export const crashlyticsImgUrl = imageBaseURL + "/crashlytics.png";
export const performanceImgUrl = imageBaseURL + "/performance.png";

/**
 * Generate a URL to Firebase Console for the issue
 *
 * @param {AppInfo} appInfo
 * @param {AppCrash} appCrash
 * @return {string} URL to Firebase console
 */
export function makeCrashlyticsIssueUrl(
    appInfo: AppInfo,
    appCrash: AppCrash,): string {
  return `https://console.firebase.google.com/project/${EnvConfig.projectId}/crashlytics/app/${appInfo.platform}:${appInfo.bundleId}/issues/${appCrash.issueId}`;
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
 * Generate a URL to Firestore app info document
 *
 * @param {AppInfo} appInfo
 * @return {string} URL to Firebase console
 */
export function makeFirestoreAppInfoUrl(appInfo: AppInfo): string {
  return `https://console.firebase.google.com/project/${EnvConfig.projectId}/firestore/data/~2F${process.env.EXT_INSTANCE_ID}-apps~2F${appInfo.appId}`;
}

/**
 * Make an Github URL to create an issue from this app crash
 *
 * @param {AppInfo} appInfo
 * @param {string} issueTitle
 * @param {string[]} tags
 * @return {string} URL to create a github issue
 */
export function makeGithubIssueUrl(
    appInfo: AppInfo,
    issueTitle: string,
    tags: string[],
): string {
  const attributes = [
    `title=${encodeURI(issueTitle)}`,
    `labels=${tags.map((tag) => encodeURI(tag)).join(",")}`,
  ];

  return `https://github.com/${appInfo.github?.repo}/issues/new?${attributes.join("&")}`;
}

/**
 * Make an Github URL to search for issues from this app crash
 *
 * @param {AppInfo} appInfo
 * @param {string} issueTitle
 * @return {string} URL to search for github issues
 */
export function makeGithubSearchUrl(
    appInfo: AppInfo,
    issueTitle: string,): string {
  return `https://github.com/${appInfo.github?.repo}/issues?q=${encodeURI(issueTitle)}`;
}

