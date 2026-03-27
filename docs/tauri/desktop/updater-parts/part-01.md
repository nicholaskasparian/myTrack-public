# Source: https://v2.tauri.app/plugin/updater/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# updater — Part 1


# Updater

[GitHub](https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/updater) [npm](https://www.npmjs.com/package/@tauri-apps/plugin-updater) [crates.io](https://crates.io/crates/tauri-plugin-updater)

API Reference

Automatically update your Tauri app with an update server or a static JSON.

## [Supported Platforms](#supported-platforms)

[Section titled “Supported Platforms”](#supported-platforms)

*This plugin requires a Rust version of at least **1.77.2***

| Platform | Level | Notes |
| --- | --- | --- |
| windows |  |  |
| linux |  |  |
| macos |  |  |
| android |  |  |
| ios |  |  |

## [Setup](#setup)

[Section titled “Setup”](#setup)

Install the Tauri updater plugin to get started.

* [Automatic](#tab-panel-1349)
* [Manual](#tab-panel-1350)

Use your project’s package manager to add the dependency:

* [npm](#tab-panel-1332)
* [yarn](#tab-panel-1333)
* [pnpm](#tab-panel-1334)
* [deno](#tab-panel-1335)
* [bun](#tab-panel-1336)
* [cargo](#tab-panel-1337)

```
npm run tauri add updater
```

```
yarn run tauri add updater
```

```
pnpm tauri add updater
```

```
deno task tauri add updater
```

```
bun tauri add updater
```

```
cargo tauri add updater
```

1. Run the following command in the `src-tauri` folder to add the plugin to the project’s dependencies in `Cargo.toml`:

   ```
   cargo add tauri-plugin-updater --target 'cfg(any(target_os = "macos", windows, target_os = "linux"))'
   ```
2. Modify `lib.rs` to initialize the plugin:

   lib.rs

   ```
   #[cfg_attr(mobile, tauri::mobile_entry_point)]

   pub fn run() {

   tauri::Builder::default()

   .setup(|app| {

   #[cfg(desktop)]

   app.handle().plugin(tauri_plugin_updater::Builder::new().build());

   Ok(())

   })

   .run(tauri::generate_context!())

   .expect("error while running tauri application");

   }
   ```
3. You can install the JavaScript Guest bindings using your preferred JavaScript package manager:

   * [npm](#tab-panel-1338)
   * [yarn](#tab-panel-1339)
   * [pnpm](#tab-panel-1340)
   * [deno](#tab-panel-1341)
   * [bun](#tab-panel-1342)

   ```
   npm install @tauri-apps/plugin-updater
   ```

   ```
   yarn add @tauri-apps/plugin-updater
   ```

   ```
   pnpm add @tauri-apps/plugin-updater
   ```

   ```
   deno add npm:@tauri-apps/plugin-updater
   ```

   ```
   bun add @tauri-apps/plugin-updater
   ```

## [Signing updates](#signing-updates)

[Section titled “Signing updates”](#signing-updates)

Tauri’s updater needs a signature to verify that the update is from a trusted source. This cannot be disabled.

To sign your updates you need two keys:

1. The public key, which will be set in the `tauri.conf.json` to validate the artifacts before the installation. This public key can be uploaded and shared safely as long as your private key is secure.
2. The private key, which is used to sign your installer files. You should NEVER share this key with anyone. Also, if you lose this key you will NOT be able to publish new updates to the users that have the app already installed. It is important to store this key in a safe place!

To generate the keys the Tauri CLI provides the `signer generate` command. You can run this to create the keys in the home folder:

* [npm](#tab-panel-1343)
* [yarn](#tab-panel-1344)
* [pnpm](#tab-panel-1345)
* [deno](#tab-panel-1346)
* [bun](#tab-panel-1347)
* [cargo](#tab-panel-1348)

```
npm run tauri signer generate -- -w ~/.tauri/myapp.key
```

```
yarn tauri signer generate -w ~/.tauri/myapp.key
```

```
pnpm tauri signer generate -w ~/.tauri/myapp.key
```

```
deno task tauri signer generate -w ~/.tauri/myapp.key
```

```
bunx tauri signer generate -w ~/.tauri/myapp.key
```

```
cargo tauri signer generate -w ~/.tauri/myapp.key
```

### [Building](#building)

[Section titled “Building”](#building)

While building your update artifacts, you need to have the private key you generated above in your environment variables. `.env` files do *not* work!

* [Mac/Linux](#tab-panel-1322)
* [Windows](#tab-panel-1323)

```
export TAURI_SIGNING_PRIVATE_KEY="Path or content of your private key"

# optionally also add a password

export TAURI_SIGNING_PRIVATE_KEY_PASSWORD=""
```

Run this in `PowerShell`:

```
$env:TAURI_SIGNING_PRIVATE_KEY="Path or content of your private key"

<# optionally also add a password #>

$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD=""
```

After that, you can run Tauri build as usual and Tauri will generate the update bundles and their signatures.
The generated files depend on the [`createUpdaterArtifacts`](/reference/config/#createupdaterartifacts) configuration value configured below.

* [v2](#tab-panel-1330)
* [v1 compatible](#tab-panel-1331)

```
{

"bundle": {

"createUpdaterArtifacts": true

}

}
```

On Linux, Tauri will create the normal AppImage inside the `target/release/bundle/appimage/` folder:

* `myapp.AppImage` - The standard app bundle. It will be re-used by the updater.
* `myapp.AppImage.sig` - The signature of the updater bundle.

On macOS, Tauri will create a .tar.gz archive from the application bundle inside the target/release/bundle/macos/ folder:

* `myapp.app` - The standard app bundle.
* `myapp.app.tar.gz` - The updater bundle.
* `myapp.app.tar.gz.sig` - The signature of the update bundle.

On Windows, Tauri will create the normal MSI and NSIS installers inside the target/release/bundle/msi/ and target/release/bundle/nsis folders:

* `myapp-setup.exe` - The standard app bundle. It will be re-used by the updater.
* `myapp-setup.exe.sig` - The signature of the update bundle.
* `myapp.msi` - The standard app bundle. It will be re-used by the updater.
* `myapp.msi.sig` - The signature of the update bundle.

```
{

"bundle": {

"createUpdaterArtifacts": "v1Compatible"

}

}
```

On Linux, Tauri will create a .tar.gz archive from the AppImage inside the `target/release/bundle/appimage/` folder:

* `myapp.AppImage` - The standard app bundle.
* `myapp.AppImage.tar.gz` - The updater bundle.
* `myapp.AppImage.tar.gz.sig` - The signature of the update bundle.

On macOS, Tauri will create a .tar.gz archive from the application bundle inside the target/release/bundle/macos/ folder:

* `myapp.app` - The standard app bundle.
* `myapp.app.tar.gz` - The updater bundle.
* `myapp.app.tar.gz.sig` - The signature of the update bundle.

On Windows, Tauri will create .zip archives from the MSI and NSIS installers inside the target/release/bundle/msi/ and target/release/bundle/nsis folders:

* `myapp-setup.exe` - The standard app bundle.
* `myapp-setup.nsis.zip` - The updater bundle.
* `myapp-setup.nsis.zip.sig` - The signature of the update bundle.
* `myapp.msi` - The standard app bundle.
* `myapp.msi.zip` - The updater bundle.
* `myapp.msi.zip.sig` - The signature of the update bundle.

## [Tauri Configuration](#tauri-configuration)

[Section titled “Tauri Configuration”](#tauri-configuration)

Set up the `tauri.conf.json` in this format for the updater to start working.

| Keys | Description |
| --- | --- |
| `createUpdaterArtifacts` | Setting this to `true` tells Tauri’s app bundler to create updater artifacts. If you’re migrating your app from an older Tauri version, set it to `"v1Compatible"` instead. **This setting will be removed in v3** so make sure to change it to `true` once all your users are migrated to v2. |
| `pubkey` | This has to be the public key generated from the Tauri CLI in the step above. It **cannot** be a file path! |
| `endpoints` | This must be an array of endpoint URLs as strings. TLS is enforced in production mode. Tauri will only continue to the next url if a non-2XX status code is returned! |
| `dangerousInsecureTransportProtocol` | Setting this to `true` allows the updater to accept non-HTTPS endpoints. Use this configuration with caution! |

Each updater URL can contain the following dynamic variables, allowing you to determine server-side if an update is available.

* `{{current_version}}`: The version of the app that is requesting the update.
* `{{target}}`: The operating system name (one of `linux`, `windows` or `darwin`).
* `{{arch}}`: The architecture of the machine (one of `x86_64`, `i686`, `aarch64` or `armv7`).

tauri.conf.json

```
{

"bundle": {

"createUpdaterArtifacts": true

},

"plugins": {

"updater": {

"pubkey": "CONTENT FROM PUBLICKEY.PEM",

"endpoints": [

"https://releases.myapp.com/{{target}}/{{arch}}/{{current_version}}",

// or a static github json file

"https://github.com/user/repo/releases/latest/download/latest.json"

]

}

}

}
```

### [`installMode` on Windows](#installmode-on-windows)

[Section titled “installMode on Windows”](#installmode-on-windows)

On Windows there is an additional optional `"installMode"` config to change how the update is installed.

tauri.conf.json

```
{

"plugins": {

"updater": {

"windows": {

"installMode": "passive"

}

}

}

}
```

* `"passive"`: There will be a small window with a progress bar. The update will be installed without requiring any user interaction. Generally recommended and the default mode.
* `"basicUi"`: There will be a basic user interface shown which requires user interaction to finish the installation.
* `"quiet"`: There will be no progress feedback to the user. With this mode the installer cannot request admin privileges by itself so it only works in user-wide installations or when your app itself already runs with admin privileges. Generally not recommended.

## [Server Support](#server-support)

[Section titled “Server Support”](#server-support)

The updater plugin can be used in two ways. Either with a dynamic update server or a static JSON file (to use on services like S3 or GitHub gists).

### [Static JSON File](#static-json-file)

[Section titled “Static JSON File”](#static-json-file)

When using static, you just need to return a JSON containing the required information.

| Keys | Description |
| --- | --- |
| `version` | Must be a valid [SemVer](https://semver.org/), with or without a leading `v`, meaning that both `1.0.0` and `v1.0.0` are valid. |
| `notes` | Notes about the update. |
| `pub_date` | The date must be formatted according to [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) if present. |
| `platforms` | Each platform key is in the `OS-ARCH` format, where `OS` is one of `linux`, `darwin` or `windows`, and `ARCH` is one of `x86_64`, `aarch64`, `i686` or `armv7`. |
| `signature` | The content of the generated `.sig` file, which may change with each build. A path or URL does not work! |

The required keys are `"version"`, `"platforms.[target].url"` and `"platforms.[target].signature"`; the others are optional.

```
{

"version": "",

"notes": "",

"pub_date": "",

"platforms": {

"linux-x86_64": {

"signature": "",

"url": ""

},

"windows-x86_64": {

"signature": "",

"url": ""

},

"darwin-x86_64": {

"signature": "",

"url": ""

}

}

}
```

Note that Tauri will validate the whole file before checking the version field, so make sure all existing platform configurations are valid and complete.

### [Dynamic Update Server](#dynamic-update-server)

[Section titled “Dynamic Update Server”](#dynamic-update-server)

When using a dynamic update server, Tauri will follow the server’s instructions. To disable the internal version check you can overwrite the [plugin’s version comparison](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/struct.UpdaterBuilder.html#method.version_comparator), this will install the version sent by the server (useful if you need to roll back your app).

Your server can use variables defined in the `endpoint` URL above to determine if an update is required. If you need more data, you can include additional [request headers in Rust](https://docs.rs/tauri-plugin-updater/latest/tauri_plugin_updater/struct.UpdaterBuilder.html#method.header) to your liking.

Your server should respond with a status code of [`204 No Content`](https://datatracker.ietf.org/doc/html/rfc2616#section-10.2.5) if there is no update available.

If an update is required, your server should respond with a status code of [`200 OK`](http://tools.ietf.org/html/rfc2616#section-10.2.1) and a JSON response in this format:

| Keys | Description |
| --- | --- |
| `version` | This Must be a valid [SemVer](https://semver.org/), with or without a leading `v`, meaning that both `1.0.0` and `v1.0.0` are valid. |
| `notes` | Notes about the update. |
| `pub_date` | The date must be formatted according to [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) if present. |
| `url` | This Must be a valid URL to the update bundle. |
| `signature` | The content of the generated `.sig` file, which may change with each build. A path or URL does not work! |

The required keys are `"url"`, `"version"` and `"signature"`; the others are optional.

```
{

"version": "",

"pub_date": "",

"url": "",

"signature": "",

"notes": ""

}
