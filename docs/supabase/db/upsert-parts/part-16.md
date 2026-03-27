# Source: https://supabase.com/docs/reference/javascript/upsert
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# upsert — Part 16

  The original file path, including the current file name. For example `folder/image.png`.
* toPathstring

  The new file path, including the new file name. For example `folder/image-copy.png`.
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

Copy file

```
1

const { data, error } = await supabase

2

.storage

3

.from('avatars')

4

.copy('public/avatar1.png', 'private/avatar2.png')
```

Response

---

## Create a signed URL

`createSignedUrl(path, expiresIn, options?)`

Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.

* RLS policy permissions required:
  + `buckets` table permissions: none
  + `objects` table permissions: `select`
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* pathstring

  The file path, including the current file name. For example `folder/image.png`.
* expiresInnumber

  The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
* options

  Optional

  object

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Create Signed URLCreate a signed URL for an asset with transformationsCreate a signed URL which triggers the download of the asset

```
1

const { data, error } = await supabase

2

.storage

3

.from('avatars')

4

.createSignedUrl('folder/avatar1.png', 60)
```

Response

---

## Create signed URLs

`createSignedUrls(paths, expiresIn, options?)`

Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.

* RLS policy permissions required:
  + `buckets` table permissions: none
  + `objects` table permissions: `select`
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* pathsArray<string>

  The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
* expiresInnumber

  The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
* options

  Optional

  object

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Create Signed URLs

```
1

const { data, error } = await supabase

2

.storage

3

.from('avatars')

4

.createSignedUrls(['folder/avatar1.png', 'folder/avatar2.png'], 60)
```

Response

---

## Create signed upload URL

`createSignedUploadUrl(path, options?)`

Creates a signed upload URL. Signed upload URLs can be used to upload files to the bucket without further authentication. They are valid for 2 hours.

* RLS policy permissions required:
  + `buckets` table permissions: none
  + `objects` table permissions: `insert`
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* pathstring

  The file path, including the current file name. For example `folder/image.png`.
* options

  Optional

  object

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Create Signed Upload URL

```
1

const { data, error } = await supabase

2

.storage

3

.from('avatars')

4

.createSignedUploadUrl('folder/cat.jpg')
```

Response

---

## Upload to a signed URL

`uploadToSignedUrl(path, token, fileBody, fileOptions?)`

Upload a file with a token generated from `createSignedUploadUrl`.

* RLS policy permissions required:
  + `buckets` table permissions: none
  + `objects` table permissions: none
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* pathstring

  The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
* tokenstring

  The token generated from `createSignedUploadUrl`
* fileBodyFileBody

  The body of the file to be stored in the bucket.
* fileOptions

  Optional

  FileOptions

  HTTP headers (cacheControl, contentType, etc.). **Note:** The `upsert` option has no effect here. To enable upsert behavior, pass `{ upsert: true }` when calling `createSignedUploadUrl()` instead.

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Upload to a signed URL

```
1

const { data, error } = await supabase

2

.storage

3

.from('avatars')

4

.uploadToSignedUrl('folder/cat.jpg', 'token-from-createSignedUploadUrl', file)
```

Response

---

## Retrieve public URL

`getPublicUrl(path, options?)`

A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset. This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.

* The bucket needs to be set to public, either via [updateBucket()](/docs/reference/javascript/storage-updatebucket) or by going to Storage on [supabase.com/dashboard](https://supabase.com/dashboard), clicking the overflow menu on a bucket and choosing "Make public"
* RLS policy permissions required:
  + `buckets` table permissions: none
  + `objects` table permissions: none
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* pathstring

  The path and name of the file to generate the public URL for. For example `folder/image.png`.
* options

  Optional

  object

  Details

### Return Type

object

Details

Returns the URL for an asset in a public bucketReturns the URL for an asset in a public bucket with transformationsReturns the URL which triggers the download of an asset in a public bucket

```
1

const { data } = supabase

2

.storage

3

.from('public-bucket')

4

.getPublicUrl('folder/avatar1.png')
```

Response

---

## Download a file

`download(path, options?, parameters?)`

Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.

* RLS policy permissions required:
  + `buckets` table permissions: none
  + `objects` table permissions: `select`
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* pathstring

  The full path and file name of the file to be downloaded. For example `folder/image.png`.
* options

  Optional

  Options
* parameters

  Optional

  FetchParameters

  Additional fetch parameters like signal for cancellation. Supports standard fetch options including cache control.

  Details

Download fileDownload file with transformationsDownload with cache control (useful in Edge Functions)Download with abort signal

```
1

const { data, error } = await supabase

2

.storage

3

.from('avatars')

4

.download('folder/avatar1.png')
```

Response

---

## Delete files in a bucket

`remove(paths)`

Deletes files within the same bucket

Returns an array of FileObject entries for the deleted files. Note that deprecated fields like `bucket_id` may or may not be present in the response - do not rely on them.

* RLS policy permissions required:
  + `buckets` table permissions: none
  + `objects` table permissions: `delete` and `select`
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* pathsArray<string>

  An array of files to delete, including the path and file name. For example [`'folder/image.png'`].

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details
