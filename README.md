# About
Firebase extension for sending Firebase alert notifications to your team communication
platform. 

Currently supported platforms and alerts according to [roadmap](https://github.com/oddbit/firebase-alerts/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

| Platform    | App Distribution | Crashlytics | Performance | Billing | 
| ----------- | :--------------: | :---------: | :---------: | :-----: | 
| Google Chat | [❌](https://github.com/oddbit/firebase-alerts/issues/2)  | ✅ | [❌](https://github.com/oddbit/firebase-alerts/issues/1) | ❌ |
| Slack       | ❌  | ✅ | ❌ | ❌ |
| Discord     | ❌  | ✅ | ❌ | ❌ |


# Getting involved
If you're reading this, you're awesome! 

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
