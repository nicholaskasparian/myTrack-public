# Source: https://tauri.app/reference/config/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# config — Part 2

* windows
* withGlobalTauri

##### [enableGTKAppId](#enablegtkappid)

[Section titled “enableGTKAppId”](#enablegtkappid)

`boolean`

If set to true “identifier” will be set as GTK app ID (on systems that use GTK).

##### [macOSPrivateApi](#macosprivateapi)

[Section titled “macOSPrivateApi”](#macosprivateapi)

`boolean`

MacOS private API configuration. Enables the transparent background API and sets the `fullScreenEnabled` preference to `true`.

##### [security](#security)

[Section titled “security”](#security)

[`SecurityConfig`](#securityconfig)

Security configuration.

Default

```
{

"assetProtocol": {

"enable": false,

"scope": []

},

"capabilities": [],

"dangerousDisableAssetCspModification": false,

"freezePrototype": false,

"pattern": {

"use": "brownfield"

}

}
```

##### [trayIcon](#trayicon)

[Section titled “trayIcon”](#trayicon)

[`TrayIconConfig`](#trayiconconfig) | `null`

Configuration for app tray icon.

##### [windows](#windows)

[Section titled “windows”](#windows)

[`WindowConfig`](#windowconfig)[]

The app windows configuration.

###### [Example:](#example)

[Section titled “Example:”](#example)

To create a window at app startup

```
{

"app": {

"windows": [

{ "width": 800, "height": 600 }

]

}

}
```

If not specified, the window’s label (its identifier) defaults to “main”,
you can use this label to get the window through
`app.get_webview_window` in Rust or `WebviewWindow.getByLabel` in JavaScript

When working with multiple windows, each window will need an unique label

```
{

"app": {

"windows": [

{ "label": "main", "width": 800, "height": 600 },

{ "label": "secondary", "width": 800, "height": 600 }

]

}

}
```

You can also set `create` to false and use this config through the Rust APIs

```
{

"app": {

"windows": [

{ "create": false, "width": 800, "height": 600 }

]

}

}
```

and use it like this

```
tauri::Builder::default()

.setup(|app| {

tauri::WebviewWindowBuilder::from_config(app.handle(), &app.config().app.windows[0])?.build()?;

Ok(())

});
```

**Default**: `[]`

##### [withGlobalTauri](#withglobaltauri)

[Section titled “withGlobalTauri”](#withglobaltauri)

`boolean`

Whether we should inject the Tauri API on `window.__TAURI__` or not.

### [AppImageConfig](#appimageconfig)

[Section titled “AppImageConfig”](#appimageconfig)

Configuration for AppImage bundles.

See more: <<https://v2.tauri.app/reference/config/#appimageconfig>>

**Object Properties**:

* bundleMediaFramework
* files

##### [bundleMediaFramework](#bundlemediaframework)

[Section titled “bundleMediaFramework”](#bundlemediaframework)

`boolean`

Include additional gstreamer dependencies needed for audio and video playback.
This increases the bundle size by ~15-35MB depending on your build system.

##### [files](#files)

[Section titled “files”](#files)

The files to include in the Appimage Binary.

**Allows additional properties**: `string`

**Default**: `{}`

### [AssetProtocolConfig](#assetprotocolconfig)

[Section titled “AssetProtocolConfig”](#assetprotocolconfig)

Config for the asset custom protocol.

See more: <<https://v2.tauri.app/reference/config/#assetprotocolconfig>>

**Object Properties**:

* enable
* scope

##### [enable](#enable)

[Section titled “enable”](#enable)

`boolean`

Enables the asset protocol.

##### [scope](#scope)

[Section titled “scope”](#scope)

[`FsScope`](#fsscope)

The access scope for the asset protocol.

**Default**: `[]`

### [AssociationExt](#associationext)

[Section titled “AssociationExt”](#associationext)

`string`

An extension for a [`FileAssociation`].

A leading `.` is automatically stripped.

### [BackgroundThrottlingPolicy](#backgroundthrottlingpolicy)

[Section titled “BackgroundThrottlingPolicy”](#backgroundthrottlingpolicy)

**One of the following**:

* `"disabled"` A policy where background throttling is disabled
* `"suspend"` A policy where a web view that’s not in a window fully suspends tasks. This is usually the default behavior in case no policy is set.
* `"throttle"` A policy where a web view that’s not in a window limits processing, but does not fully suspend tasks.

Background throttling policy.

### [BeforeDevCommand](#beforedevcommand)

[Section titled “BeforeDevCommand”](#beforedevcommand)

**Any of the following**:

* `string` Run the given script with the default options.
* Run the given script with custom options. **Object Properties**: - cwd - script (required) - wait ##### cwd `string` | `null` The current working directory. ##### script `string` The script to execute. ##### wait `boolean` Whether `tauri dev` should wait for the command to finish or not. Defaults to `false`.

Describes the shell command to run before `tauri dev`.

### [BuildConfig](#buildconfig)

[Section titled “BuildConfig”](#buildconfig)

The Build configuration object.

See more: <<https://v2.tauri.app/reference/config/#buildconfig>>

**Object Properties**:

* additionalWatchFolders
* beforeBuildCommand
* beforeBundleCommand
* beforeDevCommand
* devUrl
* features
* frontendDist
* removeUnusedCommands
* runner

##### [additionalWatchFolders](#additionalwatchfolders)

[Section titled “additionalWatchFolders”](#additionalwatchfolders)

`string`[]

Additional paths to watch for changes when running `tauri dev`.

**Default**: `[]`

##### [beforeBuildCommand](#beforebuildcommand)

[Section titled “beforeBuildCommand”](#beforebuildcommand)

[`HookCommand`](#hookcommand) | `null`

A shell command to run before `tauri build` kicks in.

The TAURI\_ENV\_PLATFORM, TAURI\_ENV\_ARCH, TAURI\_ENV\_FAMILY, TAURI\_ENV\_PLATFORM\_VERSION, TAURI\_ENV\_PLATFORM\_TYPE and TAURI\_ENV\_DEBUG environment variables are set if you perform conditional compilation.

##### [beforeBundleCommand](#beforebundlecommand)

[Section titled “beforeBundleCommand”](#beforebundlecommand)

[`HookCommand`](#hookcommand) | `null`

A shell command to run before the bundling phase in `tauri build` kicks in.

The TAURI\_ENV\_PLATFORM, TAURI\_ENV\_ARCH, TAURI\_ENV\_FAMILY, TAURI\_ENV\_PLATFORM\_VERSION, TAURI\_ENV\_PLATFORM\_TYPE and TAURI\_ENV\_DEBUG environment variables are set if you perform conditional compilation.

##### [beforeDevCommand](#beforedevcommand-1)

[Section titled “beforeDevCommand”](#beforedevcommand-1)

[`BeforeDevCommand`](#beforedevcommand) | `null`

A shell command to run before `tauri dev` kicks in.

The TAURI\_ENV\_PLATFORM, TAURI\_ENV\_ARCH, TAURI\_ENV\_FAMILY, TAURI\_ENV\_PLATFORM\_VERSION, TAURI\_ENV\_PLATFORM\_TYPE and TAURI\_ENV\_DEBUG environment variables are set if you perform conditional compilation.

##### [devUrl](#devurl)

[Section titled “devUrl”](#devurl)

`string` | `null` formatted as `uri`

The URL to load in development.

This is usually an URL to a dev server, which serves your application assets with hot-reload and HMR.
Most modern JavaScript bundlers like [Vite](https://vite.dev/guide/) provides a way to start a dev server by default.

If you don’t have a dev server or don’t want to use one, ignore this option and use [`frontendDist`](BuildConfig::frontend_dist)
and point to a web assets directory, and Tauri CLI will run its built-in dev server and provide a simple hot-reload experience.

##### [features](#features)

[Section titled “features”](#features)

`string`[] | `null`

Features passed to `cargo` commands.

##### [frontendDist](#frontenddist)

[Section titled “frontendDist”](#frontenddist)

[`FrontendDist`](#frontenddist) | `null`

The path to the application assets (usually the `dist` folder of your javascript bundler)
or a URL that could be either a custom protocol registered in the tauri app (for example: `myprotocol://`)
or a remote URL (for example: `https://site.com/app`).

When a path relative to the configuration file is provided,
it is read recursively and all files are embedded in the application binary.
Tauri then looks for an `index.html` and serves it as the default entry point for your application.

You can also provide a list of paths to be embedded, which allows granular control over what files are added to the binary.
In this case, all files are added to the root and you must reference it that way in your HTML files.

When a URL is provided, the application won’t have bundled assets
and the application will load that URL by default.

##### [removeUnusedCommands](#removeunusedcommands)

[Section titled “removeUnusedCommands”](#removeunusedcommands)

`boolean`

Try to remove unused commands registered from plugins base on the ACL list during `tauri build`,
the way it works is that tauri-cli will read this and set the environment variables for the build script and macros,
and they’ll try to get all the allowed commands and remove the rest

Note:

* This won’t be accounting for dynamically added ACLs when you use features from the `dynamic-acl` (currently enabled by default) feature flag, so make sure to check it when using this
* This feature requires tauri-plugin 2.1 and tauri 2.4

##### [runner](#runner)

[Section titled “runner”](#runner)

[`RunnerConfig`](#runnerconfig) | `null`

The binary used to build and run the application.

### [BundleConfig](#bundleconfig)

[Section titled “BundleConfig”](#bundleconfig)

Configuration for tauri-bundler.

See more: <<https://v2.tauri.app/reference/config/#bundleconfig>>

**Object Properties**:

* active
* android
* category
* copyright
* createUpdaterArtifacts
* externalBin
* fileAssociations
* homepage
* icon
* iOS
* license
* licenseFile
* linux
* longDescription
* macOS
* publisher
* resources
* shortDescription
* targets
* useLocalToolsDir
* windows

##### [active](#active)

[Section titled “active”](#active)

`boolean`

Whether Tauri should bundle your application or just output the executable.

##### [android](#android)

[Section titled “android”](#android)

[`AndroidConfig`](#androidconfig)

Android configuration.

Default

```
{

"autoIncrementVersionCode": false,

"minSdkVersion": 24

}
```

##### [category](#category)

[Section titled “category”](#category)

`string` | `null`

The application kind.

Should be one of the following:
Business, DeveloperTool, Education, Entertainment, Finance, Game, ActionGame, AdventureGame, ArcadeGame, BoardGame, CardGame, CasinoGame, DiceGame, EducationalGame, FamilyGame, KidsGame, MusicGame, PuzzleGame, RacingGame, RolePlayingGame, SimulationGame, SportsGame, StrategyGame, TriviaGame, WordGame, GraphicsAndDesign, HealthcareAndFitness, Lifestyle, Medical, Music, News, Photography, Productivity, Reference, SocialNetworking, Sports, Travel, Utility, Video, Weather.
