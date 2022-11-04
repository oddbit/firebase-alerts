import {Github, IGithub} from "./github";

export enum AppPlatform {
  iOS = "ios",
  Android = "android",
  Unknown = "unknown",
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

  /**
   * Last time an issue was reported
   */
  lastIssue?: Date;

  /**
   * Number of issues tracked
   */
  issueCount: number;

  /**
   * Optional github information
   */
  github?: IGithub;
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
    this.lastIssue = data.lastIssue;
    this.issueCount = data.issueCount ?? 0;
    this.github = data.github ? new Github(data.github) : undefined;
  }

  public readonly appId: string;
  public readonly bundleId: string;
  public readonly lastIssue?: Date;
  public readonly issueCount: number;
  public readonly github?: IGithub | undefined;

  /**
 * Derive which app platform that this app info is referring to
 * based on its `appId`
 *
 * @return {AppPlatform}
 */
  public get platform(): AppPlatform {
    if (this.appId.includes("android")) {
      return AppPlatform.Android;
    } else if (this.appId.includes("ios")) {
      return AppPlatform.iOS;
    }

    return AppPlatform.Unknown;
  }
}
