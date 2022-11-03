import {initializeApp} from "firebase-admin/app";
import * as crashlyticsFunctions from "./crashlytics";

initializeApp();

export const crashlytics = crashlyticsFunctions;
