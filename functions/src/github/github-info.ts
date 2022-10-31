import {AppCrash} from "../crashlytics/app-crash";

export interface IGithubInfo {
  /**
   * Github repository name with owner (e.g oddbit/firebase-alerts)
   */
  repo: string;
  project?: string;
  defaultTags: string[];
}


/**
 * Declares a class with repo info for an app
 */
export class GithubInfo implements IGithubInfo {
  /**
   * Constructor
   *
   * @param {IGithubInfo} githubInfo Github info data
   */
  constructor(githubInfo: IGithubInfo) {
    this.repo = githubInfo.repo;
    this.project = githubInfo.project;
    this.defaultTags = [...(githubInfo.defaultTags ?? [])];
  }

  public readonly repo: string;
  public readonly project?: string | undefined;
  public readonly defaultTags: string[];

  /**
   * Make an Github URL to create an issue from this app crash
   *
   * @param {AppCrash} appCrash
   * @return {string} URL to create a github issue
   */
  public makeGithubIssueUrl(appCrash: AppCrash): string {
    const attributes = [
      `title=${encodeURI(appCrash.eventTitle)}`,
      `labels=${appCrash.tags.map((tag) => encodeURI(tag)).join(",")}`,
    ];

    return `https://github.com/${this.repo}/issues/new?${attributes.join("&")}`;
  }

  /**
   * Make an Github URL to search for issues from this app crash
   *
   * @param {AppCrash} appCrash
   * @return {string} URL to search for github issues
   */
  public makeGithubSearchUrl(appCrash: AppCrash): string {
    return `https://github.com/${this.repo}/issues?q=${encodeURI(appCrash.eventTitle)}`;
  }
}
