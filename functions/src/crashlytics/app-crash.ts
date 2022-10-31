import {
  CrashlyticsEvent,
  NewAnrIssuePayload,
  NewFatalIssuePayload,
  NewNonfatalIssuePayload,
  RegressionAlertPayload,
} from "firebase-functions/v2/alerts/crashlytics";

import {projectId} from "../config";

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
    return new AppCrash({
      eventTitle: event.type,
      issueId: event.data.payload.issue.id,
      issueTitle: event.data.payload.issue.title,
      appId: event.appId,
      appVersion: event.data.payload.issue.appVersion,
    });
  }

  public readonly eventTitle: string;
  public readonly issueId: string;
  public readonly issueTitle: string;
  public readonly appId: string;
  public readonly appVersion: string;
  public readonly tags = ["bug"];

  /**
   * Get the firebase console URL from this app crash
   */
  public get firebaseConsoleUrl(): string {
    return `https://console.firebase.google.com/project/${projectId}/crashlytics/app/${this.appId}/issues/${this.issueId}`;
  }
}
