# Source: https://tauri.app/reference/config/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# config — Part 10

##### [preventOverflow](#preventoverflow)

[Section titled “preventOverflow”](#preventoverflow)

[`PreventOverflowConfig`](#preventoverflowconfig) | `null`

Whether or not to prevent the window from overflowing the workarea

###### [Platform-specific](#platform-specific-15)

[Section titled “Platform-specific”](#platform-specific-15)

* **iOS / Android:** Unsupported.

##### [proxyUrl](#proxyurl)

[Section titled “proxyUrl”](#proxyurl)

`string` | `null` formatted as `uri`

The proxy URL for the WebView for all network requests.

Must be either a `http://` or a `socks5://` URL.

###### [Platform-specific](#platform-specific-16)

[Section titled “Platform-specific”](#platform-specific-16)

* **macOS**: Requires the `macos-proxy` feature flag and only compiles for macOS 14+.

##### [resizable](#resizable)

[Section titled “resizable”](#resizable)

`boolean`

Whether the window is resizable or not. When resizable is set to false, native window’s maximize button is automatically disabled.

**Default**: `true`

##### [scrollBarStyle](#scrollbarstyle-1)

[Section titled “scrollBarStyle”](#scrollbarstyle-1)

[`ScrollBarStyle`](#scrollbarstyle)

Specifies the native scrollbar style to use with the webview.
CSS styles that modify the scrollbar are applied on top of the native appearance configured here.

Defaults to `default`, which is the browser default.

###### [Platform-specific](#platform-specific-17)

[Section titled “Platform-specific”](#platform-specific-17)

* **Windows**:
  + `fluentOverlay` requires WebView2 Runtime version 125.0.2535.41 or higher,
    and does nothing on older versions.
  + This option must be given the same value for all webviews that target the same data directory.
* **Linux / Android / iOS / macOS**: Unsupported. Only supports `Default` and performs no operation.

**Default**: `"default"`

##### [shadow](#shadow)

[Section titled “shadow”](#shadow)

`boolean`

Whether or not the window has shadow.

###### [Platform-specific](#platform-specific-18)

[Section titled “Platform-specific”](#platform-specific-18)

* **Windows:**
  + `false` has no effect on decorated window, shadow are always ON.
  + `true` will make undecorated window have a 1px white border,
    and on Windows 11, it will have a rounded corners.
* **Linux:** Unsupported.

**Default**: `true`

##### [skipTaskbar](#skiptaskbar)

[Section titled “skipTaskbar”](#skiptaskbar)

`boolean`

If `true`, hides the window icon from the taskbar on Windows and Linux.

##### [tabbingIdentifier](#tabbingidentifier)

[Section titled “tabbingIdentifier”](#tabbingidentifier)

`string` | `null`

Defines the window [tabbing identifier](%3Chttps://developer.apple.com/documentation/appkit/nswindow/1644704-tabbingidentifier%3E) for macOS.

Windows with matching tabbing identifiers will be grouped together.
If the tabbing identifier is not set, automatic tabbing will be disabled.

##### [theme](#theme-1)

[Section titled “theme”](#theme-1)

[`Theme`](#theme) | `null`

The initial window theme. Defaults to the system theme. Only implemented on Windows and macOS 10.14+.

##### [title](#title-1)

[Section titled “title”](#title-1)

`string`

The window title.

**Default**: `"Tauri App"`

##### [titleBarStyle](#titlebarstyle-1)

[Section titled “titleBarStyle”](#titlebarstyle-1)

[`TitleBarStyle`](#titlebarstyle)

The style of the macOS title bar.

**Default**: `"Visible"`

##### [trafficLightPosition](#trafficlightposition)

[Section titled “trafficLightPosition”](#trafficlightposition)

[`LogicalPosition`](#logicalposition) | `null`

The position of the window controls on macOS.

Requires titleBarStyle: Overlay and decorations: true.

##### [transparent](#transparent)

[Section titled “transparent”](#transparent)

`boolean`

Whether the window is transparent or not.

Note that on `macOS` this requires the `macos-private-api` feature flag, enabled under `tauri &gt; macOSPrivateApi`.
WARNING: Using private APIs on `macOS` prevents your application from being accepted to the `App Store`.

##### [url](#url)

[Section titled “url”](#url)

[`WebviewUrl`](#webviewurl)

The window webview URL.

**Default**: `"index.html"`

##### [useHttpsScheme](#usehttpsscheme)

[Section titled “useHttpsScheme”](#usehttpsscheme)

`boolean`

Sets whether the custom protocols should use `https://&lt;scheme&gt;.localhost` instead of the default `http://&lt;scheme&gt;.localhost` on Windows and Android. Defaults to `false`.

###### [Note](#note)

[Section titled “Note”](#note)

Using a `https` scheme will NOT allow mixed content when trying to fetch `http` endpoints and therefore will not match the behavior of the `&lt;scheme&gt;://localhost` protocols used on macOS and Linux.

###### [Warning](#warning)

[Section titled “Warning”](#warning)

Changing this value between releases will change the IndexedDB, cookies and localstorage location and your app will not be able to access the old data.

##### [userAgent](#useragent)

[Section titled “userAgent”](#useragent)

`string` | `null`

The user agent for the webview

##### [visible](#visible)

[Section titled “visible”](#visible)

`boolean`

Whether the window is visible or not.

**Default**: `true`

##### [visibleOnAllWorkspaces](#visibleonallworkspaces)

[Section titled “visibleOnAllWorkspaces”](#visibleonallworkspaces)

`boolean`

Whether the window should be visible on all workspaces or virtual desktops.

###### [Platform-specific](#platform-specific-19)

[Section titled “Platform-specific”](#platform-specific-19)

* **Windows / iOS / Android:** Unsupported.

##### [width](#width-2)

[Section titled “width”](#width-2)

`number` formatted as `double`

The window width in logical pixels.

**Default**: `800`

##### [windowClassname](#windowclassname)

[Section titled “windowClassname”](#windowclassname)

`string` | `null`

The name of the window class created on Windows to create the window. **Windows only**.

##### [windowEffects](#windoweffects)

[Section titled “windowEffects”](#windoweffects)

[`WindowEffectsConfig`](#windoweffectsconfig) | `null`

Window effects.

Requires the window to be transparent.

###### [Platform-specific:](#platform-specific-20)

[Section titled “Platform-specific:”](#platform-specific-20)

* **Windows**: If using decorations or shadows, you may want to try this workaround <<https://github.com/tauri-apps/tao/issues/72#issuecomment-975607891>>
* **Linux**: Unsupported

##### [x](#x-2)

[Section titled “x”](#x-2)

`number` | `null` formatted as `double`

The horizontal position of the window’s top left corner in logical pixels

##### [y](#y-2)

[Section titled “y”](#y-2)

`number` | `null` formatted as `double`

The vertical position of the window’s top left corner in logical pixels

##### [zoomHotkeysEnabled](#zoomhotkeysenabled)

[Section titled “zoomHotkeysEnabled”](#zoomhotkeysenabled)

`boolean`

Whether page zooming by hotkeys is enabled

###### [Platform-specific:](#platform-specific-21)

[Section titled “Platform-specific:”](#platform-specific-21)

* **Windows**: Controls WebView2’s [`IsZoomControlEnabled`](https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/winrt/microsoft_web_webview2_core/corewebview2settings?view=webview2-winrt-1.0.2420.47#iszoomcontrolenabled) setting.
* **MacOS / Linux**: Injects a polyfill that zooms in and out with `ctrl/command` + `-/=`,
  20% in each step, ranging from 20% to 1000%. Requires `webview:allow-set-webview-zoom` permission
* **Android / iOS**: Unsupported.

### [WindowEffect](#windoweffect)

[Section titled “WindowEffect”](#windoweffect)

**One of the following**:

* `"appearanceBased"` A default material appropriate for the view’s effectiveAppearance. **macOS 10.14-**
* `"light"` **macOS 10.14-**
* `"dark"` **macOS 10.14-**
* `"mediumLight"` **macOS 10.14-**
* `"ultraDark"` **macOS 10.14-**
* `"titlebar"` **macOS 10.10+**
* `"selection"` **macOS 10.10+**
* `"menu"` **macOS 10.11+**
* `"popover"` **macOS 10.11+**
* `"sidebar"` **macOS 10.11+**
* `"headerView"` **macOS 10.14+**
* `"sheet"` **macOS 10.14+**
* `"windowBackground"` **macOS 10.14+**
* `"hudWindow"` **macOS 10.14+**
* `"fullScreenUI"` **macOS 10.14+**
* `"tooltip"` **macOS 10.14+**
* `"contentBackground"` **macOS 10.14+**
* `"underWindowBackground"` **macOS 10.14+**
* `"underPageBackground"` **macOS 10.14+**
* `"mica"` Mica effect that matches the system dark preference **Windows 11 Only**
* `"micaDark"` Mica effect with dark mode but only if dark mode is enabled on the system **Windows 11 Only**
* `"micaLight"` Mica effect with light mode **Windows 11 Only**
* `"tabbed"` Tabbed effect that matches the system dark preference **Windows 11 Only**
* `"tabbedDark"` Tabbed effect with dark mode but only if dark mode is enabled on the system **Windows 11 Only**
* `"tabbedLight"` Tabbed effect with light mode **Windows 11 Only**
* `"blur"` **Windows 7/10/11(22H1) Only** ##### Notes This effect has bad performance when resizing/dragging the window on Windows 11 build 22621.
* `"acrylic"` **Windows 10/11 Only** ##### Notes This effect has bad performance when resizing/dragging the window on Windows 10 v1903+ and Windows 11 build 22000.

Platform-specific window effects

### [WindowEffectsConfig](#windoweffectsconfig)

[Section titled “WindowEffectsConfig”](#windoweffectsconfig)

The window effects configuration object

**Object Properties**:

* color
* effects (required)
* radius
* state

##### [color](#color-1)

[Section titled “color”](#color-1)

[`Color`](#color) | `null`

Window effect color. Affects [`WindowEffect::Blur`] and [`WindowEffect::Acrylic`] only
on Windows 10 v1903+. Doesn’t have any effect on Windows 7 or Windows 11.

##### [effects](#effects)

[Section titled “effects”](#effects)

[`WindowEffect`](#windoweffect)[]

List of Window effects to apply to the Window.
Conflicting effects will apply the first one and ignore the rest.

##### [radius](#radius)

[Section titled “radius”](#radius)

`number` | `null` formatted as `double`

Window effect corner radius **macOS Only**

##### [state](#state)

[Section titled “state”](#state)

[`WindowEffectState`](#windoweffectstate) | `null`

Window effect state **macOS Only**

### [WindowEffectState](#windoweffectstate)

[Section titled “WindowEffectState”](#windoweffectstate)

**One of the following**:

* `"followsWindowActiveState"` Make window effect state follow the window’s active state
* `"active"` Make window effect state always active
* `"inactive"` Make window effect state always inactive

Window effect state **macOS only**

<<https://developer.apple.com/documentation/appkit/nsvisualeffectview/state>>

### [WindowsConfig](#windowsconfig)

[Section titled “WindowsConfig”](#windowsconfig)

Windows bundler configuration.

See more: <<https://v2.tauri.app/reference/config/#windowsconfig>>

**Object Properties**:

* allowDowngrades
* certificateThumbprint
* digestAlgorithm
* nsis
* signCommand
* timestampUrl
* tsp
* webviewInstallMode
* wix

##### [allowDowngrades](#allowdowngrades)

[Section titled “allowDowngrades”](#allowdowngrades)

`boolean`

Validates a second app installation, blocking the user from installing an older version if set to `false`.

For instance, if `1.2.1` is installed, the user won’t be able to install app version `1.2.0` or `1.1.5`.

The default value of this flag is `true`.

**Default**: `true`

##### [certificateThumbprint](#certificatethumbprint)

[Section titled “certificateThumbprint”](#certificatethumbprint)

`string` | `null`

Specifies the SHA1 hash of the signing certificate.

##### [digestAlgorithm](#digestalgorithm)

[Section titled “digestAlgorithm”](#digestalgorithm)

`string` | `null`

Specifies the file digest algorithm to use for creating file signatures.
Required for code signing. SHA-256 is recommended.

##### [nsis](#nsis)

[Section titled “nsis”](#nsis)

[`NsisConfig`](#nsisconfig) | `null`

Configuration for the installer generated with NSIS.

##### [signCommand](#signcommand)

[Section titled “signCommand”](#signcommand)

[`CustomSignCommandConfig`](#customsigncommandconfig) | `null`

Specify a custom command to sign the binaries.
This command needs to have a `%1` in args which is just a placeholder for the binary path,
which we will detect and replace before calling the command.

By Default we use `signtool.exe` which can be found only on Windows so
if you are on another platform and want to cross-compile and sign you will
need to use another tool like `osslsigncode`.
