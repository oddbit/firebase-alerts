import {IssueType} from "./models/app-crash";

export type LocalizedString = {[key: string]: string};

/**
 * Support for translating the webhook information to other languages
 */
const l10n = {
  [IssueType.Anr]: {
    "en": "App Non Responsive",
  },
  [IssueType.Fatal]: {
    "en": "Fatal Issue",
  },
  [IssueType.NonFatal]: {
    "en": "Non Fatal Issue",
  },
  [IssueType.Regression]: {
    "en": "Regression Issue",
  },
  [IssueType.Unknown]: {
    "en": "Unknown Issue",
  },
  "labelAppInfo": {
    "en": "App Info",
  },
  "labelVersion": {
    "en": "Version",
  },
  "labelBundleId": {
    "en": "Bundle Id",
  },
  "missingBundleId": {
    "en": "Missing bundle id",
  },
  "openCrashlyticsIssue": {
    "en": "Open Crashlytics",
  },
  "openFirebaseAppsSettings": {
    "en": "Open Firebase Apps List",
  },
  "openFirestoreAppInfo": {
    "en": "Update Firestore Document",
  },
  "createGithubIssue": {
    "en": "Create Github Issue",
  },
  "searchGithubIssue": {
    "en": "Search Similar Github Issues",
  },
  "descriptionViewInCrashlytics": {
    "en": "View this issue in Firebase console",
  },
  "descriptionCreateNewIssue": {
    "en": "Create a new bug report for this issue",
  },
  "descriptionSearchSimilarIssues": {
    "en": "Search for similar reports of this issue",
  },
  "descriptionOpenFirebaseAppsSettings": {
    "en": "Go to Firebase console and copy the apps bundle id",
  },
  "descriptionOpenFirestoreAppInfo": {
    "en": "Open Firestore and update app info document with bundle id",
  },
};


/**
 * Declares a class for handling translation assets with language fallback.
 */
export class Localization {
  /**
   * Constructor
   *
   * @param {string} language The language to use
   */
  constructor(language?: string) {
    this.language = language ?? Localization.defaultLanguage;
  }

  public static readonly defaultLanguage = "en";
  private readonly strings: {[key: string]: LocalizedString} = l10n;
  private readonly language: string;

  /**
   * Translates a string
   *
   * @param {string} key Translation text to return
   * @return {string} Returns the string translation if available
   */
  public translate(key: string): string {
    if (!(key in this.strings)) {
      throw new Error("Key not found: " + key);
    }
    return this.strings[key][this.language] ??
      this.strings[key][Localization.defaultLanguage];
  }
}
