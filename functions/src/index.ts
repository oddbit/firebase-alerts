import {initializeApp} from "firebase-admin/app";
import * as appInfoFunctions from "./app-info/functions";
import * as crashlyticsFunctions from "./crashlytics/functions";
import * as webhookFunctions from "./webhook/functions";

initializeApp();

export const appinfo = appInfoFunctions;
export const crashlytics = crashlyticsFunctions;
export const webhook = webhookFunctions;
