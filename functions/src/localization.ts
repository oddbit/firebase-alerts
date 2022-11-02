export type LocalizedString = {[key: string]: string};

/**
 * Support for translating the webhook information to other languages
 */
const l10n = {
  "openFirebaseConsole": {
    "en": "Open Firebase Console",
  },
  "createGithubIssue": {
    "en": "Create Github Issue",
  },
  "searchGithubIssue": {
    "en": "Search Similar Github Issues",
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
    const str = this.strings[key][this.language];
    if (!str) {
      throw new Error("Key not found: " + key);
    }
    return str;
  }
}
