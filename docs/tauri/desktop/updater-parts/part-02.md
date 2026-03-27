# Source: https://v2.tauri.app/plugin/updater/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# updater — Part 2

```

## [Checking for Updates](#checking-for-updates)

[Section titled “Checking for Updates”](#checking-for-updates)

The default API for checking updates and installing them leverages the configured endpoints
and can be accessed by both JavaScript and Rust code.

* [JavaScript](#tab-panel-1324)
* [Rust](#tab-panel-1325)

```
import { check } from '@tauri-apps/plugin-updater';

import { relaunch } from '@tauri-apps/plugin-process';

const update = await check();

if (update) {

console.log(

`found update ${update.version} from ${update.date} with notes ${update.body}`

);

let downloaded = 0;

let contentLength = 0;

// alternatively we could also call update.download() and update.install() separately

await update.downloadAndInstall((event) => {

switch (event.event) {

case 'Started':

contentLength = event.data.contentLength;

console.log(`started downloading ${event.data.contentLength} bytes`);

break;

case 'Progress':

downloaded += event.data.chunkLength;

console.log(`downloaded ${downloaded} from ${contentLength}`);

break;

case 'Finished':

console.log('download finished');

break;

}

});

console.log('update installed');

await relaunch();

}
```

For more information see the [JavaScript API documentation](/reference/javascript/updater/).

src-tauri/src/lib.rs

```
use tauri_plugin_updater::UpdaterExt;

pub fn run() {

tauri::Builder::default()

.setup(|app| {

let handle = app.handle().clone();

tauri::async_runtime::spawn(async move {

update(handle).await.unwrap();

});

Ok(())

})

.run(tauri::generate_context!())

.unwrap();

}

async fn update(app: tauri::AppHandle) -> tauri_plugin_updater::Result<()> {

if let Some(update) = app.updater()?.check().await? {

let mut downloaded = 0;

// alternatively we could also call update.download() and update.install() separately

update

.download_and_install(

|chunk_length, content_length| {

downloaded += chunk_length;

println!("downloaded {downloaded} from {content_length:?}");

},

|| {

println!("download finished");

},

)

.await?;

println!("update installed");

app.restart();

}

Ok(())

}
```

For more information see the [Rust API documentation](https://docs.rs/tauri-plugin-updater).

Note that restarting your app immediately after installing an update is not required and you can choose
how to handle the update by either waiting until the user manually restarts the app, or prompting them to select when to do so.

When checking and downloading updates it is possible to define a custom request timeout, a proxy and request headers.

* [JavaScript](#tab-panel-1326)
* [Rust](#tab-panel-1327)

```
import { check } from '@tauri-apps/plugin-updater';

const update = await check({

proxy: '<proxy url>',

timeout: 30000 /* milliseconds */,

headers: {

Authorization: 'Bearer <token>',

},

});
```

```
use tauri_plugin_updater::UpdaterExt;

let update = app

.updater_builder()

.timeout(std::time::Duration::from_secs(30))

.proxy("<proxy-url>".parse().expect("invalid URL"))

.header("Authorization", "Bearer <token>")

.build()?

.check()

.await?;
```

### [Runtime Configuration](#runtime-configuration)

[Section titled “Runtime Configuration”](#runtime-configuration)

The updater APIs also allows the updater to be configured at runtime for more flexibility.
For security reasons some APIs are only available for Rust.

#### [Endpoints](#endpoints)

[Section titled “Endpoints”](#endpoints)

Setting the URLs that should be requested to check updates at runtime allows
more dynamic updates such as separate release channels:

```
use tauri_plugin_updater::UpdaterExt;

let channel = if beta { "beta" } else { "stable" };

let update_url = format!("https://{channel}.myserver.com/{{{{target}}}}-{{{{arch}}}}/{{{{current_version}}}}");

let update = app

.updater_builder()

.endpoints(vec![update_url])?

.build()?

.check()

.await?;
```

#### [Public key](#public-key)

[Section titled “Public key”](#public-key)

Setting the public key at runtime can be useful to implement a key rotation logic.
It can be set by either the plugin builder or updater builder:

```
tauri_plugin_updater::Builder::new().pubkey("<your public key>").build()
```

```
use tauri_plugin_updater::UpdaterExt;

let update = app

.updater_builder()

.pubkey("<your public key>")

.build()?

.check()

.await?;
```

#### [Custom target](#custom-target)

[Section titled “Custom target”](#custom-target)

By default the updater lets you use the `{{target}}` and `{{arch}}` variables to determine which update asset must be delivered.
If you need more information on your updates (e.g. when distributing a Universal macOS binary option or having more build flavors)
you can set a custom target.

* [JavaScript](#tab-panel-1328)
* [Rust](#tab-panel-1329)

```
import { check } from '@tauri-apps/plugin-updater';

const update = await check({

target: 'macos-universal',

});
```

Custom targets can be set by either the plugin builder or updater builder:

```
tauri_plugin_updater::Builder::new().target("macos-universal").build()
```

```
use tauri_plugin_updater::UpdaterExt;

let update = app

.updater_builder()

.target("macos-universal")

.build()?

.check()

.await?;
```

#### [Allowing downgrades](#allowing-downgrades)

[Section titled “Allowing downgrades”](#allowing-downgrades)

By default Tauri checks if the update version is greater than the current app version to verify if it should update or not.
To allow downgrades, you must use the updater builder’s `version_comparator` API:

```
use tauri_plugin_updater::UpdaterExt;

let update = app

.updater_builder()

.version_comparator(|current, update| {

// default comparison: `update.version > current`

update.version != current

})

.build()?

.check()

.await?;
```

#### [Windows before exit hook](#windows-before-exit-hook)

[Section titled “Windows before exit hook”](#windows-before-exit-hook)

Due to a limitation of Windows installers, Tauri will automatically quit your application before installing updates on Windows.
To perform an action before that happens, use the `on_before_exit` function:

```
use tauri_plugin_updater::UpdaterExt;

let update = app

.updater_builder()

.on_before_exit(|| {

println!("app is about to exit on Windows!");

})

.build()?

.check()

.await?;
```

## [Permissions](#permissions)

[Section titled “Permissions”](#permissions)

By default all potentially dangerous plugin commands and scopes are blocked and cannot be accessed. You must modify the permissions in your `capabilities` configuration to enable these.

See the [Capabilities Overview](/security/capabilities/) for more information and the [step by step guide](/learn/security/using-plugin-permissions/) to use plugin permissions.

src-tauri/capabilities/default.json

```
{

"permissions": [

...,

"updater:default",

]

}
```

## [Default Permission](#default-permission)

This permission set configures which kind of
updater functions are exposed to the frontend.

#### [Granted Permissions](#granted-permissions)

The full workflow from checking for updates to installing them
is enabled.

#### This default permission set includes the following:

* `allow-check`
* `allow-download`
* `allow-install`
* `allow-download-and-install`

## Permission Table

| Identifier | Description |
| --- | --- |
| `updater:allow-check` | Enables the check command without any pre-configured scope. |
| `updater:deny-check` | Denies the check command without any pre-configured scope. |
| `updater:allow-download` | Enables the download command without any pre-configured scope. |
| `updater:deny-download` | Denies the download command without any pre-configured scope. |
| `updater:allow-download-and-install` | Enables the download\_and\_install command without any pre-configured scope. |
| `updater:deny-download-and-install` | Denies the download\_and\_install command without any pre-configured scope. |
| `updater:allow-install` | Enables the install command without any pre-configured scope. |
| `updater:deny-install` | Denies the install command without any pre-configured scope. |

---

[Support on Open Collective](https://opencollective.com/tauri) [Sponsor on GitHub](https://github.com/sponsors/tauri-apps)

© 2026 Tauri Contributors. CC-BY / MIT
