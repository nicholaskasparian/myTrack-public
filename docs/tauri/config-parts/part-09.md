# Source: https://tauri.app/reference/config/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# config — Part 9

* maxWidth
* minHeight
* minimizable
* minWidth
* parent
* preventOverflow
* proxyUrl
* resizable
* scrollBarStyle
* shadow
* skipTaskbar
* tabbingIdentifier
* theme
* title
* titleBarStyle
* trafficLightPosition
* transparent
* url
* useHttpsScheme
* userAgent
* visible
* visibleOnAllWorkspaces
* width
* windowClassname
* windowEffects
* x
* y
* zoomHotkeysEnabled

##### [acceptFirstMouse](#acceptfirstmouse)

[Section titled “acceptFirstMouse”](#acceptfirstmouse)

`boolean`

Whether clicking an inactive window also clicks through to the webview on macOS.

##### [additionalBrowserArgs](#additionalbrowserargs)

[Section titled “additionalBrowserArgs”](#additionalbrowserargs)

`string` | `null`

Defines additional browser arguments on Windows. By default wry passes `--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection`
so if you use this method, you also need to disable these components by yourself if you want.

##### [allowLinkPreview](#allowlinkpreview)

[Section titled “allowLinkPreview”](#allowlinkpreview)

`boolean`

on macOS and iOS there is a link preview on long pressing links, this is enabled by default.
see <https://docs.rs/objc2-web-kit/latest/objc2_web_kit/struct.WKWebView.html#method.allowsLinkPreview>

**Default**: `true`

##### [alwaysOnBottom](#alwaysonbottom)

[Section titled “alwaysOnBottom”](#alwaysonbottom)

`boolean`

Whether the window should always be below other windows.

##### [alwaysOnTop](#alwaysontop)

[Section titled “alwaysOnTop”](#alwaysontop)

`boolean`

Whether the window should always be on top of other windows.

##### [backgroundColor](#backgroundcolor)

[Section titled “backgroundColor”](#backgroundcolor)

[`Color`](#color) | `null`

Set the window and webview background color.

###### [Platform-specific:](#platform-specific-4)

[Section titled “Platform-specific:”](#platform-specific-4)

* **Windows**: alpha channel is ignored for the window layer.
* **Windows**: On Windows 7, alpha channel is ignored for the webview layer.
* **Windows**: On Windows 8 and newer, if alpha channel is not `0`, it will be ignored for the webview layer.

##### [backgroundThrottling](#backgroundthrottling)

[Section titled “backgroundThrottling”](#backgroundthrottling)

[`BackgroundThrottlingPolicy`](#backgroundthrottlingpolicy) | `null`

Change the default background throttling behaviour.

By default, browsers use a suspend policy that will throttle timers and even unload
the whole tab (view) to free resources after roughly 5 minutes when a view became
minimized or hidden. This will pause all tasks until the documents visibility state
changes back from hidden to visible by bringing the view back to the foreground.

###### [Platform-specific](#platform-specific-5)

[Section titled “Platform-specific”](#platform-specific-5)

* **Linux / Windows / Android**: Unsupported. Workarounds like a pending WebLock transaction might suffice.
* **iOS**: Supported since version 17.0+.
* **macOS**: Supported since version 14.0+.

see <https://github.com/tauri-apps/tauri/issues/5250#issuecomment-2569380578>

##### [browserExtensionsEnabled](#browserextensionsenabled)

[Section titled “browserExtensionsEnabled”](#browserextensionsenabled)

`boolean`

Whether browser extensions can be installed for the webview process

###### [Platform-specific:](#platform-specific-6)

[Section titled “Platform-specific:”](#platform-specific-6)

* **Windows**: Enables the WebView2 environment’s [`AreBrowserExtensionsEnabled`](https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/winrt/microsoft_web_webview2_core/corewebview2environmentoptions?view=webview2-winrt-1.0.2739.15#arebrowserextensionsenabled)
* **MacOS / Linux / iOS / Android** - Unsupported.

##### [center](#center)

[Section titled “center”](#center)

`boolean`

Whether or not the window starts centered or not.

##### [closable](#closable)

[Section titled “closable”](#closable)

`boolean`

Whether the window’s native close button is enabled or not.

###### [Platform-specific](#platform-specific-7)

[Section titled “Platform-specific”](#platform-specific-7)

* **Linux:** “GTK+ will do its best to convince the window manager not to show a close button.
  Depending on the system, this function may not have any effect when called on a window that is already visible”
* **iOS / Android:** Unsupported.

**Default**: `true`

##### [contentProtected](#contentprotected)

[Section titled “contentProtected”](#contentprotected)

`boolean`

Prevents the window contents from being captured by other apps.

##### [create](#create)

[Section titled “create”](#create)

`boolean`

Whether Tauri should create this window at app startup or not.

When this is set to `false` you must manually grab the config object via `app.config().app.windows`
and create it with [`WebviewWindowBuilder::from_config`](https://docs.rs/tauri/2/tauri/webview/struct.WebviewWindowBuilder.html#method.from_config).

###### [Example:](#example-11)

[Section titled “Example:”](#example-11)

```
tauri::Builder::default()

.setup(|app| {

tauri::WebviewWindowBuilder::from_config(app.handle(), &app.config().app.windows[0])?.build()?;

Ok(())

});
```

**Default**: `true`

##### [dataDirectory](#datadirectory)

[Section titled “dataDirectory”](#datadirectory)

`string` | `null`

Set a custom path for the webview’s data directory (localStorage, cache, etc.) **relative to [`appDataDir()`]/${label}**.

To set absolute paths, use [`WebviewWindowBuilder::data_directory`](https://docs.rs/tauri/2/tauri/webview/struct.WebviewWindowBuilder.html#method.data_directory)

###### [Platform-specific:](#platform-specific-8)

[Section titled “Platform-specific:”](#platform-specific-8)

* **Windows**: WebViews with different values for settings like `additionalBrowserArgs`, `browserExtensionsEnabled` or `scrollBarStyle` must have different data directories.
* **macOS / iOS**: Unsupported, use `dataStoreIdentifier` instead.
* **Android**: Unsupported.

##### [dataStoreIdentifier](#datastoreidentifier)

[Section titled “dataStoreIdentifier”](#datastoreidentifier)

`integer` formatted as `uint8`[] | `null` maximum of `16` items, minimum of `16` items

Initialize the WebView with a custom data store identifier. This can be seen as a replacement for `dataDirectory` which is unavailable in WKWebView.
See <https://developer.apple.com/documentation/webkit/wkwebsitedatastore/init(foridentifier:)?language=objc>

The array must contain 16 u8 numbers.

###### [Platform-specific:](#platform-specific-9)

[Section titled “Platform-specific:”](#platform-specific-9)

* **iOS**: Supported since version 17.0+.
* **macOS**: Supported since version 14.0+.
* **Windows / Linux / Android**: Unsupported.

##### [decorations](#decorations)

[Section titled “decorations”](#decorations)

`boolean`

Whether the window should have borders and bars.

**Default**: `true`

##### [devtools](#devtools)

[Section titled “devtools”](#devtools)

`boolean` | `null`

Enable web inspector which is usually called browser devtools. Enabled by default.

This API works in **debug** builds, but requires `devtools` feature flag to enable it in **release** builds.

###### [Platform-specific](#platform-specific-10)

[Section titled “Platform-specific”](#platform-specific-10)

* macOS: This will call private functions on **macOS**.
* Android: Open `chrome://inspect/#devices` in Chrome to get the devtools window. Wry’s `WebView` devtools API isn’t supported on Android.
* iOS: Open Safari > Develop > [Your Device Name] > [Your WebView] to get the devtools window.

##### [disableInputAccessoryView](#disableinputaccessoryview)

[Section titled “disableInputAccessoryView”](#disableinputaccessoryview)

`boolean`

Allows disabling the input accessory view on iOS.

The accessory view is the view that appears above the keyboard when a text input element is focused.
It usually displays a view with “Done”, “Next” buttons.

##### [dragDropEnabled](#dragdropenabled)

[Section titled “dragDropEnabled”](#dragdropenabled)

`boolean`

Whether the drag and drop is enabled or not on the webview. By default it is enabled.

Disabling it is required to use HTML5 drag and drop on the frontend on Windows.

**Default**: `true`

##### [focus](#focus)

[Section titled “focus”](#focus)

`boolean`

Whether the window will be initially focused or not.

**Default**: `true`

##### [focusable](#focusable)

[Section titled “focusable”](#focusable)

`boolean`

Whether the window will be focusable or not.

**Default**: `true`

##### [fullscreen](#fullscreen)

[Section titled “fullscreen”](#fullscreen)

`boolean`

Whether the window starts as fullscreen or not.

##### [height](#height-2)

[Section titled “height”](#height-2)

`number` formatted as `double`

The window height in logical pixels.

**Default**: `600`

##### [hiddenTitle](#hiddentitle)

[Section titled “hiddenTitle”](#hiddentitle)

`boolean`

If `true`, sets the window title to be hidden on macOS.

##### [incognito](#incognito)

[Section titled “incognito”](#incognito)

`boolean`

Whether or not the webview should be launched in incognito mode.

###### [Platform-specific:](#platform-specific-11)

[Section titled “Platform-specific:”](#platform-specific-11)

* **Android**: Unsupported.

##### [javascriptDisabled](#javascriptdisabled)

[Section titled “javascriptDisabled”](#javascriptdisabled)

`boolean`

Whether we should disable JavaScript code execution on the webview or not.

##### [label](#label)

[Section titled “label”](#label)

`string`

The window identifier. It must be alphanumeric.

**Default**: `"main"`

##### [maxHeight](#maxheight)

[Section titled “maxHeight”](#maxheight)

`number` | `null` formatted as `double`

The max window height in logical pixels.

##### [maximizable](#maximizable)

[Section titled “maximizable”](#maximizable)

`boolean`

Whether the window’s native maximize button is enabled or not.
If resizable is set to false, this setting is ignored.

###### [Platform-specific](#platform-specific-12)

[Section titled “Platform-specific”](#platform-specific-12)

* **macOS:** Disables the “zoom” button in the window titlebar, which is also used to enter fullscreen mode.
* **Linux / iOS / Android:** Unsupported.

**Default**: `true`

##### [maximized](#maximized)

[Section titled “maximized”](#maximized)

`boolean`

Whether the window is maximized or not.

##### [maxWidth](#maxwidth)

[Section titled “maxWidth”](#maxwidth)

`number` | `null` formatted as `double`

The max window width in logical pixels.

##### [minHeight](#minheight)

[Section titled “minHeight”](#minheight)

`number` | `null` formatted as `double`

The min window height in logical pixels.

##### [minimizable](#minimizable)

[Section titled “minimizable”](#minimizable)

`boolean`

Whether the window’s native minimize button is enabled or not.

###### [Platform-specific](#platform-specific-13)

[Section titled “Platform-specific”](#platform-specific-13)

* **Linux / iOS / Android:** Unsupported.

**Default**: `true`

##### [minWidth](#minwidth)

[Section titled “minWidth”](#minwidth)

`number` | `null` formatted as `double`

The min window width in logical pixels.

##### [parent](#parent)

[Section titled “parent”](#parent)

`string` | `null`

Sets the window associated with this label to be the parent of the window to be created.

###### [Platform-specific](#platform-specific-14)

[Section titled “Platform-specific”](#platform-specific-14)

* **Windows**: This sets the passed parent as an owner window to the window to be created.
  From [MSDN owned windows docs](https://docs.microsoft.com/en-us/windows/win32/winmsg/window-features#owned-windows):
  + An owned window is always above its owner in the z-order.
  + The system automatically destroys an owned window when its owner is destroyed.
  + An owned window is hidden when its owner is minimized.
* **Linux**: This makes the new window transient for parent, see <<https://docs.gtk.org/gtk3/method.Window.set_transient_for.html>>
* **macOS**: This adds the window as a child of parent, see <<https://developer.apple.com/documentation/appkit/nswindow/1419152-addchildwindow?language=objc>>

