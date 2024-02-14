import { logger } from "firebase-functions/v2";
import { performance } from "firebase-functions/v2/alerts";
import { PerformanceAlert } from "../models/performance-alert";
import { ApiService } from "../services/chat.service";
import { EnvConfig } from "../utils/env-config";

export const threshold = performance.onThresholdAlertPublished((event) => {
  logger.debug("onThresholdAlertPublished", event);

    const perfAlert = PerformanceAlert.fromPerformanceEvent(event);

    const apiService = new ApiService(EnvConfig.webhook);
    return apiService.sendPerformanceAlertMessage(perfAlert);  
});
