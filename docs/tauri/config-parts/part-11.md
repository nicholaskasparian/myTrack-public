# Source: https://tauri.app/reference/config/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# config — Part 11


##### [timestampUrl](#timestampurl)

[Section titled “timestampUrl”](#timestampurl)

`string` | `null`

Server to use during timestamping.

##### [tsp](#tsp)

[Section titled “tsp”](#tsp)

`boolean`

Whether to use Time-Stamp Protocol (TSP, a.k.a. RFC 3161) for the timestamp server. Your code signing provider may
use a TSP timestamp server, like e.g. SSL.com does. If so, enable TSP by setting to true.

##### [webviewInstallMode](#webviewinstallmode-1)

[Section titled “webviewInstallMode”](#webviewinstallmode-1)

[`WebviewInstallMode`](#webviewinstallmode)

The installation mode for the Webview2 runtime.

Default

```
{

"silent": true,

"type": "downloadBootstrapper"

}
```

##### [wix](#wix)

[Section titled “wix”](#wix)

[`WixConfig`](#wixconfig) | `null`

Configuration for the MSI generated with WiX.

### [WixConfig](#wixconfig)

[Section titled “WixConfig”](#wixconfig)

Configuration for the MSI bundle using WiX.

See more: <<https://v2.tauri.app/reference/config/#wixconfig>>

**Object Properties**:

* bannerPath
* componentGroupRefs
* componentRefs
* dialogImagePath
* enableElevatedUpdateTask
* featureGroupRefs
* featureRefs
* fipsCompliant
* fragmentPaths
* language
* mergeRefs
* template
* upgradeCode
* version

##### [bannerPath](#bannerpath)

[Section titled “bannerPath”](#bannerpath)

`string` | `null`

Path to a bitmap file to use as the installation user interface banner.
This bitmap will appear at the top of all but the first page of the installer.

The required dimensions are 493px × 58px.

##### [componentGroupRefs](#componentgrouprefs)

[Section titled “componentGroupRefs”](#componentgrouprefs)

`string`[]

The ComponentGroup element ids you want to reference from the fragments.

**Default**: `[]`

##### [componentRefs](#componentrefs)

[Section titled “componentRefs”](#componentrefs)

`string`[]

The Component element ids you want to reference from the fragments.

**Default**: `[]`

##### [dialogImagePath](#dialogimagepath)

[Section titled “dialogImagePath”](#dialogimagepath)

`string` | `null`

Path to a bitmap file to use on the installation user interface dialogs.
It is used on the welcome and completion dialogs.

The required dimensions are 493px × 312px.

##### [enableElevatedUpdateTask](#enableelevatedupdatetask)

[Section titled “enableElevatedUpdateTask”](#enableelevatedupdatetask)

`boolean`

Create an elevated update task within Windows Task Scheduler.

##### [featureGroupRefs](#featuregrouprefs)

[Section titled “featureGroupRefs”](#featuregrouprefs)

`string`[]

The FeatureGroup element ids you want to reference from the fragments.

**Default**: `[]`

##### [featureRefs](#featurerefs)

[Section titled “featureRefs”](#featurerefs)

`string`[]

The Feature element ids you want to reference from the fragments.

**Default**: `[]`

##### [fipsCompliant](#fipscompliant)

[Section titled “fipsCompliant”](#fipscompliant)

`boolean`

Enables FIPS compliant algorithms.
Can also be enabled via the `TAURI_BUNDLER_WIX_FIPS_COMPLIANT` env var.

##### [fragmentPaths](#fragmentpaths)

[Section titled “fragmentPaths”](#fragmentpaths)

`string`[]

A list of paths to .wxs files with WiX fragments to use.

**Default**: `[]`

##### [language](#language)

[Section titled “language”](#language)

[`WixLanguage`](#wixlanguage)

The installer languages to build. See <<https://docs.microsoft.com/en-us/windows/win32/msi/localizing-the-error-and-actiontext-tables>>.

**Default**: `"en-US"`

##### [mergeRefs](#mergerefs)

[Section titled “mergeRefs”](#mergerefs)

`string`[]

The Merge element ids you want to reference from the fragments.

**Default**: `[]`

##### [template](#template-2)

[Section titled “template”](#template-2)

`string` | `null`

A custom .wxs template to use.

##### [upgradeCode](#upgradecode)

[Section titled “upgradeCode”](#upgradecode)

`string` | `null` formatted as `uuid`

A GUID upgrade code for MSI installer. This code ***must stay the same across all of your updates***,
otherwise, Windows will treat your update as a different app and your users will have duplicate versions of your app.

By default, tauri generates this code by generating a Uuid v5 using the string `&lt;productName&gt;.exe.app.x64` in the DNS namespace.
You can use Tauri’s CLI to generate and print this code for you, run `tauri inspect wix-upgrade-code`.

It is recommended that you set this value in your tauri config file to avoid accidental changes in your upgrade code
whenever you want to change your product name.

##### [version](#version-1)

[Section titled “version”](#version-1)

`string` | `null`

MSI installer version in the format `major.minor.patch.build` (build is optional).

Because a valid version is required for MSI installer, it will be derived from [`Config::version`] if this field is not set.

The first field is the major version and has a maximum value of 255. The second field is the minor version and has a maximum value of 255.
The third and fourth fields have a maximum value of 65,535.

See <<https://learn.microsoft.com/en-us/windows/win32/msi/productversion>> for more info.

### [WixLanguage](#wixlanguage)

[Section titled “WixLanguage”](#wixlanguage)

**Any of the following**:

* `string` A single language to build, without configuration.
* `string`[] A list of languages to build, without configuration.
* A map of languages and its configuration. **Allows additional properties**: [`WixLanguageConfig`](#wixlanguageconfig)

The languages to build using WiX.

### [WixLanguageConfig](#wixlanguageconfig)

[Section titled “WixLanguageConfig”](#wixlanguageconfig)

Configuration for a target language for the WiX build.

See more: <<https://v2.tauri.app/reference/config/#wixlanguageconfig>>

**Object Properties**:

* localePath

##### [localePath](#localepath)

[Section titled “localePath”](#localepath)

`string` | `null`

The path to a locale (`.wxl`) file. See <<https://wixtoolset.org/documentation/manual/v3/howtos/ui_and_localization/build_a_localized_version.html>>.

---

[Support on Open Collective](https://opencollective.com/tauri) [Sponsor on GitHub](https://github.com/sponsors/tauri-apps)

© 2026 Tauri Contributors. CC-BY / MIT
