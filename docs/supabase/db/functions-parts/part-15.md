# Source: https://supabase.com/docs/reference/javascript/select
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# functions — Part 15

4

public: false,

5

allowedMimeTypes: ['image/png'],

6

fileSizeLimit: 1024

7

})
```

Response

---

## Empty a bucket

`emptyBucket(id)`

Removes all objects inside a single bucket.

* RLS policy permissions required:
  + `buckets` table permissions: `select`
  + `objects` table permissions: `select` and `delete`
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* idstring

  The unique identifier of the bucket you would like to empty.

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Empty bucket

```
1

const { data, error } = await supabase

2

.storage

3

.emptyBucket('avatars')
```

Response

---

## Update a bucket

`updateBucket(id, options)`

Updates a Storage bucket

* RLS policy permissions required:
  + `buckets` table permissions: `select` and `update`
  + `objects` table permissions: none
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* idstring

  A unique identifier for the bucket you are updating.
* optionsobject

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Update bucket

```
1

const { data, error } = await supabase

2

.storage

3

.updateBucket('avatars', {

4

public: false,

5

allowedMimeTypes: ['image/png'],

6

fileSizeLimit: 1024

7

})
```

Response

---

## Delete a bucket

`deleteBucket(id)`

Deletes an existing bucket. A bucket can't be deleted with existing objects inside it. You must first `empty()` the bucket.

* RLS policy permissions required:
  + `buckets` table permissions: `select` and `delete`
  + `objects` table permissions: none
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* idstring

  The unique identifier of the bucket you would like to delete.

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Delete bucket

```
1

const { data, error } = await supabase

2

.storage

3

.deleteBucket('avatars')
```

Response

---

## Upload a file

`upload(path, fileBody, fileOptions?)`

Uploads a file to an existing bucket.

* RLS policy permissions required:
  + `buckets` table permissions: none
  + `objects` table permissions: only `insert` when you are uploading new files and `select`, `insert` and `update` when you are upserting files
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
* For React Native, using either `Blob`, `File` or `FormData` does not work as intended. Upload file using `ArrayBuffer` from base64 file data instead, see example below.

### Parameters

* pathstring

  The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
* fileBodyFileBody

  The body of the file to be stored in the bucket.
* fileOptions

  Optional

  FileOptions

  Optional file upload options including cacheControl, contentType, upsert, and metadata.

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Upload fileUpload file using `ArrayBuffer` from base64 file data

```
1

const avatarFile = event.target.files[0]

2

const { data, error } = await supabase

3

.storage

4

.from('avatars')

5

.upload('public/avatar1.png', avatarFile, {

6

cacheControl: '3600',

7

upsert: false

8

})
```

Response

---

## Replace an existing file

`update(path, fileBody, fileOptions?)`

Replaces an existing file at the specified path with a new one.

* RLS policy permissions required:
  + `buckets` table permissions: none
  + `objects` table permissions: `update` and `select`
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works
* For React Native, using either `Blob`, `File` or `FormData` does not work as intended. Update file using `ArrayBuffer` from base64 file data instead, see example below.

### Parameters

* pathstring

  The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
* fileBodyOne of the following options

  The body of the file to be stored in the bucket.

  Details

  + Option 1string
  + Option 2ArrayBuffer
  + Option 3ReadableStream
  + Option 4Blob
  + Option 5File
  + Option 6FormData
  + Option 7@types/node.\_\_global.NodeJS.ReadableStream
  + Option 8URLSearchParams
  + Option 9ArrayBufferView
  + Option 10@types/node.\_\_global.Buffer
* fileOptions

  Optional

  FileOptions

  Optional file upload options including cacheControl, contentType, upsert, and metadata.

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Update fileUpdate file using `ArrayBuffer` from base64 file data

```
1

const avatarFile = event.target.files[0]

2

const { data, error } = await supabase

3

.storage

4

.from('avatars')

5

.update('public/avatar1.png', avatarFile, {

6

cacheControl: '3600',

7

upsert: true

8

})
```

Response

---

## Move an existing file

`move(fromPath, toPath, options?)`

Moves an existing file to a new path in the same bucket.

* RLS policy permissions required:
  + `buckets` table permissions: none
  + `objects` table permissions: `update` and `select`
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* fromPathstring

  The original file path, including the current file name. For example `folder/image.png`.
* toPathstring

  The new file path, including the new file name. For example `folder/image-new.png`.
* options

  Optional

  DestinationOptions

  The destination options.

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Move file

```
1

const { data, error } = await supabase

2

.storage

3

.from('avatars')

4

.move('public/avatar1.png', 'private/avatar2.png')
```

Response

---

## Copy an existing file

`copy(fromPath, toPath, options?)`

Copies an existing file to a new path in the same bucket.

* RLS policy permissions required:
  + `buckets` table permissions: none
  + `objects` table permissions: `insert` and `select`
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* fromPathstring

