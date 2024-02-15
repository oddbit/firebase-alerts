# About

Empower your team with timely Firebase notifications sent directly to your preferred communication platform.

## Key Features

- **Alerts:** Receive immediate notifications, enabling rapid debugging and issue resolution.
- **Flexible Webhook Support:** Easily integrates with popular platforms like:
  - Slack
  - Discord
  - Google Chat
- **Extensible:** Readily build custom webhook plugins to connect with other notification channels.
- **Roadmap:** We're actively evolving to make the alerts and notifications more helpful. See our [roadmap](https://github.com/oddbit/firebase-alerts/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement) for more info.

| Platform    | App Distribution | Crashlytics | Performance |
| ----------- | :--------------: | :---------: | :---------: |
| Google Chat |        ✅        |     ✅      |     ✅      |
| Slack       |        ✅        |     ✅      |     ✅      |
| Discord     |        ✅        |     ✅      |     ✅      |
| MS Teams    |        ❌        |     ❌      |     ❌      |

## Screenshots

|                                                                App Distribution                                                                |                                                              Crashlytics                                                              |                                                                 Performance                                                                 |
| :--------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------: |
| ![Google Chat App Distribution New Device](https://github.com/oddbit/firebase-alerts/raw/main/doc/images/message-google-chat-app-dist-new.png) | ![Google Chat Crashlytics Message](https://github.com/oddbit/firebase-alerts/raw/main/doc/images/message-google-chat-crashlytics.png) | ![Google Chat Performance Alert Message](https://github.com/oddbit/firebase-alerts/raw/main/doc/images/message-google-chat-performance.png) |

# Installation

Install the Firebase Alerts extension using the Firebase CLI or the Firebase console.

## Install using CLI

You can install this extension from source by forking the repository and run the
following command from your Firebase project root.

```bash
firebase ext:install oddbit/firebase-alerts
firebase deploy --only extensions
```

Read the [PREINSTALL](./PREINSTALL.md) and [POSTINSTALL](./POSTINSTALL.md) instructions
for further information and requirements.

# Getting involved

If you're reading this, you're awesome!

We welcome your contributions! If you'd like to suggest new features or platforms:
[Open an issue](https://github.com/oddbit/firebase-alerts/issues/new) on our GitHub repository
after searching to find if your idea or feedback has already been posted.

## Building webhook plugins

It's easy and fun to develop new webhook plugins. All you need to do is to
declare your new plugin and create a new class that extends the abstract
[`Webhook`](./functions/src/models/webhook.ts)

Have a look at the existing plugin(s) under [`functions/src/webhook-plugins/`](https://github.com/oddbit/firebase-alerts/tree/main/functions/src/webhook-plugins)
to see how an implementation can look like.

Create your new plugin alongside the existing plugins `your-new-plugin.ts`

```typescript
export class YourNewPluginWebhook extends Webhook {
  // Implements Webhook
}
```

Registering the new plugin in the method [`webhookPluginFromUrl()`](https://github.com/oddbit/firebase-alerts/blob/main/functions/src/alerts/crashlytics.ts).
