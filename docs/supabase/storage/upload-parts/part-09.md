# Source: https://supabase.com/docs/reference/javascript/storage-from-upload
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# upload — Part 9

  Details

Verify Signup One-Time Password (OTP)Verify SMS One-Time Password (OTP)Verify Email Auth (Token Hash)

```
1

const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email'})
```

Response

---

## Retrieve a session

`getSession()`

Returns the session, refreshing it if necessary.

The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.

**IMPORTANT:** This method loads values directly from the storage attached to the client. If that storage is based on request cookies for example, the values in it may not be authentic and therefore it's strongly advised against using this method and its results in such circumstances. A warning will be emitted if this is detected. Use #getUser() instead.

* Since the introduction of [asymmetric JWT signing keys](/docs/guides/auth/signing-keys), this method is considered low-level and we encourage you to use `getClaims()` or `getUser()` instead.
* Retrieves the current [user session](/docs/guides/auth/sessions) from the storage medium (local storage, cookies).
* The session contains an access token (signed JWT), a refresh token and the user object.
* If the session's access token is expired or is about to expire, this method will use the refresh token to refresh the session.
* When using in a browser, or you've called `startAutoRefresh()` in your environment (React Native, etc.) this function always returns a valid access token without refreshing the session itself, as this is done in the background. This function returns very fast.
* **IMPORTANT SECURITY NOTICE:** If using an insecure storage medium, such as cookies or request headers, the user object returned by this function **must not be trusted**. Always verify the JWT using `getClaims()` or your own JWT verification library to securely establish the user's identity and access. You can also use `getUser()` to fetch the user object directly from the Auth server for this purpose.
* When using in a browser, this function is synchronized across all tabs using the [LockManager](https://developer.mozilla.org/en-US/docs/Web/API/LockManager) API. In other environments make sure you've defined a proper `lock` property, if necessary, to make sure there are no race conditions while the session is being refreshed.

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details
* Option 3object

  Details

Get the session data

```
1

const { data, error } = await supabase.auth.getSession()
```

Response

---

## Retrieve a new session

`refreshSession(currentSession?)`

Returns a new session, regardless of expiry status. Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession(). If the current session's refresh token is invalid, an error will be thrown.

* This method will refresh and return a new session whether the current one is expired or not.

### Parameters

* currentSession

  Optional

  object

  The current session. If passed in, it must contain a refresh token.

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Refresh session using the current sessionRefresh session using a refresh token

```
1

const { data, error } = await supabase.auth.refreshSession()

2

const { session, user } = data
```

Response

---

## Retrieve a user

`getUser(jwt?)`

Gets the current user details if there is an existing session. This method performs a network request to the Supabase Auth server, so the returned value is authentic and can be used to base authorization rules on.

* This method fetches the user object from the database instead of local session.
* This method is useful for checking if the user is authorized because it validates the user's access token JWT on the server.
* Should always be used when checking for user authorization on the server. On the client, you can instead use `getSession().session.user` for faster results. `getSession` is insecure on the server.

### Parameters

* jwt

  Optional

  string

  Takes in an optional access token JWT. If no JWT is provided, the JWT from the current session is used.

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Get the logged in user with the current existing sessionGet the logged in user with a custom access token jwt

```
1

const { data: { user } } = await supabase.auth.getUser()
```

Response

---

## Update a user

`updateUser(attributes, options)`

Updates user data for a logged in user.

* In order to use the `updateUser()` method, the user needs to be signed in first.
* By default, email updates sends a confirmation link to both the user's current and new email. To only send a confirmation link to the user's new email, disable **Secure email change** in your project's [email auth provider settings](/dashboard/project/_/auth/providers).

### Parameters

* attributesUserAttributes

  Details
* optionsobject

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Update the email for an authenticated userUpdate the phone number for an authenticated userUpdate the password for an authenticated userUpdate the user's metadataUpdate the user's password with a nonce

```
1

const { data, error } = await supabase.auth.updateUser({

2

email: 'new@email.com'

3

})
```

Response

Notes

---

## Retrieve identities linked to a user

`getUserIdentities()`

Gets all the identities linked to a user.

* The user needs to be signed in to call `getUserIdentities()`.

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Returns a list of identities linked to the user

```
1

const { data, error } = await supabase.auth.getUserIdentities()
```

Response

---

## Link an identity to a user

`linkIdentity(credentials)`

Links an oauth identity to an existing user. This method supports the PKCE flow.

* The **Enable Manual Linking** option must be enabled from your [project's authentication settings](/dashboard/project/_/auth/providers).
* The user needs to be signed in to call `linkIdentity()`.
* If the candidate identity is already linked to the existing user or another user, `linkIdentity()` will fail.
* If `linkIdentity` is run in the browser, the user is automatically redirected to the returned URL. On the server, you should handle the redirect.

### Parameters

* credentialsOne of the following options

  Details

  + Option 1SignInWithOAuthCredentials

    Details
  + Option 2SignInWithIdTokenCredentials

    Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Link an identity to a user

```
1

const { data, error } = await supabase.auth.linkIdentity({

2

provider: 'github'

3

})
```

Response

---

## Unlink an identity from a user

`unlinkIdentity(identity)`

Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.

* The **Enable Manual Linking** option must be enabled from your [project's authentication settings](/dashboard/project/_/auth/providers).
* The user needs to be signed in to call `unlinkIdentity()`.
* The user must have at least 2 identities in order to unlink an identity.
* The identity to be unlinked must belong to the user.

### Parameters

* identityUserIdentity

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Unlink an identity

```
1

// retrieve all identities linked to a user

2

const identities = await supabase.auth.getUserIdentities()

3

4

// find the google identity

5

const googleIdentity = identities.find(

6

identity => identity.provider === 'google'

7

)

8

9

// unlink the google identity

10

const { error } = await supabase.auth.unlinkIdentity(googleIdentity)
```

---

## Send a password reauthentication nonce

`reauthenticate()`

Sends a reauthentication OTP to the user's email or phone number. Requires the user to be signed-in.

* This method is used together with `updateUser()` when a user's password needs to be updated.
* If you require your user to reauthenticate before updating their password, you need to enable the **Secure password change** option in your [project's email provider settings](/dashboard/project/_/auth/providers).
* A user is only require to reauthenticate before updating their password if **Secure password change** is enabled and the user **hasn't recently signed in**. A user is deemed recently signed in if the session was created in the last 24 hours.
* This method will send a nonce to the user's email. If the user doesn't have a confirmed email address, the method will send the nonce to the user's confirmed phone number instead.
* After receiving the OTP, include it as the `nonce` in your `updateUser()` call to finalize the password change.

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Send reauthentication nonce

```
1

const { error } = await supabase.auth.reauthenticate()
```

Notes

---

## Resend an OTP

`resend(credentials)`

Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.

* Resends a signup confirmation, email change or phone change email to the user.
* Passwordless sign-ins can be resent by calling the `signInWithOtp()` method again.
* Password recovery emails can be resent by calling the `resetPasswordForEmail()` method again.
* This method will only resend an email or phone OTP to the user if there was an initial signup, email change or phone change request being made(note: For existing users signing in with OTP, you should use `signInWithOtp()` again to resend the OTP).
* You can specify a redirect url when you resend an email link using the `emailRedirectTo` option.

### Parameters

* credentialsOne of the following options

  Details

  + Option 1object

    Details
  + Option 2object

    Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Resend an email signup confirmationResend a phone signup confirmationResend email change emailResend phone change OTP

```
1

const { error } = await supabase.auth.resend({
