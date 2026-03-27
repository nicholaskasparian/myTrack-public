# Source: https://supabase.com/docs/reference/javascript/select
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# functions — Part 17


Delete file

```
1

const { data, error } = await supabase

2

.storage

3

.from('avatars')

4

.remove(['folder/avatar1.png'])
```

Response

---

## List all files in a bucket

`list(path?, options?, parameters?)`

Lists all the files and folders within a path of the bucket.

**Important:** For folder entries, fields like `id`, `updated_at`, `created_at`, `last_accessed_at`, and `metadata` will be `null`. Only files have these fields populated. Additionally, deprecated fields like `bucket_id`, `owner`, and `buckets` are NOT returned by this method.

* RLS policy permissions required:
  + `buckets` table permissions: none
  + `objects` table permissions: `select`
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* path

  Optional

  string

  The folder path.
* options

  Optional

  SearchOptions

  Search options including limit (defaults to 100), offset, sortBy, and search

  Details
* parameters

  Optional

  FetchParameters

  Optional fetch parameters including signal for cancellation

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

List files in a bucketSearch files in a bucket

```
1

const { data, error } = await supabase

2

.storage

3

.from('avatars')

4

.list('folder', {

5

limit: 100,

6

offset: 0,

7

sortBy: { column: 'name', order: 'asc' },

8

})

9

10

// Handle files vs folders

11

data?.forEach(item => {

12

if (item.id !== null) {

13

// It's a file

14

console.log('File:', item.name, 'Size:', item.metadata?.size)

15

} else {

16

// It's a folder

17

console.log('Folder:', item.name)

18

}

19

})
```

Response

---

## Check if file exists

`exists(path)`

Checks the existence of a file.

### Parameters

* pathstring

  The file path, including the file name. For example `folder/image.png`.

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Check file existence

```
1

const { data, error } = await supabase

2

.storage

3

.from('avatars')

4

.exists('folder/avatar1.png')
```

---

## Get file metadata

`info(path)`

Retrieves the details of an existing file.

Returns detailed file metadata including size, content type, and timestamps. Note: The API returns `last_modified` field, not `updated_at`.

### Parameters

* pathstring

  The file path, including the file name. For example `folder/image.png`.

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Get file info

```
1

const { data, error } = await supabase

2

.storage

3

.from('avatars')

4

.info('folder/avatar1.png')

5

6

if (data) {

7

console.log('Last modified:', data.lastModified)

8

console.log('Size:', data.size)

9

}
```

---

## List files (v2)

`listV2(options?, parameters?)`

Lists all the files and folders within a bucket using the V2 API with pagination support.

**Important:** Folder entries in the `folders` array only contain `name` and optionally `key` — they have no `id`, timestamps, or `metadata` fields. Full file metadata is only available on entries in the `objects` array.

this method signature might change in the future

### Parameters

* options

  Optional

  SearchV2Options

  Search options including prefix, cursor for pagination, limit, with\_delimiter

  Details
* parameters

  Optional

  FetchParameters

  Optional fetch parameters including signal for cancellation

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

List files with pagination

```
1

const { data, error } = await supabase

2

.storage

3

.from('avatars')

4

.listV2({

5

prefix: 'folder/',

6

limit: 100,

7

})

8

9

// Handle pagination

10

if (data?.hasNext) {

11

const nextPage = await supabase

12

.storage

13

.from('avatars')

14

.listV2({

15

prefix: 'folder/',

16

cursor: data.nextCursor,

17

})

18

}

19

20

// Handle files vs folders

21

data?.objects.forEach(file => {

22

if (file.id !== null) {

23

console.log('File:', file.name, 'Size:', file.metadata?.size)

24

}

25

})

26

data?.folders.forEach(folder => {

27

console.log('Folder:', folder.name)

28

})
```

---

## Convert file to base64

`toBase64(data)`

### Parameters

* datastring

### Return Type

string

---

## Analytics Buckets

This section contains methods for working with Analytics Buckets.
