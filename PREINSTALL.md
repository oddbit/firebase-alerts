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

# Configuring the extension
## Webhooks
The extension require at least one webhook to be defined during the installation.
At the moment you can only declare one webhook per platform.

This webhook URL can be obtained by reading the apps and integrations documentation
for any of the platforms that are supported by this extension: 
[Google Chat](https://developers.google.com/chat/how-tos/webhooks#create_a_webhook), 
[Slack](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks),
and [Discord](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks).

## App information
You will be required to explicitly configure app id, bundle in order for the extension
to be able to generate URLs to Firebase console, to make direct links to crashlytics etc.

### App ID
The app ID is the string that is uniquely used by Firebase to identify your application and 
you can find it in the Firebase console looking something like this: `1:269808624035:android:296863cf1f5b6817c87a16`

### Bundle ID
The bundle id is the ID that you have configured in your mobile app configuration, e.g. `id.oddbit.app.example`. 


Although web apps do not have bundle ids, Firebase is still using
an equivalent representation for some of the console URLs. As shown in the example below,
you can find the web app's "bundle ID" on the URL looking something 
like: `web:NzE5YzVlZDktZjJjOS00Y2Y2LTkzNjQtZTM0ZmJhNjU0MmY3`


![Web App Bundle ID](https://github.com/oddbit/firebase-alerts/raw/main/doc/images/web-app-bundle-id.png)



# Billing
 
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)
 
- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
 - Cloud Functions (Node.js 16+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))