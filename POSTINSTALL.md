## Configuring your webhooks
Read the official documentation for each of the platforms on how to configure 
webhooks.

* [Google Chat](https://developers.google.com/hangouts/chat/how-tos/webhooks)
* [Slack](https://slack.com/help/articles/115005265063-Incoming-webhooks-for-Slack)
* [Discord](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)

There is a square Firebase icon under the [`/icons/`](./icons) folder that you 
can use for your webhook avatar. Use this permalink to the image: [https://github.com/oddbit/firebase-alerts/raw/main/icons/firebase.png](https://github.com/oddbit/firebase-alerts/raw/main/icons/firebase.png)


## Configuring webhooks
The extension require webhooks to be defined in a Firestore collection named
`{extension-id}-webhooks`. You can declare any number of webhooks and it doesn't 
matter if you are having several webhooks for the same platform.

A webhook document require two fields
 - `language` - The language for standard buttons, titles etc 
 - `url` - The target URL of your webhook

![Webhook Firestore Doc](./doc/images/firestore-doc-webhook.png)


## Configuring apps
Configure your apps with useful information in order for the extension to be 
able to provide useful actions such as quickly creating Github issues and to
be able to link directly to a Crashlytics issue.

Create one document for each of your Firebase app ids in a collection named
`{extension-id}-apps`. Use the app id as the document id

 - `appId` - Firebase app id 
 - `bundleId` - Application bundle id (e.g. `id.oddbit.helloworldapp`)
 - `github` - Optional object for github info
     - `repo` - Repository owner and name (e.g. `oddbit/firebase-alerts`)

For web apps, the `bundleId` is a random string that you will have to look for in
URL when you are selecting the web app in the Firebase settings page.

Look for the last part of the URL where `web-app-bundle-id` is your
web app's `bundleId` for the sake of functional equivalent to mobile apps.

`https://console.firebase.google.com/project/{project}/settings/general/web:{web-app-bundle-id}`
 
![Webhook Firestore Doc](./doc/images/firestore-doc-app.png)

