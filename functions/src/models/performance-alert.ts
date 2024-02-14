import {
  PerformanceEvent,
  ThresholdAlertPayload,
} from "firebase-functions/v2/alerts/performance";

/**
 * Declares a class for Firebase performance alerts
 */
export class PerformanceAlert {
/**
 * Constructor for the PerformanceAlert class.
 *
 * @param {string} appId - The unique identifier for the application.
 * @param {string} eventName - Name of the trace or network request this alert is for (e.g., 'my_custom_trace', 'firebase.com/api/123').
 * @param {string} eventType - The resource type this alert is for (e.g., 'trace', 'network request', 'screen rendering').
 * @param {string} metricType - The metric type this alert is for (e.g., 'success rate', 'response time', 'duration').
 * @param {number} numSamples - The number of events checked for this alert condition.
 * @param {number} thresholdValue - The threshold value of the alert condition without units (e.g., '75', '2.1').
 * @param {string} thresholdUnit - The unit for the alert threshold (e.g., 'percent', 'seconds').
 * @param {number} violationValue - The value that violated the alert condition (e.g., '76.5', '3').
 * @param {string} violationUnit - The unit for the violation value (e.g., 'percent', 'seconds').
 * @param {string} investigateUri -  The link to Fireconsole to investigate more into this alert.
 * @param {number} [conditionPercentile] - The percentile of the alert condition, can be 0 if percentile is not applicable to the alert condition and omitted; range: [1, 100].
 * @param {string} [appVersion] - The app version this alert was triggered for, can be omitted if the alert is for a network request (because the alert was checked against data from all versions of app) or a web app (where the app is versionless).
 */
constructor(
    public readonly appId: string,
    public readonly eventName: string,
    public readonly eventType: string,
    public readonly metricType: string,
    public readonly numSamples: number,
    public readonly thresholdValue: number,
    public readonly thresholdUnit: string,
    public readonly violationValue: number,
    public readonly violationUnit: string,
    public readonly investigateUri: string,
    public readonly conditionPercentile?: number,
    public readonly appVersion?: string
  ) {}


  /**
   * Factory constructor
   *
   * @param {PerformanceEvent<ThresholdAlertPayload>} event Performance alert event
   * @return {AppCrash} An instance of `PerformanceAlert` class
   */
  public static fromPerformanceEvent(
    event: PerformanceEvent<ThresholdAlertPayload>,
  ): PerformanceAlert {
    return new PerformanceAlert(
      event.appId,
      event.data.payload.eventName,
      event.data.payload.metricType,
      event.data.payload.eventType,
      event.data.payload.numSamples,
      event.data.payload.thresholdValue,
      event.data.payload.thresholdUnit,
      event.data.payload.violationValue,
      event.data.payload.violationUnit,
      event.data.payload.investigateUri,
      event.data.payload.conditionPercentile,
      event.data.payload.appVersion
    );
  }
}
