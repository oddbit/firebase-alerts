import {initializeApp} from "firebase-admin/app";
import * as crashlyticsFunctions from "./alerts/crashlytics";

initializeApp();

export const crashlytics = crashlyticsFunctions;
