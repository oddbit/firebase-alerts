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

Have a look at the existing plugin(s) under [`functions/src/webhook-plugins/`](./functions/src/webhook-plugins)
to see how an implementation can look like. 

Create your new plugin alongside the existing plugins `your-new-plugin.ts`

```typescript
export class YourNewPluginWebhook extends Webhook {
  // Implements Webhook
}
```

### Registering the new plugin
There are three simple steps to register your plugin
in [`./functions/src/webhook-plugins/index.ts`](./functions/src/webhook-plugins/index.ts)

#### Step 1
Add your plugin to the enumeration

```typescript
export enum WebhookPlatform {
  GoogleChat,
  Slack,
  Discord,
  YourNewPlugin, // Add your new plugin
  Unknown,
}
```

#### Step 2
Add your webhook signature to the method `derivePlatformTypeFromUrl()` so that 
your webhooks can be recognized.

```typescript
export function derivePlatformTypeFromUrl(url: string): WebhookPlatform {
  if (url?.startsWith("https://chat.googleapis.com")) {
    return WebhookPlatform.GoogleChat;
  } else if (/* other webhook */) {
    // ...
    // Add your webhook signature below
  } else if (url?.startsWith("https://YourNewPluginWebhook.example.com")) {
    return WebhookPlatform.YourNewPlugin;
  }

  return WebhookPlatform.Unknown;
}

```
#### Step 3
Register a builder method

```typescript
const webhookPlugins: {[key: string]: WebhookBuilder} = {
  [WebhookPlatform.GoogleChat]: (webhook) => new GoogleChatWebhook(webhook),
  // ...
  // Other webhook builders 
  // ...
  [WebhookPlatform.YourNewPlugin]: (webhook) => new YourNewPluginWebhook(webhook),
};
```

