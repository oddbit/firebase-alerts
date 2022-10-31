export type LocalizedString = {[key: string]: string};

/**
 * Declares a class for handling translation assets with language fallback.
 */
export class Localization {
  /**
   * Constructor
   *
   * @param {object} strings Object with string translations
   * @param {string} language The language to use
   */
  constructor(strings: {[key: string]: LocalizedString}, language?: string) {
    this.strings = strings;
    this.language = language ?? Localization.defaultLanguage;
  }

  public static readonly defaultLanguage = "en";
  private readonly strings: {[key: string]: LocalizedString};
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
