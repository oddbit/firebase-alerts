import { logger } from "firebase-functions/v2";
import { appDistribution } from "firebase-functions/v2/alerts";
import { InAppFeedback, NewTesterDevice } from "../models/app-distribution";
import { ApiService } from "../services/chat.service";
import { EnvConfig } from "../utils/env-config";

export const feedback = appDistribution.onInAppFeedbackPublished((event) => {
  logger.debug("onInAppFeedbackPublished", event);
  const appFeedback = InAppFeedback.fromFirebaseAlert(event);
  const apiService = new ApiService(EnvConfig.webhook);
  return apiService.sendInAppFeedback(appFeedback);  
});

export const newIosDevice = appDistribution
  .onNewTesterIosDevicePublished((event) => {
      logger.debug("onNewTesterIosDevicePublished", event);
      const newDeviceMessage = NewTesterDevice.fromFirebaseAlert(event);
      const apiService = new ApiService(EnvConfig.webhook);
      return apiService.sendNewTesterDeviceMessage(newDeviceMessage);  
    });
