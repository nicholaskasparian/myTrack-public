# Source: https://tauri.app/reference/config/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# config — Part 8


**Default**: `"1"`

### [RunnerConfig](#runnerconfig)

[Section titled “RunnerConfig”](#runnerconfig)

**Any of the following**:

* `string` A string specifying the binary to run.
* An object with advanced configuration options. **Object Properties**: - args - cmd (required) - cwd ##### args `string`[] | `null` Arguments to pass to the command. ##### cmd `string` The binary to run. ##### cwd `string` | `null` The current working directory to run the command from.

The runner configuration.

### [ScrollBarStyle](#scrollbarstyle)

[Section titled “ScrollBarStyle”](#scrollbarstyle)

**One of the following**:

* `"default"` The scrollbar style to use in the webview.
* `"fluentOverlay"` Fluent UI style overlay scrollbars. **Windows Only** Requires WebView2 Runtime version 125.0.2535.41 or higher, does nothing on older versions, see <https://learn.microsoft.com/en-us/microsoft-edge/webview2/release-notes/?tabs=dotnetcsharp#10253541>

The scrollbar style to use in the webview.

##### [Platform-specific](#platform-specific-1)

[Section titled “Platform-specific”](#platform-specific-1)

* **Windows**: This option must be given the same value for all webviews that target the same data directory.

### [SecurityConfig](#securityconfig)

[Section titled “SecurityConfig”](#securityconfig)

Security configuration.

See more: <<https://v2.tauri.app/reference/config/#securityconfig>>

**Object Properties**:

* assetProtocol
* capabilities
* csp
* dangerousDisableAssetCspModification
* devCsp
* freezePrototype
* headers
* pattern

##### [assetProtocol](#assetprotocol)

[Section titled “assetProtocol”](#assetprotocol)

[`AssetProtocolConfig`](#assetprotocolconfig)

Custom protocol config.

Default

```
{

"enable": false,

"scope": []

}
```

##### [capabilities](#capabilities)

[Section titled “capabilities”](#capabilities)

[`CapabilityEntry`](#capabilityentry)[]

List of capabilities that are enabled on the application.

By default (not set or empty list), all capability files from `./capabilities/` are included,
by setting values in this entry, you have fine grained control over which capabilities are included

You can either reference a capability file defined in `./capabilities/` with its identifier or inline a [`Capability`]

###### [Example](#example-10)

[Section titled “Example”](#example-10)

```
{

"app": {

"capabilities": [

"main-window",

{

"identifier": "drag-window",

"permissions": ["core:window:allow-start-dragging"]

}

]

}

}
```

**Default**: `[]`

##### [csp](#csp-1)

[Section titled “csp”](#csp-1)

[`Csp`](#csp) | `null`

The Content Security Policy that will be injected on all HTML files on the built application.
If [`dev_csp`](#securityconfig) is not specified, this value is also injected on dev.

This is a really important part of the configuration since it helps you ensure your WebView is secured.
See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP>>.

##### [dangerousDisableAssetCspModification](#dangerousdisableassetcspmodification)

[Section titled “dangerousDisableAssetCspModification”](#dangerousdisableassetcspmodification)

[`DisabledCspModificationKind`](#disabledcspmodificationkind)

Disables the Tauri-injected CSP sources.

At compile time, Tauri parses all the frontend assets and changes the Content-Security-Policy
to only allow loading of your own scripts and styles by injecting nonce and hash sources.
This stricts your CSP, which may introduce issues when using along with other flexing sources.

This configuration option allows both a boolean and a list of strings as value.
A boolean instructs Tauri to disable the injection for all CSP injections,
and a list of strings indicates the CSP directives that Tauri cannot inject.

**WARNING:** Only disable this if you know what you are doing and have properly configured the CSP.
Your application might be vulnerable to XSS attacks without this Tauri protection.

##### [devCsp](#devcsp)

[Section titled “devCsp”](#devcsp)

[`Csp`](#csp) | `null`

The Content Security Policy that will be injected on all HTML files on development.

This is a really important part of the configuration since it helps you ensure your WebView is secured.
See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP>>.

##### [freezePrototype](#freezeprototype)

[Section titled “freezePrototype”](#freezeprototype)

`boolean`

Freeze the `Object.prototype` when using the custom protocol.

##### [headers](#headers)

[Section titled “headers”](#headers)

[`HeaderConfig`](#headerconfig) | `null`

The headers, which are added to every http response from tauri to the web view
This doesn’t include IPC Messages and error responses

##### [pattern](#pattern)

[Section titled “pattern”](#pattern)

[`PatternKind`](#patternkind)

The pattern to use.

Default

```
{

"use": "brownfield"

}
```

### [Size](#size)

[Section titled “Size”](#size)

Size of the window.

**Object Properties**:

* height (required)
* width (required)

##### [height](#height-1)

[Section titled “height”](#height-1)

`integer` formatted as `uint32`

Height of the window.

##### [width](#width-1)

[Section titled “width”](#width-1)

`integer` formatted as `uint32`

Width of the window.

### [Target](#target)

[Section titled “Target”](#target)

**One of the following**:

* `"macOS"` MacOS.
* `"windows"` Windows.
* `"linux"` Linux.
* `"android"` Android.
* `"iOS"` iOS.

Platform target.

### [Theme](#theme)

[Section titled “Theme”](#theme)

**One of the following**:

* `"Light"` Light theme.
* `"Dark"` Dark theme.

System theme.

### [TitleBarStyle](#titlebarstyle)

[Section titled “TitleBarStyle”](#titlebarstyle)

**One of the following**:

* `"Visible"` A normal title bar.
* `"Transparent"` Makes the title bar transparent, so the window background color is shown instead. Useful if you don’t need to have actual HTML under the title bar. This lets you avoid the caveats of using `TitleBarStyle::Overlay`. Will be more useful when Tauri lets you set a custom window background color.
* `"Overlay"` Shows the title bar as a transparent overlay over the window’s content. Keep in mind: - The height of the title bar is different on different OS versions, which can lead to window the controls and title not being where you don’t expect. - You need to define a custom drag region to make your window draggable, however due to a limitation you can’t drag the window when it’s not in focus <<https://github.com/tauri-apps/tauri/issues/4316>>. - The color of the window title depends on the system theme.

How the window title bar should be displayed on macOS.

### [TrayIconConfig](#trayiconconfig)

[Section titled “TrayIconConfig”](#trayiconconfig)

Configuration for application tray icon.

See more: <<https://v2.tauri.app/reference/config/#trayiconconfig>>

**Object Properties**:

* iconAsTemplate
* iconPath (required)
* id
* menuOnLeftClick
* showMenuOnLeftClick
* title
* tooltip

##### [iconAsTemplate](#iconastemplate)

[Section titled “iconAsTemplate”](#iconastemplate)

`boolean`

A Boolean value that determines whether the image represents a [template](https://developer.apple.com/documentation/appkit/nsimage/1520017-template?language=objc) image on macOS.

##### [iconPath](#iconpath)

[Section titled “iconPath”](#iconpath)

`string`

Path to the default icon to use for the tray icon.

Note: this stores the image in raw pixels to the final binary,
so keep the icon size (width and height) small
or else it’s going to bloat your final executable

##### [id](#id)

[Section titled “id”](#id)

`string` | `null`

Set an id for this tray icon so you can reference it later, defaults to `main`.

##### [menuOnLeftClick](#menuonleftclick)

[Section titled “menuOnLeftClick”](#menuonleftclick)

`boolean`

A Boolean value that determines whether the menu should appear when the tray icon receives a left click.

###### [Platform-specific:](#platform-specific-2)

[Section titled “Platform-specific:”](#platform-specific-2)

* **Linux**: Unsupported.

**Default**: `true`

##### [showMenuOnLeftClick](#showmenuonleftclick)

[Section titled “showMenuOnLeftClick”](#showmenuonleftclick)

`boolean`

A Boolean value that determines whether the menu should appear when the tray icon receives a left click.

###### [Platform-specific:](#platform-specific-3)

[Section titled “Platform-specific:”](#platform-specific-3)

* **Linux**: Unsupported.

**Default**: `true`

##### [title](#title)

[Section titled “title”](#title)

`string` | `null`

Title for MacOS tray

##### [tooltip](#tooltip)

[Section titled “tooltip”](#tooltip)

`string` | `null`

Tray icon tooltip on Windows and macOS

### [Updater](#updater)

[Section titled “Updater”](#updater)

**Any of the following**:

* [`V1Compatible`](#v1compatible) Generates legacy zipped v1 compatible updaters
* `boolean` Produce updaters and their signatures or not

Updater type

### [V1Compatible](#v1compatible)

[Section titled “V1Compatible”](#v1compatible)

`"v1Compatible"`,Generates legacy zipped v1 compatible updaters

Generates legacy zipped v1 compatible updaters

### [Value](#value)

[Section titled “Value”](#value)

**Any of the following**:

* `null` Represents a null JSON value.
* `boolean` Represents a [`bool`].
* [`Number`](#number) Represents a valid ACL [`Number`].
* `string` Represents a [`String`].
* [`Value`](#value)[] Represents a list of other [`Value`]s.
* Represents a map of [`String`] keys to [`Value`]s. **Allows additional properties**: [`Value`](#value)

All supported ACL values.

### [WebviewInstallMode](#webviewinstallmode)

[Section titled “WebviewInstallMode”](#webviewinstallmode)

**One of the following**:

* Do not install the Webview2 as part of the Windows Installer. **Object Properties**: - type (required) ##### type `"skip"`
* Download the bootstrapper and run it. Requires an internet connection. Results in a smaller installer size, but is not recommended on Windows 7. **Object Properties**: - silent - type (required) ##### silent `boolean` Instructs the installer to run the bootstrapper in silent mode. Defaults to `true`. **Default**: `true` ##### type `"downloadBootstrapper"`
* Embed the bootstrapper and run it. Requires an internet connection. Increases the installer size by around 1.8MB, but offers better support on Windows 7. **Object Properties**: - silent - type (required) ##### silent `boolean` Instructs the installer to run the bootstrapper in silent mode. Defaults to `true`. **Default**: `true` ##### type `"embedBootstrapper"`
* Embed the offline installer and run it. Does not require an internet connection. Increases the installer size by around 127MB. **Object Properties**: - silent - type (required) ##### silent `boolean` Instructs the installer to run the installer in silent mode. Defaults to `true`. **Default**: `true` ##### type `"offlineInstaller"`
* Embed a fixed webview2 version and use it at runtime. Increases the installer size by around 180MB. **Object Properties**: - path (required) - type (required) ##### path `string` The path to the fixed runtime to use. The fixed version can be downloaded [on the official website](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section). The `.cab` file must be extracted to a folder and this folder path must be defined on this field. ##### type `"fixedRuntime"`

Install modes for the Webview2 runtime.
Note that for the updater bundle [`Self::DownloadBootstrapper`] is used.

For more information see <<https://v2.tauri.app/distribute/windows-installer/#webview2-installation-options>>.

### [WebviewUrl](#webviewurl)

[Section titled “WebviewUrl”](#webviewurl)

**Any of the following**:

* `string` formatted as `uri` An external URL. Must use either the `http` or `https` schemes.
* `string` The path portion of an app URL. For instance, to load `tauri://localhost/users/john`, you can simply provide `users/john` in this configuration.
* `string` formatted as `uri` A custom protocol url, for example, `doom://index.html`

An URL to open on a Tauri webview window.

### [WindowConfig](#windowconfig)

[Section titled “WindowConfig”](#windowconfig)

The window configuration object.

See more: <<https://v2.tauri.app/reference/config/#windowconfig>>

**Object Properties**:

* acceptFirstMouse
* additionalBrowserArgs
* allowLinkPreview
* alwaysOnBottom
* alwaysOnTop
* backgroundColor
* backgroundThrottling
* browserExtensionsEnabled
* center
* closable
* contentProtected
* create
* dataDirectory
* dataStoreIdentifier
* decorations
* devtools
* disableInputAccessoryView
* dragDropEnabled
* focus
* focusable
* fullscreen
* height
* hiddenTitle
* incognito
* javascriptDisabled
* label
* maxHeight
* maximizable
* maximized
