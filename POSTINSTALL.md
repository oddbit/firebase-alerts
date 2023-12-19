## Configuring your webhooks
Read the official documentation for each of the platforms on how to configure 
webhooks.

* [Google Chat](https://developers.google.com/hangouts/chat/how-tos/webhooks)
* [Slack](https://slack.com/help/articles/115005265063-Incoming-webhooks-for-Slack)
* [Discord](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)

There is a square Firebase icon under the [`/icons/`](https://github.com/oddbit/firebase-alerts/raw/main/icons) 
folder that you can use for your webhook avatar. Use this permalink to the image: [https://github.com/oddbit/firebase-alerts/raw/main/icons/firebase.png](https://github.com/oddbit/firebase-alerts/raw/main/icons/firebase.png)


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

For web apps, the `bundleId` is a string that you will have to look for in
URL when you are selecting the web app in the Firebase settings page.

Look for the last part of the URL where `web-app-bundle-id` is your
web app's `bundleId` for the sake of functional equivalent to mobile apps.

`https://console.firebase.google.com/project/{project}/settings/general/web:{web-app-bundle-id}`
 
![App configuration Firestore Doc](https://raw.githubusercontent.com/oddbit/firebase-alerts/main/doc/images/firestore-doc-app.png)

### ⚠️ Cost of document reads
Please note that there will be a small cost of reading your app documents for each
alert that is being triggered. Each event trigger will read all app information documents
once per alert. The number of webhooks is not causing additional document reads.