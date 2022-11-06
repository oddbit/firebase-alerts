import {
  CrashlyticsEvent,
  NewAnrIssuePayload,
  NewFatalIssuePayload,
  NewNonfatalIssuePayload,
  RegressionAlertPayload,
} from "firebase-functions/v2/alerts/crashlytics";

export interface IAppCrash {
  issueType: CrashlyticsAlertType;
  issueId: string;
  issueTitle: string;
  appId: string;
  appVersion: string;
}

export enum CrashlyticsAlertType {
  Anr = "crashlytics.anr",
  Fatal = "crashlytics.fatal",
  NonFatal = "crashlytics.nonfatal",
  Regression = "crashlytics.regression",
  Unknown = "crashlytics.unknown",
}

export type SupportedCrashlyticsEvent = CrashlyticsEvent<NewAnrIssuePayload>
 | CrashlyticsEvent<NewFatalIssuePayload>
 | CrashlyticsEvent<NewNonfatalIssuePayload>
 | CrashlyticsEvent<RegressionAlertPayload>;


/**
 * Implements a class for containing relevant Crashlytics event information
 */
export class AppCrash implements IAppCrash {
  /**
   * Constructor.
   *
   * @param {IAppCrash} data Initial data
   */
  constructor(data: IAppCrash) {
    this.appId = data.appId;
    this.appVersion = data.appVersion;
    this.issueId = data.issueId;
    this.issueTitle = data.issueTitle;
    this.issueType = data.issueType;
  }

  /**
   * Factory constructor
   *
   * @param {SupportedCrashlyticsEvent} event Crashlytics event
   * @return {AppCrash} An instance of `AppCrash` class
   */
  public static fromCrashlytics(event: SupportedCrashlyticsEvent): AppCrash {
    const appCrash = {
      issueId: event.data.payload.issue.id,
      issueTitle: event.data.payload.issue.title,
      appId: event.appId,
      appVersion: event.data.payload.issue.appVersion,
    } as IAppCrash;

    const alertTypeLower = event.alertType.toLowerCase();

    if (alertTypeLower.includes("anrissue")) {
      appCrash.issueType= CrashlyticsAlertType.Anr;
    } else if (alertTypeLower.includes("nonfatalissue")) {
      appCrash.issueType= CrashlyticsAlertType.NonFatal;
    } else if (alertTypeLower.includes("fatalissue") &&
      !alertTypeLower.includes("nonfatal")) {
      // Make sure we don't match "nonfatal"
      appCrash.issueType= CrashlyticsAlertType.Fatal;
    } else if (alertTypeLower.includes("regression")) {
      appCrash.issueType= CrashlyticsAlertType.NonFatal;
    } else {
      appCrash.issueType= CrashlyticsAlertType.Unknown;
    }

    return new AppCrash(appCrash);
  }

  public readonly issueType: CrashlyticsAlertType;
  public readonly issueId: string;
  public readonly issueTitle: string;
  public readonly appId: string;
  public readonly appVersion: string;
  public readonly tags = ["bug"];
}
