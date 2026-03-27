# Source: https://v2.tauri.app/plugin/file-system/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# fs — Part 2


  await file.close();
  ```

  In order for the file to be created, `write` or `append` must also be set to `true`.

  To fail if the file already exists, see `createNew`.
* createNew

  `createNew` works similarly to `create`, but will fail if the file already exists.

  ```
  import { open, BaseDirectory } from '@tauri-apps/plugin-fs';

  const file = await open('foo/bar.txt', {

  write: true,

  createNew: true,

  baseDir: BaseDirectory.AppData,

  });

  await file.write(new TextEncoder().encode('world'));

  await file.close();
  ```

  In order for the file to be created, `write` must also be set to `true`.

### [Read](#read)

[Section titled “Read”](#read)

The plugin offers separate APIs for reading text and binary files for performance.

* text files

  ```
  import { readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

  const configToml = await readTextFile('config.toml', {

  baseDir: BaseDirectory.AppConfig,

  });
  ```

  If the file is large you can stream its lines with the `readTextFileLines` API:

  ```
  import { readTextFileLines, BaseDirectory } from '@tauri-apps/plugin-fs';

  const lines = await readTextFileLines('app.logs', {

  baseDir: BaseDirectory.AppLog,

  });

  for await (const line of lines) {

  console.log(line);

  }
  ```
* binary files

  ```
  import { readFile, BaseDirectory } from '@tauri-apps/plugin-fs';

  const icon = await readFile('icon.png', {

  baseDir: BaseDirectory.Resources,

  });
  ```

### [Remove](#remove)

[Section titled “Remove”](#remove)

Call `remove()` to delete a file. If the file does not exist, an error is returned.

```
import { remove, BaseDirectory } from '@tauri-apps/plugin-fs';

await remove('user.db', { baseDir: BaseDirectory.AppLocalData });
```

### [Copy](#copy)

[Section titled “Copy”](#copy)

The `copyFile` function takes the source and destination paths.
Note that you must configure each base directory separately.

```
import { copyFile, BaseDirectory } from '@tauri-apps/plugin-fs';

await copyFile('user.db', 'user.db.bk', {

fromPathBaseDir: BaseDirectory.AppLocalData,

toPathBaseDir: BaseDirectory.Temp,

});
```

In the above example the <app-local-data>/user.db file is copied to $TMPDIR/user.db.bk.

### [Exists](#exists)

[Section titled “Exists”](#exists)

Use the `exists()` function to check if a file exists:

```
import { exists, BaseDirectory } from '@tauri-apps/plugin-fs';

const tokenExists = await exists('token', {

baseDir: BaseDirectory.AppLocalData,

});
```

### [Metadata](#metadata)

[Section titled “Metadata”](#metadata)

File metadata can be retrieved with the `stat` and the `lstat` functions.
`stat` follows symlinks (and returns an error if the actual file it points to is not allowed by the scope)
and `lstat` does not follow symlinks, returning the information of the symlink itself.

```
import { stat, BaseDirectory } from '@tauri-apps/plugin-fs';

const metadata = await stat('app.db', {

baseDir: BaseDirectory.AppLocalData,

});
```

### [Rename](#rename)

[Section titled “Rename”](#rename)

The `rename` function takes the source and destination paths.
Note that you must configure each base directory separately.

```
import { rename, BaseDirectory } from '@tauri-apps/plugin-fs';

await rename('user.db.bk', 'user.db', {

fromPathBaseDir: BaseDirectory.AppLocalData,

toPathBaseDir: BaseDirectory.Temp,

});
```

In the above example the <app-local-data>/user.db.bk file is renamed to $TMPDIR/user.db.

### [Truncate](#truncate)

[Section titled “Truncate”](#truncate)

Truncates or extends the specified file to reach the specified file length (defaults to 0).

* truncate to 0 length

```
import { truncate } from '@tauri-apps/plugin-fs';

await truncate('my_file.txt', 0, { baseDir: BaseDirectory.AppLocalData });
```

* truncate to a specific length

```
import {

truncate,

readTextFile,

writeTextFile,

BaseDirectory,

} from '@tauri-apps/plugin-fs';

const filePath = 'file.txt';

await writeTextFile(filePath, 'Hello World', {

baseDir: BaseDirectory.AppLocalData,

});

await truncate(filePath, 7, {

baseDir: BaseDirectory.AppLocalData,

});

const data = await readTextFile(filePath, {

baseDir: BaseDirectory.AppLocalData,

});

console.log(data); // "Hello W"
```

## [Directories](#directories)

[Section titled “Directories”](#directories)

### [Create](#create-1)

[Section titled “Create”](#create-1)

To create a directory, call the `mkdir` function:

```
import { mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';

await mkdir('images', {

baseDir: BaseDirectory.AppLocalData,

});
```

### [Read](#read-1)

[Section titled “Read”](#read-1)

The `readDir` function recursively lists the entries of a directory:

```
import { readDir, BaseDirectory } from '@tauri-apps/plugin-fs';

const entries = await readDir('users', { baseDir: BaseDirectory.AppLocalData });
```

### [Remove](#remove-1)

[Section titled “Remove”](#remove-1)

Call `remove()` to delete a directory. If the directory does not exist, an error is returned.

```
import { remove, BaseDirectory } from '@tauri-apps/plugin-fs';

await remove('images', { baseDir: BaseDirectory.AppLocalData });
```

If the directory is not empty, the `recursive` option must be set to `true`:

```
import { remove, BaseDirectory } from '@tauri-apps/plugin-fs';

await remove('images', {

baseDir: BaseDirectory.AppLocalData,

recursive: true,

});
```

### [Exists](#exists-1)

[Section titled “Exists”](#exists-1)

Use the `exists()` function to check if a directory exists:

```
import { exists, BaseDirectory } from '@tauri-apps/plugin-fs';

const tokenExists = await exists('images', {

baseDir: BaseDirectory.AppLocalData,

});
```

### [Metadata](#metadata-1)

[Section titled “Metadata”](#metadata-1)

Directory metadata can be retrieved with the `stat` and the `lstat` functions.
`stat` follows symlinks (and returns an error if the actual file it points to is not allowed by the scope)
and `lstat` does not follow symlinks, returning the information of the symlink itself.

```
import { stat, BaseDirectory } from '@tauri-apps/plugin-fs';

const metadata = await stat('databases', {

baseDir: BaseDirectory.AppLocalData,

});
```

## [Watching changes](#watching-changes)

[Section titled “Watching changes”](#watching-changes)

To watch a directory or file for changes, use the `watch` or `watchImmediate` functions.

* watch

  `watch` is debounced so it only emits events after a certain delay:

  ```
  import { watch, BaseDirectory } from '@tauri-apps/plugin-fs';

  await watch(

  'app.log',

  (event) => {

  console.log('app.log event', event);

  },

  {

  baseDir: BaseDirectory.AppLog,

  delayMs: 500,

  }

  );
  ```
* watchImmediate

  `watchImmediate` immediately notifies listeners of an event:

  ```
  import { watchImmediate, BaseDirectory } from '@tauri-apps/plugin-fs';

  await watchImmediate(

  'logs',

  (event) => {

  console.log('logs directory event', event);

  },

  {

  baseDir: BaseDirectory.AppLog,

  recursive: true,

  }

  );
  ```

By default watch operations on a directory are not recursive.
Set the `recursive` option to `true` to recursively watch for changes on all sub-directories.

## [Permissions](#permissions)

[Section titled “Permissions”](#permissions)

By default all potentially dangerous plugin commands and scopes are blocked and cannot be accessed. You must modify the permissions in your `capabilities` configuration to enable these.

See the [Capabilities Overview](/security/capabilities/) for more information and the [step by step guide](/learn/security/using-plugin-permissions/) to use plugin permissions.

src-tauri/capabilities/default.json

```
{

"$schema": "../gen/schemas/desktop-schema.json",

"identifier": "main-capability",

"description": "Capability for the main window",

"windows": ["main"],

"permissions": [

"fs:default",

{

"identifier": "fs:allow-exists",

"allow": [{ "path": "$APPDATA/*" }]

}

]

}
```

## [Default Permission](#default-permission)

This set of permissions describes the what kind of
file system access the `fs` plugin has enabled or denied by default.

#### [Granted Permissions](#granted-permissions)

This default permission set enables read access to the
application specific directories (AppConfig, AppData, AppLocalData, AppCache,
AppLog) and all files and sub directories created in it.
The location of these directories depends on the operating system,
where the application is run.

In general these directories need to be manually created
by the application at runtime, before accessing files or folders
in it is possible.

Therefore, it is also allowed to create all of these folders via
the `mkdir` command.

#### Denied Permissions

This default permission set prevents access to critical components
of the Tauri application by default.
On Windows the webview data folder access is denied.

#### This default permission set includes the following:

* `create-app-specific-dirs`
* `read-app-specific-dirs-recursive`
* `deny-default`

## Permission Table

| Identifier | Description |
| --- | --- |
| `fs:allow-app-read-recursive` | This allows full recursive read access to the complete application folders, files and subdirectories. |
| `fs:allow-app-write-recursive` | This allows full recursive write access to the complete application folders, files and subdirectories. |
