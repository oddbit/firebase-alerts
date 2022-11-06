import {initializeApp} from "firebase-admin/app";
import * as crashlyticsFunctions from "./alerts/crashlytics";
import * as performanceFunctions from "./alerts/performance";
import * as billingFunctions from "./alerts/billing";

initializeApp();

export const crashlytics = crashlyticsFunctions;
export const performance = performanceFunctions;
export const billing = billingFunctions;
