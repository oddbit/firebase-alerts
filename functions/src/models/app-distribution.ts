import { 
  AppDistributionEvent,
  InAppFeedbackPayload, 
  NewTesterDevicePayload,
 } from 'firebase-functions/v2/alerts/appDistribution';

export class NewTesterDevice {
    constructor(
        public readonly appId: string,
        public readonly testerName: string,
        public readonly testerEmail: string,
        public readonly testerDeviceModelName: string,
        public readonly testerDeviceIdentifier: string
    ) {}

    public static fromFirebaseAlert(event: AppDistributionEvent<NewTesterDevicePayload>): NewTesterDevice {
        return new NewTesterDevice(
            event.appId,
            event.data.payload.testerName,
            event.data.payload.testerEmail,
            event.data.payload.testerDeviceModelName,
            event.data.payload.testerDeviceIdentifier
        );
    }
}

export class InAppFeedback {
    constructor(
        public readonly appId: string,
        public readonly feedbackReport: string,
        public readonly feedbackConsoleUri: string,
        public readonly testerName: string | undefined,
        public readonly testerEmail: string,
        public readonly appVersion: string,
        public readonly text: string,
        public readonly screenshotUri: string | undefined
    ) {}

    public static fromFirebaseAlert(event: AppDistributionEvent<InAppFeedbackPayload>): InAppFeedback {
        return new InAppFeedback(
            event.appId,
            event.data.payload.feedbackReport,
            event.data.payload.feedbackConsoleUri,
            event.data.payload.testerName,
            event.data.payload.testerEmail,
            event.data.payload.appVersion,
            event.data.payload.text,
            event.data.payload.screenshotUri
        );
    }
}
