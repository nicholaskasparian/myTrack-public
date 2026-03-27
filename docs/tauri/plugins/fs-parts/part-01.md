# Source: https://v2.tauri.app/plugin/file-system/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# fs — Part 1


# File System

[GitHub](https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/fs) [npm](https://www.npmjs.com/package/@tauri-apps/plugin-fs) [crates.io](https://crates.io/crates/tauri-plugin-fs)

API Reference

Access the file system.

## [Supported Platforms](#supported-platforms)

[Section titled “Supported Platforms”](#supported-platforms)

*This plugin requires a Rust version of at least **1.77.2***

| Platform | Level | Notes |
| --- | --- | --- |
| windows |  | Apps installed via MSI or NSIS in `perMachine` and `both` mode require admin permissions for write access in `$RESOURCES` folder |
| linux |  | No write access to `$RESOURCES` folder |
| macos |  | No write access to `$RESOURCES` folder |
| android |  | Access is restricted to Application folder by default |
| ios |  | Access is restricted to Application folder by default |

## [Setup](#setup)

[Section titled “Setup”](#setup)

Install the fs plugin to get started.

* [Automatic](#tab-panel-1054)
* [Manual](#tab-panel-1055)

Use your project’s package manager to add the dependency:

* [npm](#tab-panel-1043)
* [yarn](#tab-panel-1044)
* [pnpm](#tab-panel-1045)
* [deno](#tab-panel-1046)
* [bun](#tab-panel-1047)
* [cargo](#tab-panel-1048)

```
npm run tauri add fs
```

```
yarn run tauri add fs
```

```
pnpm tauri add fs
```

```
deno task tauri add fs
```

```
bun tauri add fs
```

```
cargo tauri add fs
```

1. Run the following command in the `src-tauri` folder to add the plugin to the project’s dependencies in `Cargo.toml`:

   ```
   cargo add tauri-plugin-fs
   ```
2. Modify `lib.rs` to initialize the plugin:

   src-tauri/src/lib.rs

   ```
   #[cfg_attr(mobile, tauri::mobile_entry_point)]

   pub fn run() {

   tauri::Builder::default()

   .plugin(tauri_plugin_fs::init())

   .run(tauri::generate_context!())

   .expect("error while running tauri application");

   }
   ```
3. Install the JavaScript Guest bindings using your preferred JavaScript package manager:

   * [npm](#tab-panel-1049)
   * [yarn](#tab-panel-1050)
   * [pnpm](#tab-panel-1051)
   * [deno](#tab-panel-1052)
   * [bun](#tab-panel-1053)

   ```
   npm install @tauri-apps/plugin-fs
   ```

   ```
   yarn add @tauri-apps/plugin-fs
   ```

   ```
   pnpm add @tauri-apps/plugin-fs
   ```

   ```
   deno add npm:@tauri-apps/plugin-fs
   ```

   ```
   bun add @tauri-apps/plugin-fs
   ```

## [Configuration](#configuration)

[Section titled “Configuration”](#configuration)

### [Android](#android)

[Section titled “Android”](#android)

When using the audio, cache, documents, downloads, picture, public or video directories your app must have access to the external storage.

Include the following permissions to the `manifest` tag in the `gen/android/app/src/main/AndroidManifest.xml` file:

```
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>

<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### [iOS](#ios)

[Section titled “iOS”](#ios)

Apple requires app developers to specify approved reasons for API usage to enhance user privacy.

You must create a `PrivacyInfo.xcprivacy` file in the `src-tauri/gen/apple` folder
with the required [NSPrivacyAccessedAPICategoryFileTimestamp](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api#4278393) key and the [C617.1](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api#4278393) recommended reason.

```
<?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">

<plist version="1.0">

<dict>

<key>NSPrivacyAccessedAPITypes</key>

<array>

<dict>

<key>NSPrivacyAccessedAPIType</key>

<string>NSPrivacyAccessedAPICategoryFileTimestamp</string>

<key>NSPrivacyAccessedAPITypeReasons</key>

<array>

<string>C617.1</string>

</array>

</dict>

</array>

</dict>

</plist>
```

## [Usage](#usage)

[Section titled “Usage”](#usage)

The fs plugin is available in both JavaScript and Rust.

* [JavaScript](#tab-panel-1041)
* [Rust](#tab-panel-1042)

```
import { exists, BaseDirectory } from '@tauri-apps/plugin-fs';

// when using `"withGlobalTauri": true`, you may use

// const { exists, BaseDirectory } = window.__TAURI__.fs;

// Check if the `$APPDATA/avatar.png` file exists

await exists('avatar.png', { baseDir: BaseDirectory.AppData });
```

src-tauri/src/lib.rs

```
use tauri_plugin_fs::FsExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]

pub fn run() {

tauri::Builder::default()

.plugin(tauri_plugin_fs::init())

.setup(|app| {

// allowed the given directory

let scope = app.fs_scope();

scope.allow_directory("/path/to/directory", false);

dbg!(scope.allowed());

Ok(())

})

.run(tauri::generate_context!())

.expect("error while running tauri application");

}
```

## [Security](#security)

[Section titled “Security”](#security)

This module prevents path traversal, not allowing parent directory accessors to be used
(i.e. “/usr/path/to/../file” or ”../path/to/file” paths are not allowed).
Paths accessed with this API must be either relative to one of the [base directories](/reference/javascript/api/namespacepath/#basedirectory)
or created with the [path API](/reference/javascript/api/namespacepath/).

See [@tauri-apps/plugin-fs - Security](/reference/javascript/fs/#security) for more information.

## [Paths](#paths)

[Section titled “Paths”](#paths)

The file system plugin offers two ways of manipulating paths: the [base directory](/reference/javascript/api/namespacepath/#basedirectory) and the [path API](/reference/javascript/api/namespacepath/).

* base directory

  Every API has an options argument that lets you define a [baseDir](/reference/javascript/api/namespacepath/#basedirectory) that acts as the working directory of the operation.

  ```
  import { readFile } from '@tauri-apps/plugin-fs';

  const contents = await readFile('avatars/tauri.png', {

  baseDir: BaseDirectory.Home,

  });
  ```

  In the above example the ~/avatars/tauri.png file is read since we are using the **Home** base directory.
* path API

  Alternatively you can use the path APIs to perform path manipulations.

  ```
  import { readFile } from '@tauri-apps/plugin-fs';

  import * as path from '@tauri-apps/api/path';

  const home = await path.homeDir();

  const contents = await readFile(await path.join(home, 'avatars/tauri.png'));
  ```

## [Files](#files)

[Section titled “Files”](#files)

### [Create](#create)

[Section titled “Create”](#create)

Creates a file and returns a handle to it. If the file already exists, it is truncated.

```
import { create, BaseDirectory } from '@tauri-apps/plugin-fs';

const file = await create('foo/bar.txt', { baseDir: BaseDirectory.AppData });

await file.write(new TextEncoder().encode('Hello world'));

await file.close();
```

### [Write](#write)

[Section titled “Write”](#write)

The plugin offers separate APIs for writing text and binary files for performance.

* text files

  ```
  import { writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

  const contents = JSON.stringify({ notifications: true });

  await writeTextFile('config.json', contents, {

  baseDir: BaseDirectory.AppConfig,

  });
  ```
* binary files

  ```
  import { writeFile, BaseDirectory } from '@tauri-apps/plugin-fs';

  const contents = new Uint8Array(); // fill a byte array

  await writeFile('config', contents, {

  baseDir: BaseDirectory.AppConfig,

  });
  ```

### [Open](#open)

[Section titled “Open”](#open)

Opens a file and returns a handle to it.
With this API you have more control over how the file should be opened
(read-only mode, write-only mode, append instead of overwrite, only create if it does not exist, etc).

* read-only

  This is the default mode.

  ```
  import { open, BaseDirectory } from '@tauri-apps/plugin-fs';

  const file = await open('foo/bar.txt', {

  read: true,

  baseDir: BaseDirectory.AppData,

  });

  const stat = await file.stat();

  const buf = new Uint8Array(stat.size);

  await file.read(buf);

  const textContents = new TextDecoder().decode(buf);

  await file.close();
  ```
* write-only

  ```
  import { open, BaseDirectory } from '@tauri-apps/plugin-fs';

  const file = await open('foo/bar.txt', {

  write: true,

  baseDir: BaseDirectory.AppData,

  });

  await file.write(new TextEncoder().encode('Hello world'));

  await file.close();
  ```

  By default the file is truncated on any `file.write()` call.
  See the following example to learn how to append to the existing contents instead.
* append

  ```
  import { open, BaseDirectory } from '@tauri-apps/plugin-fs';

  const file = await open('foo/bar.txt', {

  append: true,

  baseDir: BaseDirectory.AppData,

  });

  await file.write(new TextEncoder().encode('world'));

  await file.close();
  ```

  Note that `{ append: true }` has the same effect as `{ write: true, append: true }`.
* truncate

  When the `truncate` option is set and the file already exists, it will be truncated to length 0.

  ```
  import { open, BaseDirectory } from '@tauri-apps/plugin-fs';

  const file = await open('foo/bar.txt', {

  write: true,

  truncate: true,

  baseDir: BaseDirectory.AppData,

  });

  await file.write(new TextEncoder().encode('world'));

  await file.close();
  ```

  This option requires `write` to be `true`.

  You can use it along the `append` option if you want to rewrite an existing file using multiple `file.write()` calls.
* create

  By default the `open` API only opens existing files. To create the file if it does not exist,
  opening it if it does, set `create` to `true`:

  ```
  import { open, BaseDirectory } from '@tauri-apps/plugin-fs';

  const file = await open('foo/bar.txt', {

  write: true,

  create: true,

  baseDir: BaseDirectory.AppData,

  });

  await file.write(new TextEncoder().encode('world'));
