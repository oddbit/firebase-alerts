import {AppInfo} from "./models/app-info";
import {projectId} from "./config";
import {AppCrash} from "./models/app-crash";

export const crashlyticsImgUrl = "https://github.com/oddbit/firebase-alerts/raw/main/icons/crashlytics.png";

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
  return `https://console.firebase.google.com/project/${projectId}/crashlytics/app/${appInfo.platform}:${appInfo.bundleId}/issues/${appCrash.issueId}`;
}

/**
 * Generate a URL to Firebase Console apps settings
 *
 * @return {string} URL to Firebase console
 */
export function makeFirebaseAppsSettingsUrl(): string {
  return `https://console.firebase.google.com/project/${projectId}/settings/general`;
}

/**
 * Generate a URL to Firestore app info document
 *
 * @param {AppInfo} appInfo
 * @return {string} URL to Firebase console
 */
export function makeFirestoreAppInfoUrl(appInfo: AppInfo): string {
  return `https://console.firebase.google.com/project/${projectId}/firestore/data/~2Ffirebase-alerts-apps~2F${appInfo.appId}`;
}

/**
 * Make an Github URL to create an issue from this app crash
 *
 * @param {AppInfo} appInfo
 * @param {AppCrash} appCrash
 * @return {string} URL to create a github issue
 */
export function makeGithubIssueUrl(
    appInfo: AppInfo,
    appCrash: AppCrash,): string {
  const attributes = [
    `title=${encodeURI(appCrash.issueTitle)}`,
    `labels=${appCrash.tags.map((tag) => encodeURI(tag)).join(",")}`,
  ];

  return `https://github.com/${appInfo.github?.repo}/issues/new?${attributes.join("&")}`;
}

/**
 * Make an Github URL to search for issues from this app crash
 *
 * @param {AppInfo} appInfo
 * @param {AppCrash} appCrash
 * @return {string} URL to search for github issues
 */
export function makeGithubSearchUrl(
    appInfo: AppInfo,
    appCrash: AppCrash,): string {
  return `https://github.com/${appInfo.github?.repo}/issues?q=${encodeURI(appCrash.issueTitle)}`;
}

