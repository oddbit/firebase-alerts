
import {logger} from "firebase-functions/v2";
import {crashlytics} from "firebase-functions/v2/alerts";
import {AppCrash} from "../models/app-crash";
import {ApiService} from "../services/chat.service";
import { EnvConfig } from "../utils/env-config";

const functionOpts = {
  region: process.env.LOCATION,
  secrets: ["WEBHOOK_URL"],
};



export const anr =
  crashlytics.onNewAnrIssuePublished(functionOpts, async (event) => {
    logger.debug("onNewAnrIssuePublished", event);
  
    const appCrash = AppCrash.fromCrashlytics(event);

    appCrash.tags.push("critical");
    
    const apiService = new ApiService(EnvConfig.webhook);
    return apiService.sendCrashlyticsMessage(appCrash);
  });

export const fatal =
  crashlytics.onNewFatalIssuePublished(functionOpts, async (event) => {
    logger.debug("onNewFatalIssuePublished", event);

    const appCrash = AppCrash.fromCrashlytics(event);
    
    appCrash.tags.push("critical");

    const apiService = new ApiService(EnvConfig.webhook);
    return apiService.sendCrashlyticsMessage(appCrash);
  });


export const nonfatal =
  crashlytics.onNewNonfatalIssuePublished(functionOpts, async (event) => {
    logger.debug("onNewNonfatalIssuePublished", event);

    const appCrash = AppCrash.fromCrashlytics(event);

    const apiService = new ApiService(EnvConfig.webhook);
    return apiService.sendCrashlyticsMessage(appCrash);
  });

export const regression =
  crashlytics.onRegressionAlertPublished(functionOpts, async (event) => {
    logger.debug("onRegressionAlertPublished", event);

    const appCrash = AppCrash.fromCrashlytics(event);
    
    appCrash.tags.push("regression");

    const apiService = new ApiService(EnvConfig.webhook);
    return apiService.sendCrashlyticsMessage(appCrash);
  });
