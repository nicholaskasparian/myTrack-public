# Source: https://supabase.com/docs/reference/javascript/upsert
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# upsert — Part 11


* paramsOne of the following options

  Details

  + Option 1object

    Details
  + Option 2object

    Details
  + Option 3MFAVerifyTOTPParams
  + Option 4MFAVerifyPhoneParams
  + Option 5MFAVerifyWebauthnParams

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Verify a challenge for a factor

```
1

const { data, error } = await supabase.auth.mfa.verify({

2

factorId: '34e770dd-9ff9-416c-87fa-43b31d7ef225',

3

challengeId: '4034ae6f-a8ce-4fb5-8ee5-69a5863a7c15',

4

code: '123456'

5

})
```

Response

---

## Create and verify a challenge

`challengeAndVerify(params)`

Helper method which creates a challenge and immediately uses the given code to verify against it thereafter. The verification code is provided by the user by entering a code seen in their authenticator app.

* Intended for use with only TOTP factors.
* An [enrolled factor](/docs/reference/javascript/auth-mfa-enroll) is required before invoking `challengeAndVerify()`.
* Executes [`mfa.challenge()`](/docs/reference/javascript/auth-mfa-challenge) and [`mfa.verify()`](/docs/reference/javascript/auth-mfa-verify) in a single step.

### Parameters

* paramsobject

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Create and verify a challenge for a factor

```
1

const { data, error } = await supabase.auth.mfa.challengeAndVerify({

2

factorId: '34e770dd-9ff9-416c-87fa-43b31d7ef225',

3

code: '123456'

4

})
```

Response

---

## Unenroll a factor

`unenroll(params)`

Unenroll removes a MFA factor. A user has to have an `aal2` authenticator level in order to unenroll a `verified` factor.

### Parameters

* paramsMFAUnenrollParams

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Unenroll a factor

```
1

const { data, error } = await supabase.auth.mfa.unenroll({

2

factorId: '34e770dd-9ff9-416c-87fa-43b31d7ef225',

3

})
```

Response

---

## Get Authenticator Assurance Level

`getAuthenticatorAssuranceLevel(jwt?)`

Returns the Authenticator Assurance Level (AAL) for the active session.

* `aal1` (or `null`) means that the user's identity has been verified only with a conventional login (email+password, OTP, magic link, social login, etc.).
* `aal2` means that the user's identity has been verified both with a conventional login and at least one MFA factor.

When called without a JWT parameter, this method is fairly quick (microseconds) and rarely uses the network. When a JWT is provided (useful in server-side environments like Edge Functions where no session is stored), this method will make a network request to validate the user and fetch their MFA factors.

* Authenticator Assurance Level (AAL) is the measure of the strength of an authentication mechanism.
* In Supabase, having an AAL of `aal1` refers to having the 1st factor of authentication such as an email and password or OAuth sign-in while `aal2` refers to the 2nd factor of authentication such as a time-based, one-time-password (TOTP) or Phone factor.
* If the user has a verified factor, the `nextLevel` field will return `aal2`, else, it will return `aal1`.
* An optional `jwt` parameter can be passed to check the AAL level of a specific JWT instead of the current session.

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

Get the AAL details of a sessionGet the AAL details for a specific JWT

```
1

const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

2

const { currentLevel, nextLevel, currentAuthenticationMethods } = data
```

Response

---

## List all factors for current user

`listFactors()`

Returns the list of MFA factors enabled for this user.

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

---

## OAuth Server

The OAuth Server API allows you to build custom OAuth consent screens for your application. Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.

---

## Get authorization details

`getAuthorizationDetails(authorizationId)`

Retrieves details about an OAuth authorization request. Used to display consent information to the user. Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.

This method returns one of two response types:

* `OAuthAuthorizationDetails`: User needs to consent - show consent page with client info
* `OAuthRedirect`: User already consented - redirect immediately to the OAuth client

Use type narrowing to distinguish between the responses:

```
1

if ('authorization_id' in data) {

2

// Show consent page

3

} else {

4

// Redirect to data.redirect_url

5

}
```

### Parameters

* authorizationIdstring

  The authorization ID from the authorization request

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

---

## Approve authorization

`approveAuthorization(authorizationId, options?)`

Approves an OAuth authorization request. Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.

After approval, the user's consent is stored and an authorization code is generated. The response contains a complete redirect URL with the authorization code and state.

### Parameters

* authorizationIdstring

  The authorization ID to approve
* options

  Optional

  object

  Optional parameters

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

---

## Deny authorization

`denyAuthorization(authorizationId, options?)`

Denies an OAuth authorization request. Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.

After denial, the response contains a redirect URL with an OAuth error (access\_denied) to inform the OAuth client that the user rejected the request.

### Parameters

* authorizationIdstring

  The authorization ID to deny
* options

  Optional

  object

  Optional parameters

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

---

## List grants

`listGrants()`

Lists all OAuth grants that the authenticated user has authorized. Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

---

## Revoke grant

`revokeGrant(options)`

Revokes a user's OAuth grant for a specific client. Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.

Revocation marks consent as revoked, deletes active sessions for that OAuth client, and invalidates associated refresh tokens.

### Parameters

* optionsobject

  Revocation options

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

---

## Auth Admin

* Any method under the `supabase.auth.admin` namespace requires a `service_role` key.
* These methods are considered admin methods and should be called on a trusted server. Never expose your `service_role` key in the browser.

Create server-side auth client

```
1

import { createClient } from '@supabase/supabase-js'

2

3

const supabase = createClient(supabase_url, service_role_key, {

4

auth: {

5

autoRefreshToken: false,

6

persistSession: false

