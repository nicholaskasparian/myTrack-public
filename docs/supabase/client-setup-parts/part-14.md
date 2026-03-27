# Source: https://supabase.com/docs/reference/javascript/installing
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# client-setup — Part 14


Listen to broadcast messagesListen to presence syncListen to presence joinListen to presence leaveListen to all database changesListen to a specific tableListen to insertsListen to updatesListen to deletesListen to multiple eventsListen to row level changes

```
1

const channel = supabase.channel("room1")

2

3

channel.on("broadcast", { event: "cursor-pos" }, (payload) => {

4

console.log("Cursor position received!", payload);

5

}).subscribe((status) => {

6

if (status === "SUBSCRIBED") {

7

channel.send({

8

type: "broadcast",

9

event: "cursor-pos",

10

payload: { x: Math.random(), y: Math.random() },

11

});

12

}

13

});
```

---

## Unsubscribe from a channel

`removeChannel(channel)`

Unsubscribes and removes Realtime channel from Realtime client.

* Removing a channel is a great way to maintain the performance of your project's Realtime service as well as your database if you're listening to Postgres changes. Supabase will automatically handle cleanup 30 seconds after a client is disconnected, but unused channels may cause degradation as more clients are simultaneously subscribed.

### Parameters

* channelRealtimeChannel

  The name of the Realtime channel.

### Return Type

Promise<One of the following options>

Details

* Option 1"error"
* Option 2"ok"
* Option 3"timed out"

Removes a channel

```
1

supabase.removeChannel(myChannel)
```

---

## Unsubscribe from all channels

`removeAllChannels()`

Unsubscribes and removes all Realtime channels from Realtime client.

* Removing channels is a great way to maintain the performance of your project's Realtime service as well as your database if you're listening to Postgres changes. Supabase will automatically handle cleanup 30 seconds after a client is disconnected, but unused channels may cause degradation as more clients are simultaneously subscribed.

### Return Type

Promise<Array<One of the following options>>

Details

Remove all channels

```
1

supabase.removeAllChannels()
```

---

## Retrieve all channels

`getChannels()`

Returns all Realtime channels.

### Return Type

Array<RealtimeChannel>

Get all channels

```
1

const channels = supabase.getChannels()
```

---

## Broadcast a message

`send(args, opts)`

Sends a message into the channel.

* When using REST you don't need to subscribe to the channel
* REST calls are only available from 2.37.0 onwards

### Parameters

* argsobject

  Arguments to send to channel

  Details
* opts{ [key: string]: any }

  Options to be used during the send process

### Return Type

Promise<One of the following options>

Details

* Option 1"ok"
* Option 2"timed out"
* Option 3"error"

Send a message via websocketSend a message via REST

```
1

const channel = supabase.channel('room1')

2

3

channel.subscribe((status) => {

4

if (status === 'SUBSCRIBED') {

5

channel.send({

6

type: 'broadcast',

7

event: 'cursor-pos',

8

payload: { x: Math.random(), y: Math.random() },

9

})

10

}

11

})
```

Response

---

## Set authentication token

`setAuth(token)`

Sets the JWT access token used for channel subscription authorization and Realtime RLS.

If param is null it will use the `accessToken` callback function or the token set on the client.

On callback used, it will set the value of the token internal to the client.

When a token is explicitly provided, it will be preserved across channel operations (including removeChannel and resubscribe). The `accessToken` callback will not be invoked until `setAuth()` is called without arguments.

### Parameters

* tokenOne of the following options

  A JWT string to override the token set on the client.

  Details

  + Option 1null
  + Option 2string

### Return Type

Promise<void>

Example 1

```
1

Setting the authorization header

2

// Use a manual token (preserved across resubscribes, ignores accessToken callback)

3

client.realtime.setAuth('my-custom-jwt')

4

5

// Switch back to using the accessToken callback

6

client.realtime.setAuth()
```

---

## File Buckets

This section contains methods for working with File Buckets.

---

## Access a storage bucket

`from(id)`

Perform file operation in a bucket.

### Parameters

* idstring

  The bucket id to operate on.

Accessing a bucket

```
1

const avatars = supabase.storage.from('avatars')
```

---

## List all buckets

`listBuckets(options?)`

Retrieves the details of all Storage buckets within an existing project.

* RLS policy permissions required:
  + `buckets` table permissions: `select`
  + `objects` table permissions: none
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* options

  Optional

  ListBucketOptions

  Query parameters for listing buckets

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

List bucketsList buckets with options

```
1

const { data, error } = await supabase

2

.storage

3

.listBuckets()
```

---

## Retrieve a bucket

`getBucket(id)`

Retrieves the details of an existing Storage bucket.

* RLS policy permissions required:
  + `buckets` table permissions: `select`
  + `objects` table permissions: none
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* idstring

  The unique identifier of the bucket you would like to retrieve.

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Get bucket

```
1

const { data, error } = await supabase

2

.storage

3

.getBucket('avatars')
```

Response

---

## Create a bucket

`createBucket(id, options)`

Creates a new Storage bucket

* RLS policy permissions required:
  + `buckets` table permissions: `insert`
  + `objects` table permissions: none
* Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works

### Parameters

* idstring

  A unique identifier for the bucket you are creating.
* optionsobject

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Create bucket

```
1

const { data, error } = await supabase

2

.storage

3

.createBucket('avatars', {

