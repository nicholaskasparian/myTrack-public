# Source: https://tauri.app/reference/config/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# config — Part 5


##### [appPosition](#appposition)

[Section titled “appPosition”](#appposition)

[`Position`](#position)

Position of app file on window.

Default

```
{

"x": 180,

"y": 170

}
```

##### [background](#background)

[Section titled “background”](#background)

`string` | `null`

Image to use as the background in dmg file. Accepted formats: `png`/`jpg`/`gif`.

##### [windowPosition](#windowposition)

[Section titled “windowPosition”](#windowposition)

[`Position`](#position) | `null`

Position of volume window on screen.

##### [windowSize](#windowsize)

[Section titled “windowSize”](#windowsize)

[`Size`](#size)

Size of volume window.

Default

```
{

"height": 400,

"width": 660

}
```

### [ExportedFileAssociation](#exportedfileassociation)

[Section titled “ExportedFileAssociation”](#exportedfileassociation)

The exported type definition. Maps to a `UTExportedTypeDeclarations` entry on macOS.

**Object Properties**:

* conformsTo
* identifier (required)

##### [conformsTo](#conformsto)

[Section titled “conformsTo”](#conformsto)

`string`[] | `null`

The types that this type conforms to. Maps to `UTTypeConformsTo`.

Examples are `public.data`, `public.image`, `public.json` and `public.database`.

##### [identifier](#identifier-2)

[Section titled “identifier”](#identifier-2)

`string`

The unique identifier for the exported type. Maps to `UTTypeIdentifier`.

### [FileAssociation](#fileassociation)

[Section titled “FileAssociation”](#fileassociation)

File association

**Object Properties**:

* contentTypes
* description
* exportedType
* ext (required)
* mimeType
* name
* rank
* role

##### [contentTypes](#contenttypes)

[Section titled “contentTypes”](#contenttypes)

`string`[] | `null`

Declare support to a file with the given content type. Maps to `LSItemContentTypes` on macOS.

This allows supporting any file format declared by another application that conforms to this type.
Declaration of new types can be done with [`Self::exported_type`] and linking to certain content types are done via [`ExportedFileAssociation::conforms_to`].

##### [description](#description-1)

[Section titled “description”](#description-1)

`string` | `null`

The association description. Windows-only. It is displayed on the `Type` column on Windows Explorer.

##### [exportedType](#exportedtype)

[Section titled “exportedType”](#exportedtype)

[`ExportedFileAssociation`](#exportedfileassociation) | `null`

The exported type definition. Maps to a `UTExportedTypeDeclarations` entry on macOS.

You should define this if the associated file is a custom file type defined by your application.

##### [ext](#ext)

[Section titled “ext”](#ext)

[`AssociationExt`](#associationext)[]

File extensions to associate with this app. e.g. ‘png’

##### [mimeType](#mimetype)

[Section titled “mimeType”](#mimetype)

`string` | `null`

The mime-type e.g. ‘image/png’ or ‘text/plain’. Linux-only.

##### [name](#name)

[Section titled “name”](#name)

`string` | `null`

The name. Maps to `CFBundleTypeName` on macOS. Default to `ext[0]`

##### [rank](#rank)

[Section titled “rank”](#rank)

[`HandlerRank`](#handlerrank)

The ranking of this app among apps that declare themselves as editors or viewers of the given file type. Maps to `LSHandlerRank` on macOS.

**Default**: `"Default"`

##### [role](#role)

[Section titled “role”](#role)

[`BundleTypeRole`](#bundletyperole)

The app’s role with respect to the type. Maps to `CFBundleTypeRole` on macOS.

**Default**: `"Editor"`

### [FrontendDist](#frontenddist-1)

[Section titled “FrontendDist”](#frontenddist-1)

**Any of the following**:

* `string` formatted as `uri` An external URL that should be used as the default application URL. No assets are embedded in the app in this case.
* `string` Path to a directory containing the frontend dist assets.
* `string`[] An array of files to embed in the app.

Defines the URL or assets to embed in the application.

### [FsScope](#fsscope)

[Section titled “FsScope”](#fsscope)

**Any of the following**:

* `string`[] A list of paths that are allowed by this scope.
* A complete scope configuration. **Object Properties**: - allow - deny - requireLiteralLeadingDot ##### allow `string`[] A list of paths that are allowed by this scope. **Default**: `[]` ##### deny `string`[] A list of paths that are not allowed by this scope. This gets precedence over the [`Self::Scope::allow`] list. **Default**: `[]` ##### requireLiteralLeadingDot `boolean` | `null` Whether or not paths that contain components that start with a `.` will require that `.` appears literally in the pattern; `*`, `?`, `**`, or `[...]` will not match. This is useful because such files are conventionally considered hidden on Unix systems and it might be desirable to skip them when listing files. Defaults to `true` on Unix systems and `false` on Windows

Protocol scope definition.
It is a list of glob patterns that restrict the API access from the webview.

Each pattern can start with a variable that resolves to a system base directory.
The variables are: `$AUDIO`, `$CACHE`, `$CONFIG`, `$DATA`, `$LOCALDATA`, `$DESKTOP`,
`$DOCUMENT`, `$DOWNLOAD`, `$EXE`, `$FONT`, `$HOME`, `$PICTURE`, `$PUBLIC`, `$RUNTIME`,
`$TEMPLATE`, `$VIDEO`, `$RESOURCE`, `$TEMP`,
`$APPCONFIG`, `$APPDATA`, `$APPLOCALDATA`, `$APPCACHE`, `$APPLOG`.

### [HandlerRank](#handlerrank)

[Section titled “HandlerRank”](#handlerrank)

**One of the following**:

* `"Default"` LSHandlerRank.Default. This app is an opener of files of this type; this value is also used if no rank is specified.
* `"Owner"` LSHandlerRank.Owner. This app is the primary creator of files of this type.
* `"Alternate"` LSHandlerRank.Alternate. This app is a secondary viewer of files of this type.
* `"None"` LSHandlerRank.None. This app is never selected to open files of this type, but it accepts drops of files of this type.

Corresponds to LSHandlerRank

### [HeaderConfig](#headerconfig)

[Section titled “HeaderConfig”](#headerconfig)

A struct, where the keys are some specific http header names.

If the values to those keys are defined, then they will be send as part of a response message.
This does not include error messages and ipc messages

##### [Example configuration](#example-configuration)

[Section titled “Example configuration”](#example-configuration)

```
{

//..

app:{

//..

security: {

headers: {

"Cross-Origin-Opener-Policy": "same-origin",

"Cross-Origin-Embedder-Policy": "require-corp",

"Timing-Allow-Origin": [

"https://developer.mozilla.org",

"https://example.com",

],

"Access-Control-Expose-Headers": "Tauri-Custom-Header",

"Tauri-Custom-Header": {

"key1": "'value1' 'value2'",

"key2": "'value3'"

}

},

csp: "default-src 'self'; connect-src ipc: http://ipc.localhost",

}

//..

}

//..

}
```

In this example `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` are set to allow for the use of [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer).
The result is, that those headers are then set on every response sent via the `get_response` function in crates/tauri/src/protocol/tauri.rs.
The Content-Security-Policy header is defined separately, because it is also handled separately.

For the helloworld example, this config translates into those response headers:

```
access-control-allow-origin:  http://tauri.localhost

access-control-expose-headers: Tauri-Custom-Header

content-security-policy: default-src 'self'; connect-src ipc: http://ipc.localhost; script-src 'self' 'sha256-Wjjrs6qinmnr+tOry8x8PPwI77eGpUFR3EEGZktjJNs='

content-type: text/html

cross-origin-embedder-policy: require-corp

cross-origin-opener-policy: same-origin

tauri-custom-header: key1 'value1' 'value2'; key2 'value3'

timing-allow-origin: https://developer.mozilla.org, https://example.com
```

Since the resulting header values are always ‘string-like’. So depending on the what data type the HeaderSource is, they need to be converted.

* `String`(JS/Rust): stay the same for the resulting header value
* `Array`(JS)/`Vec\&lt;String\&gt;`(Rust): Item are joined by ”, ” for the resulting header value
* `Object`(JS)/ `Hashmap\&lt;String,String\&gt;`(Rust): Items are composed from: key + space + value. Item are then joined by ”; ” for the resulting header value

**Object Properties**:

* Access-Control-Allow-Credentials
* Access-Control-Allow-Headers
* Access-Control-Allow-Methods
* Access-Control-Expose-Headers
* Access-Control-Max-Age
* Cross-Origin-Embedder-Policy
* Cross-Origin-Opener-Policy
* Cross-Origin-Resource-Policy
* Permissions-Policy
* Service-Worker-Allowed
* Tauri-Custom-Header
* Timing-Allow-Origin
* X-Content-Type-Options

##### [Access-Control-Allow-Credentials](#access-control-allow-credentials)

[Section titled “Access-Control-Allow-Credentials”](#access-control-allow-credentials)

[`HeaderSource`](#headersource) | `null`

The Access-Control-Allow-Credentials response header tells browsers whether the
server allows cross-origin HTTP requests to include credentials.

See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials>>

##### [Access-Control-Allow-Headers](#access-control-allow-headers)

[Section titled “Access-Control-Allow-Headers”](#access-control-allow-headers)

[`HeaderSource`](#headersource) | `null`

The Access-Control-Allow-Headers response header is used in response
to a preflight request which includes the Access-Control-Request-Headers
to indicate which HTTP headers can be used during the actual request.

This header is required if the request has an Access-Control-Request-Headers header.

See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers>>

##### [Access-Control-Allow-Methods](#access-control-allow-methods)

[Section titled “Access-Control-Allow-Methods”](#access-control-allow-methods)

[`HeaderSource`](#headersource) | `null`

The Access-Control-Allow-Methods response header specifies one or more methods
allowed when accessing a resource in response to a preflight request.

See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods>>

##### [Access-Control-Expose-Headers](#access-control-expose-headers)

[Section titled “Access-Control-Expose-Headers”](#access-control-expose-headers)

[`HeaderSource`](#headersource) | `null`

The Access-Control-Expose-Headers response header allows a server to indicate
which response headers should be made available to scripts running in the browser,
in response to a cross-origin request.

See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers>>

##### [Access-Control-Max-Age](#access-control-max-age)

[Section titled “Access-Control-Max-Age”](#access-control-max-age)

[`HeaderSource`](#headersource) | `null`

The Access-Control-Max-Age response header indicates how long the results of a
preflight request (that is the information contained in the
Access-Control-Allow-Methods and Access-Control-Allow-Headers headers) can
be cached.

See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age>>

##### [Cross-Origin-Embedder-Policy](#cross-origin-embedder-policy)

[Section titled “Cross-Origin-Embedder-Policy”](#cross-origin-embedder-policy)

[`HeaderSource`](#headersource) | `null`

The HTTP Cross-Origin-Embedder-Policy (COEP) response header configures embedding
cross-origin resources into the document.

See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy>>

##### [Cross-Origin-Opener-Policy](#cross-origin-opener-policy)

[Section titled “Cross-Origin-Opener-Policy”](#cross-origin-opener-policy)

[`HeaderSource`](#headersource) | `null`

The HTTP Cross-Origin-Opener-Policy (COOP) response header allows you to ensure a
top-level document does not share a browsing context group with cross-origin documents.
COOP will process-isolate your document and potential attackers can’t access your global
object if they were to open it in a popup, preventing a set of cross-origin attacks dubbed XS-Leaks.

See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy>>

##### [Cross-Origin-Resource-Policy](#cross-origin-resource-policy)

[Section titled “Cross-Origin-Resource-Policy”](#cross-origin-resource-policy)

[`HeaderSource`](#headersource) | `null`

The HTTP Cross-Origin-Resource-Policy response header conveys a desire that the
browser blocks no-cors cross-origin/cross-site requests to the given resource.

See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy>>

##### [Permissions-Policy](#permissions-policy)

[Section titled “Permissions-Policy”](#permissions-policy)

[`HeaderSource`](#headersource) | `null`

The HTTP Permissions-Policy header provides a mechanism to allow and deny the
use of browser features in a document or within any &lt;iframe&gt; elements in the document.

See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy>>

##### [Service-Worker-Allowed](#service-worker-allowed)

[Section titled “Service-Worker-Allowed”](#service-worker-allowed)

[`HeaderSource`](#headersource) | `null`

The HTTP Service-Worker-Allowed response header is used to broaden the path restriction for a
service worker’s default scope.

By default, the scope for a service worker registration is the directory where the service
worker script is located. For example, if the script `sw.js` is located in `/js/sw.js`,
it can only control URLs under `/js/` by default. Servers can use the `Service-Worker-Allowed`
header to allow a service worker to control URLs outside of its own directory.

See <<https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Service-Worker-Allowed>>
