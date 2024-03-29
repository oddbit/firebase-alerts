import {CrashlyticsAlertType} from "../models/app-crash";

export type LocalizedString = {[key: string]: string};

/**
 * Support for translating the webhook information to other languages
 */
const l10n = {
  [CrashlyticsAlertType.Anr]: {
    "en": "App Non Responsive",
  },
  [CrashlyticsAlertType.Fatal]: {
    "en": "Fatal Issue",
  },
  [CrashlyticsAlertType.NonFatal]: {
    "en": "Non Fatal Issue",
  },
  [CrashlyticsAlertType.Regression]: {
    "en": "Regression Issue",
  },
  [CrashlyticsAlertType.Unknown]: {
    "en": "Unknown Issue",
  },
  "alertCondition": {
    "en": "Alert Condition",
  },
  "percentile": {
    "en": "Percentile",
  },
  "metricType": {
    "en": "Metric Type",
  },
  "violation": {
    "en": "Violation",
  },
  "numSamples": {
    "en": "Number of samples",
  },
  "appVersion": {
    "en": "App Version",
  },
  "platform": {
    "en": "Platform",
  },
  "bundleId": {
    "en": "Bundle Id",
  },
  "tester": {
    "en": "Tester",
  },
  "ctaViewIssueCrashlytics": {
    "en": "Open Crashlytics",
  },
  "ctaOpenAppFeedback": {
    "en": "Open App Feedback",
  },
  "ctaViewScreenshot": {
    "en": "View Screenshot",
  },
  "ctaInvestigate": {
    "en": "Investigate",
  },
  "performance": {
    "en": "Performance",
  },
  "imgAltPerformance": {
    "en": "Firebase Performance logo",
  },
  "appDistribution": {
    "en": "App Distribution",
  },
  "imgAltAppDistribution": {
    "en": "App Distribution logo",
  },
  "crashlytics": {
    "en": "Crashlytics",
  },
  "imgAltCrashlytics": {
    "en": "Crashlytics logo",
  },
  "labelInAppFeedback": {
    "en": "In App Feedback",
  },
  "labelNewTesterDevice": {
    "en": "New Tester Device",
  },
  "labelUserFeedback": {
    "en": "User Feedback",
  },
  "labelFirebase": {
    "en": "Firebase",
  },
  "labelDeviceModel": {
    "en": "Device Model",
  },
  "labelDeviceIdentifier": {
    "en": "Device Identifier",
  },
  "labelIssueTracker": {
    "en": "Issue Tracker",
  },
  "ctaCreateIssue": {
    "en": "Create Issue",
  },
  "ctaSearchIssue": {
    "en": "Search Similar Issues",
  },
  "descriptionInvestigateFirebase": {
    "en": "Investigate this issue in Firebase console",
  },
  "descriptionViewInCrashlytics": {
    "en": "View this issue in Firebase console",
  },
  "descriptionViewInFirebaseConsole": {
    "en": "View this in Firebase console",
  },
  "descriptionCreateNewIssue": {
    "en": "Create a new bug report for this issue",
  },
  "descriptionSearchSimilarIssues": {
    "en": "Search for similar reports of this issue",
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

    // Fallback on default language if provided language doesn't exist
    return this.strings[key][this.language] ??
      this.strings[key][Localization.defaultLanguage];
  }
}
