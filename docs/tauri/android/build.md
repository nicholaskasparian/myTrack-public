# Source: https://v2.tauri.app/distribute/google-play/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# Google Play

Google Play is the Android app distribution service maintained by Google.

This guide covers the requirements for publishing your Android app on Google Play.

## [Requirements](#requirements)

[Section titled “Requirements”](#requirements)

To distribute Android apps in the Play Store you must create a [Play Console](https://play.google.com/console/developers) developer account.

Additionally, you must setup [code signing](/distribute/sign/android/).

See the [release checklist](https://play.google.com/console/about/guides/releasewithconfidence/) for more information.

## [Changing App Icon](#changing-app-icon)

[Section titled “Changing App Icon”](#changing-app-icon)

After running `tauri android init` to setup the Android Studio project, you can use the `tauri icon` command to update the app icons.

* [npm](#tab-panel-744)
* [yarn](#tab-panel-745)
* [pnpm](#tab-panel-746)
* [deno](#tab-panel-747)
* [bun](#tab-panel-748)
* [cargo](#tab-panel-749)

```
npm run tauri icon /path/to/app-icon.png
```

```
yarn tauri icon /path/to/app-icon.png
```

```
pnpm tauri icon /path/to/app-icon.png
```

```
deno task tauri icon /path/to/app-icon.png
```

```
bun tauri icon /path/to/app-icon.png
```

```
cargo tauri icon /path/to/app-icon.png
```

## [Setting up](#setting-up)

[Section titled “Setting up”](#setting-up)

Once you’ve created a Play Console developer account, you need to register your app on the Google [Play Console](https://play.google.com/console/developers) website. It will guide you through all the required forms and setup tasks.

## [Build](#build)

[Section titled “Build”](#build)

You can build an Android App Bundle (AAB) to upload to Google Play by running the following command:

* [npm](#tab-panel-750)
* [yarn](#tab-panel-751)
* [pnpm](#tab-panel-752)
* [deno](#tab-panel-753)
* [bun](#tab-panel-754)
* [cargo](#tab-panel-755)

```
npm run tauri android build -- --aab
```

```
yarn tauri android build --aab
```

```
pnpm tauri android build --aab
```

```
deno task tauri android build --aab
```

```
bun tauri android build --aab
```

```
cargo tauri android build --aab
```

Tauri derives the version code from the value defined in [`tauri.conf.json > version`](/reference/config/#version) (`versionCode = major*1000000 + minor*1000 + patch`).
You can set a custom version code in the [`tauri.conf.json > bundle > android > versionCode`] configuration
if you need a different version code scheme e.g. sequential codes:

tauri.conf.json

```
{

"bundle": {

"android": {

"versionCode": 100

}

}

}
```

### [Build APKs](#build-apks)

[Section titled “Build APKs”](#build-apks)

The AAB format is the recommended bundle file to upload to Google Play, but it is also possible to generate APKs
that can be used for testing or distribution outside the store.
To compile APKs for your app you can use the `--apk` argument:

* [npm](#tab-panel-756)
* [yarn](#tab-panel-757)
* [pnpm](#tab-panel-758)
* [deno](#tab-panel-759)
* [bun](#tab-panel-760)
* [cargo](#tab-panel-761)

```
npm run tauri android build -- --apk
```

```
yarn tauri android build --apk
```

```
pnpm tauri android build --apk
```

```
deno task tauri android build --apk
```

```
bun tauri android build --apk
```

```
cargo tauri android build --apk
```

### [Architecture selection](#architecture-selection)

[Section titled “Architecture selection”](#architecture-selection)

By default Tauri builds your app for all supported architectures (aarch64, armv7, i686 and x86\_64).
To only compile for a subset of targets, you can use the `--target` argument:

* [npm](#tab-panel-762)
* [yarn](#tab-panel-763)
* [pnpm](#tab-panel-764)
* [deno](#tab-panel-765)
* [bun](#tab-panel-766)
* [cargo](#tab-panel-767)

```
npm run tauri android build -- --aab --target aarch64 --target armv7
```

```
yarn tauri android build --aab --target aarch64 --target armv7
```

```
pnpm tauri android build --aab --target aarch64 --target armv7
```

```
deno task tauri android build --aab --target aarch64 --target armv7
```

```
bun tauri android build --aab --target aarch64 --target armv7
```

```
cargo tauri android build --aab --target aarch64 --target armv7
```

### [Separate bundles per architecture](#separate-bundles-per-architecture)

[Section titled “Separate bundles per architecture”](#separate-bundles-per-architecture)

By default the generated AAB and APK is universal, containing all supported targets.
To generate individual bundles per target, use the `--split-per-abi` argument.

* [npm](#tab-panel-768)
* [yarn](#tab-panel-769)
* [pnpm](#tab-panel-770)
* [deno](#tab-panel-771)
* [bun](#tab-panel-772)
* [cargo](#tab-panel-773)

```
npm run tauri android build -- --apk --split-per-abi
```

```
yarn tauri android build --apk --split-per-abi
```

```
pnpm tauri android build --apk --split-per-abi
```

```
deno task tauri android build --apk --split-per-abi
```

```
bun tauri android build --apk --split-per-abi
```

```
cargo tauri android build --apk --split-per-abi
```

### [Changing the minimum supported Android version](#changing-the-minimum-supported-android-version)

[Section titled “Changing the minimum supported Android version”](#changing-the-minimum-supported-android-version)

The minimum supported Android version for Tauri apps is Android 7.0 (codename Nougat, SDK 24).

There are some techniques to use newer Android APIs while still supporting older systems.
See the [Android documentation](https://developer.android.com/training/basics/supporting-devices/platforms#version-codes) for more information.

If your app must execute on a newer Android version, you can configure [`tauri.conf.json > bundle > android > minSdkVersion`]:

tauri.conf.json

```
{

"bundle": {

"android": {

"minSdkVersion": 28

}

}

}
```

## [Upload](#upload)

[Section titled “Upload”](#upload)

After building your app and generating the Android App Bundle file,
which can be found in `gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab`,
you can now create a new release and upload it in the Google Play Console.

The first upload must be made manually in the website so it can verify your app signature and bundle identifier.
Tauri currently does not offer a way to automate the process of creating Android releases,
which must leverage the [Google Play Developer API](https://developers.google.com/android-publisher/api-ref/rest),
but it is a work in progress.

---

[Support on Open Collective](https://opencollective.com/tauri) [Sponsor on GitHub](https://github.com/sponsors/tauri-apps)

© 2026 Tauri Contributors. CC-BY / MIT
