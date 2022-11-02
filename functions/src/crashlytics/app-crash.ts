import {
  CrashlyticsEvent,
  NewAnrIssuePayload,
  NewFatalIssuePayload,
  NewNonfatalIssuePayload,
  RegressionAlertPayload,
} from "firebase-functions/v2/alerts/crashlytics";

export interface IAppCrash {
  eventTitle: string;
  issueId: string;
  issueTitle: string;
  appId: string;
  appVersion: string;
}

type SupportedCrashlyticsEvent = CrashlyticsEvent<NewAnrIssuePayload>
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
    this.eventTitle = data.eventTitle;
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

    if (event.alertType === "crashlytics.NewAnrIssue") {
      appCrash.eventTitle = "App Non Responsive";
    } else if (event.alertType === "crashlytics.newFatalIssue") {
      appCrash.eventTitle = "Fatal Issue";
    } else if (event.alertType === "crashlytics.newNonFatalIssue") {
      appCrash.eventTitle = "Non Fatal Issue";
    } else if (event.alertType === "crashlytics.RegressionAlert") {
      appCrash.eventTitle = "Regression Alert";
    } else {
      appCrash.eventTitle = "Unknown";
    }

    return new AppCrash(appCrash);
  }

  public readonly eventTitle: string;
  public readonly issueId: string;
  public readonly issueTitle: string;
  public readonly appId: string;
  public readonly appVersion: string;
  public readonly tags = ["bug"];
}
