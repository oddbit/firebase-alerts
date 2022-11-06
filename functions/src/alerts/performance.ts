import {logger} from "firebase-functions/v2";
import {performance} from "firebase-functions/v2/alerts";

export const threshold = performance.onThresholdAlertPublished((event) => {
  logger.debug("onThresholdAlertPublished", event);
});
