# Source: https://tauri.app/reference/config/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# config — Part 4

},

],

"platforms": ["macOS","windows"]

}
```

**Object Properties**:

* description
* identifier (required)
* local
* permissions (required)
* platforms
* remote
* webviews
* windows

##### [description](#description)

[Section titled “description”](#description)

`string`

Description of what the capability is intended to allow on associated windows.

It should contain a description of what the grouped permissions should allow.

###### [Example](#example-2)

[Section titled “Example”](#example-2)

This capability allows the `main` window access to `filesystem` write related
commands and `dialog` commands to enable programmatic access to files selected by the user.

##### [identifier](#identifier-1)

[Section titled “identifier”](#identifier-1)

`string`

Identifier of the capability.

###### [Example](#example-3)

[Section titled “Example”](#example-3)

`main-user-files-write`

##### [local](#local)

[Section titled “local”](#local)

`boolean`

Whether this capability is enabled for local app URLs or not. Defaults to `true`.

**Default**: `true`

##### [permissions](#permissions)

[Section titled “permissions”](#permissions)

[`PermissionEntry`](#permissionentry)[] each item must be unique

List of permissions attached to this capability.

Must include the plugin name as prefix in the form of `${plugin-name}:${permission-name}`.
For commands directly implemented in the application itself only `${permission-name}`
is required.

###### [Example](#example-4)

[Section titled “Example”](#example-4)

```
[

"core:default",

"shell:allow-open",

"dialog:open",

{

"identifier": "fs:allow-write-text-file",

"allow": [{ "path": "$HOME/test.txt" }]

}

]
```

##### [platforms](#platforms)

[Section titled “platforms”](#platforms)

[`Target`](#target)[] | `null`

Limit which target platforms this capability applies to.

By default all platforms are targeted.

###### [Example](#example-5)

[Section titled “Example”](#example-5)

`["macOS","windows"]`

##### [remote](#remote)

[Section titled “remote”](#remote)

[`CapabilityRemote`](#capabilityremote) | `null`

Configure remote URLs that can use the capability permissions.

This setting is optional and defaults to not being set, as our
default use case is that the content is served from our local application.

###### [Example](#example-6)

[Section titled “Example”](#example-6)

```
{

"urls": ["https://*.mydomain.dev"]

}
```

##### [webviews](#webviews)

[Section titled “webviews”](#webviews)

`string`[]

List of webviews that are affected by this capability. Can be a glob pattern.

The capability will be enabled on all the webviews
whose label matches any of the patterns in this list,
regardless of whether the webview’s window label matches a pattern in [`Self::windows`].

###### [Example](#example-7)

[Section titled “Example”](#example-7)

`["sub-webview-one", "sub-webview-two"]`

##### [windows](#windows-2)

[Section titled “windows”](#windows-2)

`string`[]

List of windows that are affected by this capability. Can be a glob pattern.

If a window label matches any of the patterns in this list,
the capability will be enabled on all the webviews of that window,
regardless of the value of [`Self::webviews`].

On multiwebview windows, prefer specifying [`Self::webviews`] and omitting [`Self::windows`]
for a fine grained access control.

###### [Example](#example-8)

[Section titled “Example”](#example-8)

`["main"]`

### [CapabilityEntry](#capabilityentry)

[Section titled “CapabilityEntry”](#capabilityentry)

**Any of the following**:

* [`Capability`](#capability) An inlined capability.
* `string` Reference to a capability identifier.

A capability entry which can be either an inlined capability or a reference to a capability defined on its own file.

### [CapabilityRemote](#capabilityremote)

[Section titled “CapabilityRemote”](#capabilityremote)

Configuration for remote URLs that are associated with the capability.

**Object Properties**:

* urls (required)

##### [urls](#urls)

[Section titled “urls”](#urls)

`string`[]

Remote domains this capability refers to using the [URLPattern standard](https://urlpattern.spec.whatwg.org/).

###### [Examples](#examples-1)

[Section titled “Examples”](#examples-1)

* “https://\*.mydomain.dev”: allows subdomains of mydomain.dev
* “<https://mydomain.dev/api/>\*”: allows any subpath of mydomain.dev/api

### [Color](#color)

[Section titled “Color”](#color)

**Any of the following**:

* `string` pattern of `^#?([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$` Color hex string, for example: #fff, #ffffff, or #ffffffff.
* `integer` formatted as `uint8` | `integer` formatted as `uint8` | `integer` formatted as `uint8`[] maximum of `3` items, minimum of `3` items Array of RGB colors. Each value has minimum of 0 and maximum of 255.
* `integer` formatted as `uint8` | `integer` formatted as `uint8` | `integer` formatted as `uint8` | `integer` formatted as `uint8`[] maximum of `4` items, minimum of `4` items Array of RGBA colors. Each value has minimum of 0 and maximum of 255.
* Object of red, green, blue, alpha color values. Each value has minimum of 0 and maximum of 255. **Object Properties**: - alpha - blue (required) - green (required) - red (required) ##### alpha `integer` formatted as `uint8` **Default**: `255` ##### blue `integer` formatted as `uint8` ##### green `integer` formatted as `uint8` ##### red `integer` formatted as `uint8`

### [Csp](#csp)

[Section titled “Csp”](#csp)

**Any of the following**:

* `string` The entire CSP policy in a single text string.
* An object mapping a directive with its sources values as a list of strings. **Allows additional properties**: [`CspDirectiveSources`](#cspdirectivesources)

A Content-Security-Policy definition.
See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP>>.

### [CspDirectiveSources](#cspdirectivesources)

[Section titled “CspDirectiveSources”](#cspdirectivesources)

**Any of the following**:

* `string` An inline list of CSP sources. Same as [`Self::List`], but concatenated with a space separator.
* `string`[] A list of CSP sources. The collection will be concatenated with a space separator for the CSP string.

A Content-Security-Policy directive source list.
See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#sources>>.

### [CustomSignCommandConfig](#customsigncommandconfig)

[Section titled “CustomSignCommandConfig”](#customsigncommandconfig)

**Any of the following**:

* `string` A string notation of the script to execute. “%1” will be replaced with the path to the binary to be signed. This is a simpler notation for the command. Tauri will split the string with `' '` and use the first element as the command name and the rest as arguments. If you need to use whitespace in the command or arguments, use the object notation [`Self::CommandWithOptions`].
* An object notation of the command. This is more complex notation for the command but this allows you to use whitespace in the command and arguments. **Object Properties**: - args (required) - cmd (required) ##### args `string`[] The arguments to pass to the command. “%1” will be replaced with the path to the binary to be signed. ##### cmd `string` The command to run to sign the binary.

Custom Signing Command configuration.

### [DebConfig](#debconfig)

[Section titled “DebConfig”](#debconfig)

Configuration for Debian (.deb) bundles.

See more: <<https://v2.tauri.app/reference/config/#debconfig>>

**Object Properties**:

* changelog
* conflicts
* depends
* desktopTemplate
* files
* postInstallScript
* postRemoveScript
* preInstallScript
* preRemoveScript
* priority
* provides
* recommends
* replaces
* section

##### [changelog](#changelog)

[Section titled “changelog”](#changelog)

`string` | `null`

Path of the uncompressed Changelog file, to be stored at /usr/share/doc/package-name/changelog.gz. See
<<https://www.debian.org/doc/debian-policy/ch-docs.html#changelog-files-and-release-notes>>

##### [conflicts](#conflicts)

[Section titled “conflicts”](#conflicts)

`string`[] | `null`

The list of package conflicts.

##### [depends](#depends)

[Section titled “depends”](#depends)

`string`[] | `null`

The list of deb dependencies your application relies on.

##### [desktopTemplate](#desktoptemplate)

[Section titled “desktopTemplate”](#desktoptemplate)

`string` | `null`

Path to a custom desktop file Handlebars template.

Available variables: `categories`, `comment` (optional), `exec`, `icon` and `name`.

##### [files](#files-1)

[Section titled “files”](#files-1)

The files to include on the package.

**Allows additional properties**: `string`

**Default**: `{}`

##### [postInstallScript](#postinstallscript)

[Section titled “postInstallScript”](#postinstallscript)

`string` | `null`

Path to script that will be executed after the package is unpacked. See
<<https://www.debian.org/doc/debian-policy/ch-maintainerscripts.html>>

##### [postRemoveScript](#postremovescript)

[Section titled “postRemoveScript”](#postremovescript)

`string` | `null`

Path to script that will be executed after the package is removed. See
<<https://www.debian.org/doc/debian-policy/ch-maintainerscripts.html>>

##### [preInstallScript](#preinstallscript)

[Section titled “preInstallScript”](#preinstallscript)

`string` | `null`

Path to script that will be executed before the package is unpacked. See
<<https://www.debian.org/doc/debian-policy/ch-maintainerscripts.html>>

##### [preRemoveScript](#preremovescript)

[Section titled “preRemoveScript”](#preremovescript)

`string` | `null`

Path to script that will be executed before the package is removed. See
<<https://www.debian.org/doc/debian-policy/ch-maintainerscripts.html>>

##### [priority](#priority)

[Section titled “priority”](#priority)

`string` | `null`

Change the priority of the Debian Package. By default, it is set to `optional`.
Recognized Priorities as of now are : `required`, `important`, `standard`, `optional`, `extra`

##### [provides](#provides)

[Section titled “provides”](#provides)

`string`[] | `null`

The list of dependencies the package provides.

##### [recommends](#recommends)

[Section titled “recommends”](#recommends)

`string`[] | `null`

The list of deb dependencies your application recommends.

##### [replaces](#replaces)

[Section titled “replaces”](#replaces)

`string`[] | `null`

The list of package replaces.

##### [section](#section)

[Section titled “section”](#section)

`string` | `null`

Define the section in Debian Control file. See : <https://www.debian.org/doc/debian-policy/ch-archive.html#s-subsections>

### [DisabledCspModificationKind](#disabledcspmodificationkind)

[Section titled “DisabledCspModificationKind”](#disabledcspmodificationkind)

**Any of the following**:

* `boolean` If `true`, disables all CSP modification. `false` is the default value and it configures Tauri to control the CSP.
* `string`[] Disables the given list of CSP directives modifications.

The possible values for the `dangerous_disable_asset_csp_modification` config option.

### [DmgConfig](#dmgconfig)

[Section titled “DmgConfig”](#dmgconfig)

Configuration for Apple Disk Image (.dmg) bundles.

See more: <<https://v2.tauri.app/reference/config/#dmgconfig>>

**Object Properties**:

* applicationFolderPosition
* appPosition
* background
* windowPosition
* windowSize

##### [applicationFolderPosition](#applicationfolderposition)

[Section titled “applicationFolderPosition”](#applicationfolderposition)

[`Position`](#position)

Position of application folder on window.

Default

```
{

"x": 480,

"y": 170

}
```
