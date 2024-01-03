// import * as performanceFunctions from "./alerts/performance";
// import * as billingFunctions from "./alerts/billing";
// import * as appDistributionFunctions from "./alerts/app-distribution";

import * as admin from "firebase-admin";

admin.initializeApp();


export * from "./alerts/crashlytics";

// TODO: Uncomment when functions are supported. Keeping them commented out now
// since the plugin is being published and the functions aren't doing anything.
// export const performance = performanceFunctions;
// export const billing = billingFunctions;
// export const appdistribution = appDistributionFunctions;
