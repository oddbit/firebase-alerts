export interface IGithub {
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
export class Github implements IGithub {
  /**
   * Constructor.
   *
   * @param {IGithub} data Initial data
   */
  constructor(data: IGithub) {
    this.repo = data.repo;
    this.project = data.project;
  }

  public readonly repo: string;
  public readonly project?: string | undefined;
}
