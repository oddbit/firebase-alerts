import {expect} from 'chai';
import {GoogleChatWebhook} from '../../src/webhook-plugins/google-chat';
import {AppCrash} from '../../src/models/app-crash';
import {ApiService} from '../../src/services/chat.service';

const fatalCrash = require('../data/fatal-crash.json');

describe('GoogleChatWebhook', () => {
  before(() => {
    process.env.PROJECT_ID = 'fireworks-production';
    process.env.WEBHOOK_URL = 'https://chat.googleapis.com/v1/spaces/AAAAIOVO-N0/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=Uc0uvxx-jA3zW-9CqBygmE4a0sG9_F_HiiylvvFa3zQ';
    process.env.LANGUAGE = 'en';
    process.env.LOCATION='us-central1';
    process.env.APP_ID='1:269808624035:android:296863cf1f5b6817c87a16';
    process.env.APP_BUNDLE_ID='id.oddbit.flutter.facebook_app_events_example';
    process.env.REPOSITORY_URL='https://github.com/oddbit/firebase-alerts';
  });

  describe('createCrashlyticsMessage', () => {
    it('should generate a valid Google Chat card message', async () => {
      const webhook = new GoogleChatWebhook({ 
        url: process.env.WEBHOOK_URL!, 
        language: 'en',
       });

      // Sample AppCrash Data
      const mockAppCrash = AppCrash.fromCrashlytics(fatalCrash);

      const cardMessage: any = webhook.createCrashlyticsMessage(mockAppCrash);

      // Assertions using Chai
      expect(cardMessage).to.be.an('object'); 
      expect(cardMessage).to.have.property('cardsV2').that.is.an('array');

      // Check for the first card (assumes a single card scenario)
      const card = cardMessage.cardsV2[0]; 
      expect(card).to.have.property('cardId');
      expect(card).to.have.property('card');

      // Assertions on the 'card' structure (assuming a single card)
      expect(card.card).to.have.property('header');
      expect(card.card.sections).to.be.an('array');

      // Note(Dennis): Uncomment the any of the following for debugging
      // console.log(JSON.stringify(cardMessage, null, 2));
      // const apiService = new ApiService();
      // await apiService.sendCrashlyticsMessage(mockAppCrash);

    });
  });
});
