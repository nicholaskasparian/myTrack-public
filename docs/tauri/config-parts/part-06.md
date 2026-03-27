# Source: https://tauri.app/reference/config/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# config — Part 6


##### [Tauri-Custom-Header](#tauri-custom-header)

[Section titled “Tauri-Custom-Header”](#tauri-custom-header)

[`HeaderSource`](#headersource) | `null`

A custom header field Tauri-Custom-Header, don’t use it.
Remember to set Access-Control-Expose-Headers accordingly

**NOT INTENDED FOR PRODUCTION USE**

##### [Timing-Allow-Origin](#timing-allow-origin)

[Section titled “Timing-Allow-Origin”](#timing-allow-origin)

[`HeaderSource`](#headersource) | `null`

The Timing-Allow-Origin response header specifies origins that are allowed to see values
of attributes retrieved via features of the Resource Timing API, which would otherwise be
reported as zero due to cross-origin restrictions.

See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Timing-Allow-Origin>>

##### [X-Content-Type-Options](#x-content-type-options)

[Section titled “X-Content-Type-Options”](#x-content-type-options)

[`HeaderSource`](#headersource) | `null`

The X-Content-Type-Options response HTTP header is a marker used by the server to indicate
that the MIME types advertised in the Content-Type headers should be followed and not be
changed. The header allows you to avoid MIME type sniffing by saying that the MIME types
are deliberately configured.

See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options>>

### [HeaderSource](#headersource)

[Section titled “HeaderSource”](#headersource)

**Any of the following**:

* `string` string version of the header Value
* `string`[] list version of the header value. Item are joined by ”,” for the real header value
* (Rust struct | Json | JavaScript Object) equivalent of the header value. Items are composed from: key + space + value. Item are then joined by ”;” for the real header value **Allows additional properties**: `string`

definition of a header source

The header value to a header name

### [HookCommand](#hookcommand)

[Section titled “HookCommand”](#hookcommand)

**Any of the following**:

* `string` Run the given script with the default options.
* Run the given script with custom options. **Object Properties**: - cwd - script (required) ##### cwd `string` | `null` The current working directory. ##### script `string` The script to execute.

Describes a shell command to be executed when a CLI hook is triggered.

### [Identifier](#identifier-3)

[Section titled “Identifier”](#identifier-3)

`string`

### [IosConfig](#iosconfig)

[Section titled “IosConfig”](#iosconfig)

General configuration for the iOS target.

**Object Properties**:

* bundleVersion
* developmentTeam
* frameworks
* infoPlist
* minimumSystemVersion
* template

##### [bundleVersion](#bundleversion)

[Section titled “bundleVersion”](#bundleversion)

`string` | `null`

The version of the build that identifies an iteration of the bundle.

Translates to the bundle’s CFBundleVersion property.

##### [developmentTeam](#developmentteam)

[Section titled “developmentTeam”](#developmentteam)

`string` | `null`

The development team. This value is required for iOS development because code signing is enforced.
The `APPLE_DEVELOPMENT_TEAM` environment variable can be set to overwrite it.

##### [frameworks](#frameworks)

[Section titled “frameworks”](#frameworks)

`string`[] | `null`

A list of strings indicating any iOS frameworks that need to be bundled with the application.

Note that you need to recreate the iOS project for the changes to be applied.

##### [infoPlist](#infoplist)

[Section titled “infoPlist”](#infoplist)

`string` | `null`

Path to a Info.plist file to merge with the default Info.plist.

Note that Tauri also looks for a `Info.plist` and `Info.ios.plist` file in the same directory as the Tauri configuration file.

##### [minimumSystemVersion](#minimumsystemversion)

[Section titled “minimumSystemVersion”](#minimumsystemversion)

`string`

A version string indicating the minimum iOS version that the bundled application supports. Defaults to `13.0`.

Maps to the IPHONEOS\_DEPLOYMENT\_TARGET value.

**Default**: `"14.0"`

##### [template](#template)

[Section titled “template”](#template)

`string` | `null`

A custom [XcodeGen](%3Chttps://github.com/yonaskolb/XcodeGen%3E) project.yml template to use.

### [LinuxConfig](#linuxconfig)

[Section titled “LinuxConfig”](#linuxconfig)

Configuration for Linux bundles.

See more: <<https://v2.tauri.app/reference/config/#linuxconfig>>

**Object Properties**:

* appimage
* deb
* rpm

##### [appimage](#appimage)

[Section titled “appimage”](#appimage)

[`AppImageConfig`](#appimageconfig)

Configuration for the AppImage bundle.

Default

```
{

"bundleMediaFramework": false,

"files": {}

}
```

##### [deb](#deb)

[Section titled “deb”](#deb)

[`DebConfig`](#debconfig)

Configuration for the Debian bundle.

Default

```
{

"files": {}

}
```

##### [rpm](#rpm)

[Section titled “rpm”](#rpm)

[`RpmConfig`](#rpmconfig)

Configuration for the RPM bundle.

Default

```
{

"epoch": 0,

"files": {},

"release": "1"

}
```

### [LogicalPosition](#logicalposition)

[Section titled “LogicalPosition”](#logicalposition)

Position coordinates struct.

**Object Properties**:

* x (required)
* y (required)

##### [x](#x)

[Section titled “x”](#x)

`number` formatted as `double`

X coordinate.

##### [y](#y)

[Section titled “y”](#y)

`number` formatted as `double`

Y coordinate.

### [MacConfig](#macconfig)

[Section titled “MacConfig”](#macconfig)

Configuration for the macOS bundles.

See more: <<https://v2.tauri.app/reference/config/#macconfig>>

**Object Properties**:

* bundleName
* bundleVersion
* dmg
* entitlements
* exceptionDomain
* files
* frameworks
* hardenedRuntime
* infoPlist
* minimumSystemVersion
* providerShortName
* signingIdentity

##### [bundleName](#bundlename)

[Section titled “bundleName”](#bundlename)

`string` | `null`

The name of the builder that built the bundle.

Translates to the bundle’s CFBundleName property.

If not set, defaults to the package’s product name.

##### [bundleVersion](#bundleversion-1)

[Section titled “bundleVersion”](#bundleversion-1)

`string` | `null`

The version of the build that identifies an iteration of the bundle.

Translates to the bundle’s CFBundleVersion property.

##### [dmg](#dmg)

[Section titled “dmg”](#dmg)

[`DmgConfig`](#dmgconfig)

DMG-specific settings.

Default

```
{

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

}
```

##### [entitlements](#entitlements)

[Section titled “entitlements”](#entitlements)

`string` | `null`

Path to the entitlements file.

##### [exceptionDomain](#exceptiondomain)

[Section titled “exceptionDomain”](#exceptiondomain)

`string` | `null`

Allows your application to communicate with the outside world.
It should be a lowercase, without port and protocol domain name.

##### [files](#files-2)

[Section titled “files”](#files-2)

The files to include in the application relative to the Contents directory.

**Allows additional properties**: `string`

**Default**: `{}`

##### [frameworks](#frameworks-1)

[Section titled “frameworks”](#frameworks-1)

`string`[] | `null`

A list of strings indicating any macOS X frameworks that need to be bundled with the application.

If a name is used, “.framework” must be omitted and it will look for standard install locations. You may also use a path to a specific framework.

##### [hardenedRuntime](#hardenedruntime)

[Section titled “hardenedRuntime”](#hardenedruntime)

`boolean`

Whether the codesign should enable [hardened runtime](https://developer.apple.com/documentation/security/hardened_runtime) (for executables) or not.

**Default**: `true`

##### [infoPlist](#infoplist-1)

[Section titled “infoPlist”](#infoplist-1)

`string` | `null`

Path to a Info.plist file to merge with the default Info.plist.

Note that Tauri also looks for a `Info.plist` file in the same directory as the Tauri configuration file.

##### [minimumSystemVersion](#minimumsystemversion-1)

[Section titled “minimumSystemVersion”](#minimumsystemversion-1)

`string` | `null`

A version string indicating the minimum macOS X version that the bundled application supports. Defaults to `10.13`.

Setting it to `null` completely removes the `LSMinimumSystemVersion` field on the bundle’s `Info.plist`
and the `MACOSX_DEPLOYMENT_TARGET` environment variable.

Ignored in `tauri dev`.

An empty string is considered an invalid value so the default value is used.

**Default**: `"10.13"`

##### [providerShortName](#providershortname)

[Section titled “providerShortName”](#providershortname)

`string` | `null`

Provider short name for notarization.

##### [signingIdentity](#signingidentity)

[Section titled “signingIdentity”](#signingidentity)

`string` | `null`

Identity to use for code signing.

### [NsisCompression](#nsiscompression)

[Section titled “NsisCompression”](#nsiscompression)

**One of the following**:

* `"zlib"` ZLIB uses the deflate algorithm, it is a quick and simple method. With the default compression level it uses about 300 KB of memory.
* `"bzip2"` BZIP2 usually gives better compression ratios than ZLIB, but it is a bit slower and uses more memory. With the default compression level it uses about 4 MB of memory.
* `"lzma"` LZMA (default) is a new compression method that gives very good compression ratios. The decompression speed is high (10-20 MB/s on a 2 GHz CPU), the compression speed is lower. The memory size that will be used for decompression is the dictionary size plus a few KBs, the default is 8 MB.
* `"none"` Disable compression

Compression algorithms used in the NSIS installer.

See <<https://nsis.sourceforge.io/Reference/SetCompressor>>

### [NsisConfig](#nsisconfig)

[Section titled “NsisConfig”](#nsisconfig)

Configuration for the Installer bundle using NSIS.

**Object Properties**:

* compression
* customLanguageFiles
* displayLanguageSelector
* headerImage
* installerHooks
* installerIcon
* installMode
* languages
* minimumWebview2Version
