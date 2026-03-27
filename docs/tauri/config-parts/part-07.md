# Source: https://tauri.app/reference/config/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# config — Part 7

* sidebarImage
* startMenuFolder
* template

##### [compression](#compression)

[Section titled “compression”](#compression)

[`NsisCompression`](#nsiscompression)

Set the compression algorithm used to compress files in the installer.

See <<https://nsis.sourceforge.io/Reference/SetCompressor>>

**Default**: `"lzma"`

##### [customLanguageFiles](#customlanguagefiles)

[Section titled “customLanguageFiles”](#customlanguagefiles)

| `null`

A key-value pair where the key is the language and the
value is the path to a custom `.nsh` file that holds the translated text for tauri’s custom messages.

See <<https://github.com/tauri-apps/tauri/blob/dev/crates/tauri-bundler/src/bundle/windows/nsis/languages/English.nsh>> for an example `.nsh` file.

**Note**: the key must be a valid NSIS language and it must be added to [`NsisConfig`] languages array,

**Allows additional properties**: `string`

##### [displayLanguageSelector](#displaylanguageselector)

[Section titled “displayLanguageSelector”](#displaylanguageselector)

`boolean`

Whether to display a language selector dialog before the installer and uninstaller windows are rendered or not.
By default the OS language is selected, with a fallback to the first language in the `languages` array.

##### [headerImage](#headerimage)

[Section titled “headerImage”](#headerimage)

`string` | `null`

The path to a bitmap file to display on the header of installers pages.

The recommended dimensions are 150px x 57px.

##### [installerHooks](#installerhooks)

[Section titled “installerHooks”](#installerhooks)

`string` | `null`

A path to a `.nsh` file that contains special NSIS macros to be hooked into the
main installer.nsi script.

Supported hooks are:

* `NSIS_HOOK_PREINSTALL`: This hook runs before copying files, setting registry key values and creating shortcuts.
* `NSIS_HOOK_POSTINSTALL`: This hook runs after the installer has finished copying all files, setting the registry keys and created shortcuts.
* `NSIS_HOOK_PREUNINSTALL`: This hook runs before removing any files, registry keys and shortcuts.
* `NSIS_HOOK_POSTUNINSTALL`: This hook runs after files, registry keys and shortcuts have been removed.

###### [Example](#example-9)

[Section titled “Example”](#example-9)

```
!macro NSIS_HOOK_PREINSTALL

MessageBox MB_OK "PreInstall"

!macroend

!macro NSIS_HOOK_POSTINSTALL

MessageBox MB_OK "PostInstall"

!macroend

!macro NSIS_HOOK_PREUNINSTALL

MessageBox MB_OK "PreUnInstall"

!macroend

!macro NSIS_HOOK_POSTUNINSTALL

MessageBox MB_OK "PostUninstall"

!macroend
```

##### [installerIcon](#installericon)

[Section titled “installerIcon”](#installericon)

`string` | `null`

The path to an icon file used as the installer icon.

##### [installMode](#installmode)

[Section titled “installMode”](#installmode)

[`NSISInstallerMode`](#nsisinstallermode)

Whether the installation will be for all users or just the current user.

**Default**: `"currentUser"`

##### [languages](#languages)

[Section titled “languages”](#languages)

`string`[] | `null`

A list of installer languages.
By default the OS language is used. If the OS language is not in the list of languages, the first language will be used.
To allow the user to select the language, set `display_language_selector` to `true`.

See <<https://github.com/kichik/nsis/tree/9465c08046f00ccb6eda985abbdbf52c275c6c4d/Contrib/Language%20files>> for the complete list of languages.

##### [minimumWebview2Version](#minimumwebview2version)

[Section titled “minimumWebview2Version”](#minimumwebview2version)

`string` | `null`

Try to ensure that the WebView2 version is equal to or newer than this version,
if the user’s WebView2 is older than this version,
the installer will try to trigger a WebView2 update.

##### [sidebarImage](#sidebarimage)

[Section titled “sidebarImage”](#sidebarimage)

`string` | `null`

The path to a bitmap file for the Welcome page and the Finish page.

The recommended dimensions are 164px x 314px.

##### [startMenuFolder](#startmenufolder)

[Section titled “startMenuFolder”](#startmenufolder)

`string` | `null`

Set the folder name for the start menu shortcut.

Use this option if you have multiple apps and wish to group their shortcuts under one folder
or if you generally prefer to set your shortcut inside a folder.

Examples:

* `AwesomePublisher`, shortcut will be placed in `%AppData%\Microsoft\Windows\Start Menu\Programs\AwesomePublisher\&lt;your-app&gt;.lnk`
* If unset, shortcut will be placed in `%AppData%\Microsoft\Windows\Start Menu\Programs\&lt;your-app&gt;.lnk`

##### [template](#template-1)

[Section titled “template”](#template-1)

`string` | `null`

A custom .nsi template to use.

### [NSISInstallerMode](#nsisinstallermode)

[Section titled “NSISInstallerMode”](#nsisinstallermode)

**One of the following**:

* `"currentUser"` Default mode for the installer. Install the app by default in a directory that doesn’t require Administrator access. Installer metadata will be saved under the `HKCU` registry path.
* `"perMachine"` Install the app by default in the `Program Files` folder directory requires Administrator access for the installation. Installer metadata will be saved under the `HKLM` registry path.
* `"both"` Combines both modes and allows the user to choose at install time whether to install for the current user or per machine. Note that this mode will require Administrator access even if the user wants to install it for the current user only. Installer metadata will be saved under the `HKLM` or `HKCU` registry path based on the user’s choice.

Install Modes for the NSIS installer.

### [Number](#number)

[Section titled “Number”](#number)

**Any of the following**:

* `integer` formatted as `int64` Represents an [`i64`].
* `number` formatted as `double` Represents a [`f64`].

A valid ACL number.

### [PatternKind](#patternkind)

[Section titled “PatternKind”](#patternkind)

**One of the following**:

* Brownfield pattern. **Object Properties**: - use (required) ##### use `"brownfield"`
* Isolation pattern. Recommended for security purposes. **Object Properties**: - options (required) - use (required) ##### options **Object Properties**: - dir (required) ###### dir `string` The dir containing the index.html file that contains the secure isolation application. ##### use `"isolation"`

The application pattern.

### [PermissionEntry](#permissionentry)

[Section titled “PermissionEntry”](#permissionentry)

**Any of the following**:

* [`Identifier`](#identifier) Reference a permission or permission set by identifier.
* Reference a permission or permission set by identifier and extends its scope. **Object Properties**: - allow - deny - identifier (required) ##### allow [`Value`](#value)[] | `null` Data that defines what is allowed by the scope. ##### deny [`Value`](#value)[] | `null` Data that defines what is denied by the scope. This should be prioritized by validation logic. ##### identifier [`Identifier`](#identifier) Identifier of the permission or permission set.

An entry for a permission value in a [`Capability`] can be either a raw permission [`Identifier`]
or an object that references a permission and extends its scope.

### [PluginConfig](#pluginconfig)

[Section titled “PluginConfig”](#pluginconfig)

The plugin configs holds a HashMap mapping a plugin name to its configuration object.

See more: <<https://v2.tauri.app/reference/config/#pluginconfig>>

**Allows additional properties**: `true`

### [Position](#position)

[Section titled “Position”](#position)

Position coordinates struct.

**Object Properties**:

* x (required)
* y (required)

##### [x](#x-1)

[Section titled “x”](#x-1)

`integer` formatted as `uint32`

X coordinate.

##### [y](#y-1)

[Section titled “y”](#y-1)

`integer` formatted as `uint32`

Y coordinate.

### [PreventOverflowConfig](#preventoverflowconfig)

[Section titled “PreventOverflowConfig”](#preventoverflowconfig)

**Any of the following**:

* `boolean` Enable prevent overflow or not
* [`PreventOverflowMargin`](#preventoverflowmargin) Enable prevent overflow with a margin so that the window’s size + this margin won’t overflow the workarea

Prevent overflow with a margin

### [PreventOverflowMargin](#preventoverflowmargin)

[Section titled “PreventOverflowMargin”](#preventoverflowmargin)

Enable prevent overflow with a margin
so that the window’s size + this margin won’t overflow the workarea

**Object Properties**:

* height (required)
* width (required)

##### [height](#height)

[Section titled “height”](#height)

`integer` formatted as `uint32`

Vertical margin in physical pixels

##### [width](#width)

[Section titled “width”](#width)

`integer` formatted as `uint32`

Horizontal margin in physical pixels

### [RpmCompression](#rpmcompression)

[Section titled “RpmCompression”](#rpmcompression)

**One of the following**:

* Gzip compression **Object Properties**: - level (required) - type (required) ##### level `integer` formatted as `uint32` Gzip compression level ##### type `"gzip"`
* Zstd compression **Object Properties**: - level (required) - type (required) ##### level `integer` formatted as `int32` Zstd compression level ##### type `"zstd"`
* Xz compression **Object Properties**: - level (required) - type (required) ##### level `integer` formatted as `uint32` Xz compression level ##### type `"xz"`
* Bzip2 compression **Object Properties**: - level (required) - type (required) ##### level `integer` formatted as `uint32` Bzip2 compression level ##### type `"bzip2"`
* Disable compression **Object Properties**: - type (required) ##### type `"none"`

Compression algorithms used when bundling RPM packages.

### [RpmConfig](#rpmconfig)

[Section titled “RpmConfig”](#rpmconfig)

Configuration for RPM bundles.

**Object Properties**:

* compression
* conflicts
* depends
* desktopTemplate
* epoch
* files
* obsoletes
* postInstallScript
* postRemoveScript
* preInstallScript
* preRemoveScript
* provides
* recommends
* release

##### [compression](#compression-1)

[Section titled “compression”](#compression-1)

[`RpmCompression`](#rpmcompression) | `null`

Compression algorithm and level. Defaults to `Gzip` with level 6.

##### [conflicts](#conflicts-1)

[Section titled “conflicts”](#conflicts-1)

`string`[] | `null`

The list of RPM dependencies your application conflicts with. They must not be present
in order for the package to be installed.

##### [depends](#depends-1)

[Section titled “depends”](#depends-1)

`string`[] | `null`

The list of RPM dependencies your application relies on.

##### [desktopTemplate](#desktoptemplate-1)

[Section titled “desktopTemplate”](#desktoptemplate-1)

`string` | `null`

Path to a custom desktop file Handlebars template.

Available variables: `categories`, `comment` (optional), `exec`, `icon` and `name`.

##### [epoch](#epoch)

[Section titled “epoch”](#epoch)

`integer` formatted as `uint32`

The RPM epoch.

##### [files](#files-3)

[Section titled “files”](#files-3)

The files to include on the package.

**Allows additional properties**: `string`

**Default**: `{}`

##### [obsoletes](#obsoletes)

[Section titled “obsoletes”](#obsoletes)

`string`[] | `null`

The list of RPM dependencies your application supersedes - if this package is installed,
packages listed as “obsoletes” will be automatically removed (if they are present).

##### [postInstallScript](#postinstallscript-1)

[Section titled “postInstallScript”](#postinstallscript-1)

`string` | `null`

Path to script that will be executed after the package is unpacked. See
<<http://ftp.rpm.org/max-rpm/s1-rpm-inside-scripts.html>>

##### [postRemoveScript](#postremovescript-1)

[Section titled “postRemoveScript”](#postremovescript-1)

`string` | `null`

Path to script that will be executed after the package is removed. See
<<http://ftp.rpm.org/max-rpm/s1-rpm-inside-scripts.html>>

##### [preInstallScript](#preinstallscript-1)

[Section titled “preInstallScript”](#preinstallscript-1)

`string` | `null`

Path to script that will be executed before the package is unpacked. See
<<http://ftp.rpm.org/max-rpm/s1-rpm-inside-scripts.html>>

##### [preRemoveScript](#preremovescript-1)

[Section titled “preRemoveScript”](#preremovescript-1)

`string` | `null`

Path to script that will be executed before the package is removed. See
<<http://ftp.rpm.org/max-rpm/s1-rpm-inside-scripts.html>>

##### [provides](#provides-1)

[Section titled “provides”](#provides-1)

`string`[] | `null`

The list of RPM dependencies your application provides.

##### [recommends](#recommends-1)

[Section titled “recommends”](#recommends-1)

`string`[] | `null`

The list of RPM dependencies your application recommends.

##### [release](#release)

[Section titled “release”](#release)

`string`

The RPM release tag.
