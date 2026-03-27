# Source: https://supabase.com/docs/reference/javascript/installing
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# client-setup — Part 12

7

}

8

})

9

10

// Access auth admin api

11

const adminAuthClient = supabase.auth.admin
```

---

## Retrieve a user

`getUserById(uid)`

Get user by id.

* Fetches the user object from the database based on the user's id.
* The `getUserById()` method requires the user's id which maps to the `auth.users.id` column.

### Parameters

* uidstring

  The user's unique identifier

  This function should only be called on a server. Never expose your `service_role` key in the browser.

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Fetch the user object using the access\_token jwt

```
1

const { data, error } = await supabase.auth.admin.getUserById(1)
```

Response

---

## List all users

`listUsers(params?)`

Get a list of users.

This function should only be called on a server. Never expose your `service_role` key in the browser.

* Defaults to return 50 users per page.

### Parameters

* params

  Optional

  PageParams

  An object which supports `page` and `perPage` as numbers, to alter the paginated results.

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Get a page of usersPaginated list of users

```
1

const { data: { users }, error } = await supabase.auth.admin.listUsers()
```

---

## Create a user

`createUser(attributes)`

Creates a new user. This function should only be called on a server. Never expose your `service_role` key in the browser.

* To confirm the user's email address or phone number, set `email_confirm` or `phone_confirm` to true. Both arguments default to false.
* `createUser()` will not send a confirmation email to the user. You can use [`inviteUserByEmail()`](/docs/reference/javascript/auth-admin-inviteuserbyemail) if you want to send them an email invite instead.
* If you are sure that the created user's email or phone number is legitimate and verified, you can set the `email_confirm` or `phone_confirm` param to `true`.

### Parameters

* attributesAdminUserAttributes

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

With custom user metadataAuto-confirm the user's emailAuto-confirm the user's phone number

```
1

const { data, error } = await supabase.auth.admin.createUser({

2

email: 'user@email.com',

3

password: 'password',

4

user_metadata: { name: 'Yoda' }

5

})
```

Response

---

## Delete a user

`deleteUser(id, shouldSoftDelete)`

Delete a user. Requires a `service_role` key.

* The `deleteUser()` method requires the user's ID, which maps to the `auth.users.id` column.

### Parameters

* idstring

  The user id you want to remove.
* shouldSoftDeleteboolean

  If true, then the user will be soft-deleted from the auth schema. Soft deletion allows user identification from the hashed user ID but is not reversible. Defaults to false for backward compatibility.

  This function should only be called on a server. Never expose your `service_role` key in the browser.

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Removes a user

```
1

const { data, error } = await supabase.auth.admin.deleteUser(

2

'715ed5db-f090-4b8c-a067-640ecee36aa0'

3

)
```

Response

---

## Send an email invite link

`inviteUserByEmail(email, options)`

Sends an invite link to an email address.

* Sends an invite link to the user's email address.
* The `inviteUserByEmail()` method is typically used by administrators to invite users to join the application.
* Note that PKCE is not supported when using `inviteUserByEmail`. This is because the browser initiating the invite is often different from the browser accepting the invite which makes it difficult to provide the security guarantees required of the PKCE flow.

### Parameters

* emailstring

  The email address of the user.
* optionsobject

  Additional options to be included when inviting.

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Invite a user

```
1

const { data, error } = await supabase.auth.admin.inviteUserByEmail('email@example.com')
```

Response

---

## Generate an email link

`generateLink(params)`

Generates email links and OTPs to be sent via a custom email provider.

* The following types can be passed into `generateLink()`: `signup`, `magiclink`, `invite`, `recovery`, `email_change_current`, `email_change_new`, `phone_change`.
* `generateLink()` only generates the email link for `email_change_email` if the **Secure email change** is enabled in your project's [email auth provider settings](/dashboard/project/_/auth/providers).
* `generateLink()` handles the creation of the user for `signup`, `invite` and `magiclink`.

### Parameters

* paramsOne of the following options

  Details

  + Option 1GenerateSignupLinkParams

    Details
  + Option 2GenerateInviteOrMagiclinkParams

    Details
  + Option 3GenerateRecoveryLinkParams

    Details
  + Option 4GenerateEmailChangeLinkParams

    Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Generate a signup linkGenerate an invite linkGenerate a magic linkGenerate a recovery linkGenerate links to change current email address

```
1

const { data, error } = await supabase.auth.admin.generateLink({

2

type: 'signup',

3

email: 'email@example.com',

4

password: 'secret'

5

})
```

Response

---

## Update a user

`updateUserById(uid, attributes)`

Updates the user data. Changes are applied directly without confirmation flows.

**Important:** This is a server-side operation and does **not** trigger client-side `onAuthStateChange` listeners. The admin API has no connection to client state.

To sync changes to the client after calling this method:

1. On the client, call `supabase.auth.refreshSession()` to fetch the updated user data
2. This will trigger the `TOKEN_REFRESHED` event and notify all listeners

### Parameters

* uidstring

  The user's unique identifier
* attributesAdminUserAttributes

  The data you want to update.

  This function should only be called on a server. Never expose your `service_role` key in the browser.

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Example 1Updates a user's emailUpdates a user's passwordUpdates a user's metadataUpdates a user's app\_metadataConfirms a user's email addressConfirms a user's phone numberBan a user for 100 years

```
1

// Server-side (Edge Function)

2

const { data, error } = await supabase.auth.admin.updateUserById(

3

userId,

4

{ user_metadata: { preferences: { theme: 'dark' } } }

5

)

6

7

// Client-side (to sync the changes)

8

const { data, error } = await supabase.auth.refreshSession()

9

// onAuthStateChange listeners will now be notified with updated user
```

---

## Sign out a user (admin)

`signOut(jwt, scope)`

Removes a logged-in session.

### Parameters

* jwtstring

  A valid, logged-in JWT.
* scopeOne of the following options

  The logout sope.

  Details

  + Option 1"global"
  + Option 2"local"
  + Option 3"others"

### Return Type

Promise<object>

Details

---

## Delete a factor for a user

`deleteFactor(params)`

Deletes a factor on a user. This will log the user out of all active sessions if the deleted factor was verified.

### Parameters

* paramsAuthMFAAdminDeleteFactorParams
