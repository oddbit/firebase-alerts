import {logger} from "firebase-functions/v2";
import {appDistribution} from "firebase-functions/v2/alerts";

export const feedback = appDistribution.onInAppFeedbackPublished((event) => {
  logger.debug("onInAppFeedbackPublished", event);
});
export const newiosdevice = appDistribution
    .onNewTesterIosDevicePublished((event) => {
      logger.debug("onNewTesterIosDevicePublished", event);
    });
