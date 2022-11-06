import {
  PerformanceEvent,
  ThresholdAlertPayload,
} from "firebase-functions/v2/alerts/performance";

export enum PerformanceAlertType {
  Threshold = "performance.threshold",
  Unknown = "performance.unknown",
}

export type SupportedPerformanceAlert = PerformanceEvent<ThresholdAlertPayload>;

export interface IPerformanceAlert {
  appId: string;
  alertType: PerformanceAlertType;
}

/**
 * Declares a class for Firebase performance alerts
 */
export class PerformanceAlert implements IPerformanceAlert {
  /**
   * Constructor
   *
   * @param {IPerformanceAlert} data
   */
  constructor(data: IPerformanceAlert) {
    this.appId = data.appId;
    this.alertType = data.alertType;
  }

  /**
   * Factory constructor
   *
   * @param {SupportedPerformanceAlert} event Performance alert event
   * @return {AppCrash} An instance of `PerformanceAlert` class
   */
  public static fromPerformanceEvent(event: SupportedPerformanceAlert):
  PerformanceAlert {
    event.specversion
    const performanceAlert = {
      appId: event.appId,

    } as IPerformanceAlert;

    const alertTypeLower = event.alertType.toLowerCase();

    if (alertTypeLower.includes("threshold")) {
      performanceAlert.alertType= PerformanceAlertType.Threshold;
    } else {
      performanceAlert.alertType= PerformanceAlertType.Unknown;
    }

    return new PerformanceAlert(performanceAlert);
  }

  public readonly appId: string;
  public readonly alertType: PerformanceAlertType;
}
