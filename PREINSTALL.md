Use this extension to set up a webhook for social platforms where you want to receive Firebase Alerts notifications. For an example use case, refer to the official documentation: [Firebase Alerts Documentation](https://firebase.google.com/docs/functions/beta/alert-events#trigger-function-on-alert-events).

This extension enables quick actions through social platform notifications, allowing direct access to the Firebase console for detailed information. Optionally, it supports creating GitHub issues if GitHub repository information is configured.

The extension offers a webhook that are triggered for each event. It also supports multiple platforms. For a complete list of features and supported platforms, see the [README](https://github.com/oddbit/firebase-alerts#readme).

# Configuring Webhooks

To install the extension, you must define a webhook for a social platform.

Follow the official documentation for each platform to configure webhooks:

- [Google Chat](https://developers.google.com/hangouts/chat/how-tos/webhooks)
- [Slack](https://slack.com/help/articles/115005265063-Incoming-webhooks-for-Slack)
- [Discord](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)

For your webhook avatar, use the square Firebase icon located in the [`/icons/`](https://github.com/oddbit/firebase-alerts/raw/main/icons) folder. Here's a permalink to the image: [Firebase Icon](https://github.com/oddbit/firebase-alerts/raw/main/icons/firebase.png)

# Integrating Google Gemeni API
You can harness the capabilities of Google Gemini's Large Language Model (LLM) by configuring an API key. This will enable the extension to leverage LLM's power to analyze, clarify, and explain each alert in a more insightful and helpful manner.

Read the official documentation on how to retrieve an API key: https://ai.google.dev/tutorials/setup

# Additional Setup

Before installing this extension, ensure that you have [set up a Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) in your Firebase project.

Post-installation, you will receive comprehensive support for mobile and web apps configured in your project. Detailed instructions for these tasks are provided after the extension installation.

# Billing

To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing).

- A nominal fee (typically around $0.01/month) is charged for the Firebase resources used by this extension, even if it is not actively used.
- This extension utilizes other Firebase and Google Cloud Platform services, which may incur charges if you exceed the service's free tier:
  - Cloud Firestore
  - Cloud Functions (Node.js 18 runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))
