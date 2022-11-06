import {logger} from "firebase-functions/v2";
import {billing} from "firebase-functions/v2/alerts";

export const autoupdatealert = billing
    .onPlanAutomatedUpdatePublished((event) => {
      logger.debug("onPlanAutomatedUpdatePublished", event);
    });

export const updatealert = billing.onPlanUpdatePublished((event) => {
  logger.debug("onPlanUpdatePublished", event);
});
