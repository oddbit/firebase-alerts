// import * as performanceFunctions from "./alerts/performance";
// import * as billingFunctions from "./alerts/billing";
// import * as appDistributionFunctions from "./alerts/app-distribution";

import * as admin from "firebase-admin";

admin.initializeApp();


export * from "./alerts/crashlytics";
export * from "./alerts/app-distribution";
export * from "./alerts/performance";
