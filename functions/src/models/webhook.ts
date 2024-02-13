import {AppCrash} from "./app-crash";
import {Localization} from "../utils/localization";
import { InAppFeedback, NewTesterDevice } from "./app-distribution";

export interface IWebhook {
  url: string;
  language?: string;
}

/**
 * Declares Webhook class
 */
export abstract class Webhook implements IWebhook {
  /**
   * Constructor
   *
   * @param {IWebhook} webhook Webhook data
   */
  constructor(webhook: IWebhook) {
    this.url = webhook.url;
    this.language = Localization.defaultLanguage;
  }

  public readonly url: string;
  public readonly language: string;

  /**
   * Creates a JSON payload for a message about new app feedback
   *
   * @param {InAppFeedback} appFeedback
   * @return {object} Message payload
   */
  public abstract createAppFeedbackMessage(appFeedback: InAppFeedback): object;

  /**
   * Creates a JSON payload for a message about new tester device
   *
   * @param {NewTesterDevice} newTesterDevice
   * @return {object} Message payload
   */
  public abstract createNewTesterDeviceMessage(
    newTesterDevice: NewTesterDevice,
  ): object;

  /**
   * Create message payload for the webhook to send a crashlytics message
   *
   * @param {AppCrash} appCrash
   * @return {object} Message payload
   */
  public abstract createCrashlyticsMessage(appCrash: AppCrash): object;
}
