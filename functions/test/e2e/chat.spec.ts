import { expect } from 'chai';
import { logger } from "firebase-functions/v2";
import * as sinon from 'sinon';
import { AppCrash } from '../../src/models/app-crash';
import { ApiService } from '../../src/services/chat.service';

const fatalCrash = require('../data/fatal-crash.json');

describe('End to end tests', () => {
  const webhooks: {[key: string]: string} = {
    ['Google Chat']: 'WEBHOOK_URL_GOOGLE_CHAT',
    ['Slack']: 'WEBHOOK_URL_SLACK',
  };
  
  before(() => {
    sinon.stub(logger, 'debug'); 
    sinon.stub(logger, 'info'); 

    process.env.PROJECT_ID = 'fireworks-production';
    process.env.LANGUAGE = 'en';
    process.env.LOCATION='us-central1';
    process.env.REPOSITORY_URL='https://github.com/oddbit/firebase-alerts';

    // TODO: Change this to the App ID
    process.env.APP_ID='1:269808624035:android:296863cf1f5b6817c87a16';

    // TODO: Change this to the App Bundle
    process.env.APP_BUNDLE_ID='id.oddbit.flutter.facebook_app_events_example';
  });

  for (const webhook in webhooks) {
    describe(`Integration: ${webhook}`, () => {
      it(`should generate a valid ${webhook} Crashlytics message`, async () => {
        const mockAppCrash = AppCrash.fromCrashlytics(fatalCrash);
        const apiService = new ApiService(webhooks[webhook]);
        try {
          await apiService.sendCrashlyticsMessage(mockAppCrash);
        } catch (error) {
          expect.fail('Expected not to throw an error but it did.');
        }
      });
    });    
  }
});
