Use this extension to configure multiple webhooks to social platforms where you 
want to receive Firebase Alerts notifications. See the official documentation as
an example use-case: https://firebase.google.com/docs/functions/beta/alert-events#trigger-function-on-alert-events

The social platform notification messages are offering quick actions to jump
straight into the Firebase console for detailed information and optionally to 
create github issues if applicable.

This extension adds a highly configurable way of registering multiple webhooks to
be triggered for each event. The plugin also supports multiple platforms 

 - Google Chat
 - Slack
 - Discord
 
See [README](https://github.com/oddbit/firebase-alerts#readme) for complete list 
of feature and platform support

#### Additional setup

Before installing this extension, make sure that you've [set up a Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) in your Firebase project.

After installing this extension, you'll need to set up webhooks and complete some information about 
the mobile and web apps that you have configured for your project. 

Detailed information for these post-installation tasks are provided after you install this extension.


#### Billing
 
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)
 
- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
 - Cloud Firestore
 - Cloud Functions (Node.js 16+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))