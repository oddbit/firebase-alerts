/**
 * Environment configuration settings and variables
 * This class abstracts the source of getting the values and provides helpful
 * error/exceptions if trying to access a variable in a context where it is not
 * defined. This solves the issue of otherwise the value just being undefined.
 *
 * Please note that this means that you should not access any environment
 * variables using `process.env.VARIABLE`.
 */
export class EnvConfig {
  /**
   * Get flag for whether the functions are running in emulator or not.
   * This can be derived by checking the existence of any emulator provided
   * variables.
   */
  static get isEmulated(): boolean {
    return !!process.env.FIREBASE_EMULATOR_HUB;
  }

  /**
   * Project ID
   * Derive it by checking any existence of the multiple environment variables
   * that are declared by Google.
   */
  static get projectId(): string {
    const FIREBASE_CONFIG = JSON.parse(process.env.FIREBASE_CONFIG || "{}");

    const projectId = FIREBASE_CONFIG.projectId ??
      process.env.GOOGLE_CLOUD_PROJECT ??
      process.env.GCLOUD_PROJECT ??
      process.env.GCP_PROJECT;

    if (!projectId) {
      throw new Error("Could not find project ID in any variable");
    }

    return projectId;
  }

  /**
   * Get cloud functions location
   */
  static get location(): string {
    return EnvConfig.getEnv("LOCATION");
  }

  /**
   * Get all webhooks as an array
   */
  static get webhooks(): string[] {
    return [
      process.env.WEBHOOK_SLACK,
      process.env.WEBHOOK_DISCORD,
      process.env.WEBHOOK_GOOGLE_CHAT,
    ].filter((x) => !!x) as string[];
  }


  /**
   * Get an environment variable's value
   *
   * @param {string} key Name of environment variable
   * @return {string} Environment variable value
   */
  private static getEnv(key: string): string {
    const value: string | undefined = process.env[key];
    if (!value) {
      throw new Error(`Missing required config key: ${key}`);
    }

    return value;
  }
}
