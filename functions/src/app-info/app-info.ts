export enum AppPlatform {
  iOS = "ios",
  Android = "android",
}

export interface IAppInfo {
  /**
   * Firebase app ID (e.g `1:269808624035:android:296863cf1f5b6817c87a16`)
   */
  appId: string;

  /**
   * Bundle id (e.g `id.oddbit.hello_world`)
   * This ID is necessary for being able to make links into the Firebase console
   * and it can not be automatically derived from Crashlytics data. It must be
   * manually entered by cross checking `appId` with your app in the console.
   */
  bundleId: string;

  platform: AppPlatform;

  /**
   * Last time an issue was reported
   */
  lastIssue: Date;

  /**
   * Number of issues tracked
   */
  issueCount: number;

  /**
   * Github repository name with owner (e.g oddbit/firebase-alerts)
   */
  repo: string;

  /**
   * Optional github project ID (e.g `oddbit/1`)
   */
  project?: string;
}

/**
 * Implements a class for containing relevant app information
 */
export class AppInfo implements IAppInfo {
  /**
   * Constructor.
   *
   * @param {IAppInfo} data Initial data
   */
  constructor(data: IAppInfo) {
    this.appId = data.appId;
    this.bundleId = data.bundleId;
    this.platform = data.platform;
    this.lastIssue = data.lastIssue;
    this.issueCount = data.issueCount;
    this.repo = data.repo;
    this.project = data.project;
  }

  public readonly appId: string;
  public readonly bundleId: string;
  public readonly platform: AppPlatform;
  public readonly lastIssue: Date;
  public readonly issueCount: number;
  public readonly repo: string;
  public readonly project?: string | undefined;
}
