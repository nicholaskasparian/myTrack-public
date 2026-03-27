# Source: https://tauri.app/reference/config/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# config — Part 3


##### [copyright](#copyright)

[Section titled “copyright”](#copyright)

`string` | `null`

A copyright string associated with your application.

##### [createUpdaterArtifacts](#createupdaterartifacts)

[Section titled “createUpdaterArtifacts”](#createupdaterartifacts)

[`Updater`](#updater)

Produce updaters and their signatures or not

##### [externalBin](#externalbin)

[Section titled “externalBin”](#externalbin)

`string`[] | `null`

A list of—either absolute or relative—paths to binaries to embed with your application.

Note that Tauri will look for system-specific binaries following the pattern “binary-name{-target-triple}{.system-extension}”.

E.g. for the external binary “my-binary”, Tauri looks for:

* “my-binary-x86\_64-pc-windows-msvc.exe” for Windows
* “my-binary-x86\_64-apple-darwin” for macOS
* “my-binary-x86\_64-unknown-linux-gnu” for Linux

so don’t forget to provide binaries for all targeted platforms.

##### [fileAssociations](#fileassociations)

[Section titled “fileAssociations”](#fileassociations)

[`FileAssociation`](#fileassociation)[] | `null`

File types to associate with the application.

##### [homepage](#homepage)

[Section titled “homepage”](#homepage)

`string` | `null`

A url to the home page of your application. If unset, will
fallback to `homepage` defined in `Cargo.toml`.

Supported bundle targets: `deb`, `rpm`, `nsis` and `msi`.

##### [icon](#icon)

[Section titled “icon”](#icon)

`string`[]

The app’s icons

**Default**: `[]`

##### [iOS](#ios)

[Section titled “iOS”](#ios)

[`IosConfig`](#iosconfig)

iOS configuration.

Default

```
{

"minimumSystemVersion": "14.0"

}
```

##### [license](#license)

[Section titled “license”](#license)

`string` | `null`

The package’s license identifier to be included in the appropriate bundles.
If not set, defaults to the license from the Cargo.toml file.

##### [licenseFile](#licensefile)

[Section titled “licenseFile”](#licensefile)

`string` | `null`

The path to the license file to be included in the appropriate bundles.

##### [linux](#linux)

[Section titled “linux”](#linux)

[`LinuxConfig`](#linuxconfig)

Configuration for the Linux bundles.

Default

```
{

"appimage": {

"bundleMediaFramework": false,

"files": {}

},

"deb": {

"files": {}

},

"rpm": {

"epoch": 0,

"files": {},

"release": "1"

}

}
```

##### [longDescription](#longdescription)

[Section titled “longDescription”](#longdescription)

`string` | `null`

A longer, multi-line description of the application.

##### [macOS](#macos)

[Section titled “macOS”](#macos)

[`MacConfig`](#macconfig)

Configuration for the macOS bundles.

Default

```
{

"dmg": {

"appPosition": {

"x": 180,

"y": 170

},

"applicationFolderPosition": {

"x": 480,

"y": 170

},

"windowSize": {

"height": 400,

"width": 660

}

},

"files": {},

"hardenedRuntime": true,

"minimumSystemVersion": "10.13"

}
```

##### [publisher](#publisher)

[Section titled “publisher”](#publisher)

`string` | `null`

The application’s publisher. Defaults to the second element in the identifier string.

Currently maps to the Manufacturer property of the Windows Installer
and the Maintainer field of debian packages if the Cargo.toml does not have the authors field.

##### [resources](#resources)

[Section titled “resources”](#resources)

[`BundleResources`](#bundleresources) | `null`

App resources to bundle.
Each resource is a path to a file or directory.
Glob patterns are supported.

###### [Examples](#examples)

[Section titled “Examples”](#examples)

To include a list of files:

```
{

"bundle": {

"resources": [

"./path/to/some-file.txt",

"/absolute/path/to/textfile.txt",

"../relative/path/to/jsonfile.json",

"some-folder/",

"resources/**/*.md"

]

}

}
```

The bundled files will be in `$RESOURCES/` with the original directory structure preserved,
for example: `./path/to/some-file.txt` -> `$RESOURCE/path/to/some-file.txt`

To fine control where the files will get copied to, use a map instead

```
{

"bundle": {

"resources": {

"/absolute/path/to/textfile.txt": "resources/textfile.txt",

"relative/path/to/jsonfile.json": "resources/jsonfile.json",

"resources/": "",

"docs/**/*md": "website-docs/"

}

}

}
```

Note that when using glob pattern in this case, the original directory structure is not preserved,
everything gets copied to the target directory directly

See more: <<https://v2.tauri.app/develop/resources/>>

##### [shortDescription](#shortdescription)

[Section titled “shortDescription”](#shortdescription)

`string` | `null`

A short description of your application.

##### [targets](#targets)

[Section titled “targets”](#targets)

[`BundleTarget`](#bundletarget)

The bundle targets, currently supports [“deb”, “rpm”, “appimage”, “nsis”, “msi”, “app”, “dmg”] or “all”.

**Default**: `"all"`

##### [useLocalToolsDir](#uselocaltoolsdir)

[Section titled “useLocalToolsDir”](#uselocaltoolsdir)

`boolean`

Whether to use the project’s `target` directory, for caching build tools (e.g., Wix and NSIS) when building this application. Defaults to `false`.

If true, tools will be cached in `target/.tauri/`.
If false, tools will be cached in the current user’s platform-specific cache directory.

An example where it can be appropriate to set this to `true` is when building this application as a Windows System user (e.g., AWS EC2 workloads),
because the Window system’s app data directory is restricted.

##### [windows](#windows-1)

[Section titled “windows”](#windows-1)

[`WindowsConfig`](#windowsconfig)

Configuration for the Windows bundles.

Default

```
{

"allowDowngrades": true,

"certificateThumbprint": null,

"digestAlgorithm": null,

"nsis": null,

"signCommand": null,

"timestampUrl": null,

"tsp": false,

"webviewInstallMode": {

"silent": true,

"type": "downloadBootstrapper"

},

"wix": null

}
```

### [BundleResources](#bundleresources)

[Section titled “BundleResources”](#bundleresources)

**Any of the following**:

* `string`[] A list of paths to include.
* A map of source to target paths. **Allows additional properties**: `string`

Definition for bundle resources.
Can be either a list of paths to include or a map of source to target paths.

### [BundleTarget](#bundletarget)

[Section titled “BundleTarget”](#bundletarget)

**Any of the following**:

* `"all"` Bundle all targets.
* [`BundleType`](#bundletype)[] A list of bundle targets.
* [`BundleType`](#bundletype) A single bundle target.

Targets to bundle. Each value is case insensitive.

### [BundleType](#bundletype)

[Section titled “BundleType”](#bundletype)

**One of the following**:

* `"deb"` The debian bundle (.deb).
* `"rpm"` The RPM bundle (.rpm).
* `"appimage"` The AppImage bundle (.appimage).
* `"msi"` The Microsoft Installer bundle (.msi).
* `"nsis"` The NSIS bundle (.exe).
* `"app"` The macOS application bundle (.app).
* `"dmg"` The Apple Disk Image bundle (.dmg).

A bundle referenced by tauri-bundler.

### [BundleTypeRole](#bundletyperole)

[Section titled “BundleTypeRole”](#bundletyperole)

**One of the following**:

* `"Editor"` CFBundleTypeRole.Editor. Files can be read and edited.
* `"Viewer"` CFBundleTypeRole.Viewer. Files can be read.
* `"Shell"` CFBundleTypeRole.Shell
* `"QLGenerator"` CFBundleTypeRole.QLGenerator
* `"None"` CFBundleTypeRole.None

macOS-only. Corresponds to CFBundleTypeRole

### [Capability](#capability)

[Section titled “Capability”](#capability)

A grouping and boundary mechanism developers can use to isolate access to the IPC layer.

It controls application windows’ and webviews’ fine grained access
to the Tauri core, application, or plugin commands.
If a webview or its window is not matching any capability then it has no access to the IPC layer at all.

This can be done to create groups of windows, based on their required system access, which can reduce
impact of frontend vulnerabilities in less privileged windows.
Windows can be added to a capability by exact name (e.g. `main-window`) or glob patterns like `*` or `admin-*`.
A Window can have none, one, or multiple associated capabilities.

##### [Example](#example-1)

[Section titled “Example”](#example-1)

```
{

"identifier": "main-user-files-write",

"description": "This capability allows the `main` window on macOS and Windows access to `filesystem` write related commands and `dialog` commands to enable programmatic access to files selected by the user.",

"windows": [

"main"

],

"permissions": [

"core:default",

"dialog:open",

{

"identifier": "fs:allow-write-text-file",

"allow": [{ "path": "$HOME/test.txt" }]

