Use this extension to set up a webhook for social platforms where you want to receive Firebase Alerts notifications. For an example use case, refer to the official documentation: [Firebase Alerts Documentation](https://firebase.google.com/docs/functions/beta/alert-events#trigger-function-on-alert-events).

This extension enables quick actions through social platform notifications, allowing direct access to the Firebase console for detailed information. Optionally, it supports creating GitHub issues if GitHub repository information is configured.

The extension offers a webhook that are triggered for each event. It also supports multiple platforms. For a complete list of features and supported platforms, see the [README](https://github.com/oddbit/firebase-alerts#readme).

# Configuring the extension
## Webhooks
To install the extension, you must define a webhook for a social platform.
The extension require at least one webhook to be defined during the installation.
At the moment you can only declare one webhook per platform.

This webhook URL can be obtained by reading the apps and integrations documentation
for any of the platforms that are supported by this extension: 

- [Google Chat](https://developers.google.com/hangouts/chat/how-tos/webhooks)
- [Slack](https://slack.com/help/articles/115005265063-Incoming-webhooks-for-Slack)
- [Discord](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)

For your webhook avatar, use the square Firebase icon located in the [`/icons/`](https://github.com/oddbit/firebase-alerts/raw/main/icons) folder. Here's a permalink to the image: [Firebase Icon](https://github.com/oddbit/firebase-alerts/raw/main/icons/firebase.png)

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

## Integrating Google Gemeni API
You can harness the capabilities of Google Gemini's Large Language Model (LLM) by configuring an API key. This will enable the extension to leverage LLM's power to analyze, clarify, and explain each alert in a more insightful and helpful manner.

Read the official documentation on how to retrieve an API key: https://ai.google.dev/tutorials/setup

# Billing
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)
 
- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
 - Cloud Functions (Node.js 16+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))
