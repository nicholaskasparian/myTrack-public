# Source: https://supabase.com/docs/reference/javascript/upsert
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# upsert — Part 10


2

type: 'signup',

3

email: 'email@example.com',

4

options: {

5

emailRedirectTo: 'https://example.com/welcome'

6

}

7

})
```

Notes

---

## Set the session data

`setSession(currentSession)`

Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session. If the refresh token or access token in the current session is invalid, an error will be thrown.

* This method sets the session using an `access_token` and `refresh_token`.
* If successful, a `SIGNED_IN` event is emitted.

### Parameters

* currentSessionobject

  The current session that minimally contains an access token and refresh token.

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Set the session

```
1

const { data, error } = await supabase.auth.setSession({

2

access_token,

3

refresh_token

4

})
```

Response

Notes

---

## Exchange an auth code for a session

`exchangeCodeForSession(authCode)`

Log in an existing user by exchanging an Auth Code issued during the PKCE flow.

* Used when `flowType` is set to `pkce` in client options.

### Parameters

* authCodestring

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Exchange Auth Code

```
1

supabase.auth.exchangeCodeForSession('34e770dd-9ff9-416c-87fa-43b31d7ef225')
```

Response

---

## Start auto-refresh session (non-browser)

`startAutoRefresh()`

Starts an auto-refresh process in the background. The session is checked every few seconds. Close to the time of expiration a process is started to refresh the session. If refreshing fails it will be retried for as long as necessary.

If you set the GoTrueClientOptions#autoRefreshToken you don't need to call this function, it will be called for you.

On browsers the refresh process works only when the tab/window is in the foreground to conserve resources as well as prevent race conditions and flooding auth with requests. If you call this method any managed visibility change callback will be removed and you must manage visibility changes on your own.

On non-browser platforms the refresh process works *continuously* in the background, which may not be desirable. You should hook into your platform's foreground indication mechanism and call these methods appropriately to conserve resources.

#stopAutoRefresh

* Only useful in non-browser environments such as React Native or Electron.
* The Supabase Auth library automatically starts and stops proactively refreshing the session when a tab is focused or not.
* On non-browser platforms, such as mobile or desktop apps built with web technologies, the library is not able to effectively determine whether the application is *focused* or not.
* To give this hint to the application, you should be calling this method when the app is in focus and calling `supabase.auth.stopAutoRefresh()` when it's out of focus.

### Return Type

Promise<void>

Start and stop auto refresh in React Native

```
1

import { AppState } from 'react-native'

2

3

// make sure you register this only once!

4

AppState.addEventListener('change', (state) => {

5

if (state === 'active') {

6

supabase.auth.startAutoRefresh()

7

} else {

8

supabase.auth.stopAutoRefresh()

9

}

10

})
```

---

## Stop auto-refresh session (non-browser)

`stopAutoRefresh()`

Stops an active auto refresh process running in the background (if any).

If you call this method any managed visibility change callback will be removed and you must manage visibility changes on your own.

See #startAutoRefresh for more details.

* Only useful in non-browser environments such as React Native or Electron.
* The Supabase Auth library automatically starts and stops proactively refreshing the session when a tab is focused or not.
* On non-browser platforms, such as mobile or desktop apps built with web technologies, the library is not able to effectively determine whether the application is *focused* or not.
* When your application goes in the background or out of focus, call this method to stop the proactive refreshing of the session.

### Return Type

Promise<void>

Start and stop auto refresh in React Native

```
1

import { AppState } from 'react-native'

2

3

// make sure you register this only once!

4

AppState.addEventListener('change', (state) => {

5

if (state === 'active') {

6

supabase.auth.startAutoRefresh()

7

} else {

8

supabase.auth.stopAutoRefresh()

9

}

10

})
```

---

## Initialize client session

`initialize()`

Initializes the client session either from the url or from storage. This method is automatically called when instantiating the client, but should also be called manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).

### Return Type

Promise<InitializeResult>

Details

---

## Auth MFA

This section contains methods commonly used for Multi-Factor Authentication (MFA) and are invoked behind the `supabase.auth.mfa` namespace.

Currently, there is support for time-based one-time password (TOTP) and phone verification code as the 2nd factor. Recovery codes are not supported but users can enroll multiple factors, with an upper limit of 10.

Having a 2nd factor for recovery frees the user of the burden of having to store their recovery codes somewhere. It also reduces the attack surface since multiple recovery codes are usually generated compared to just having 1 backup factor.

Learn more about implementing MFA in your application [in the MFA guide](https://supabase.com/docs/guides/auth/auth-mfa#overview).

---

## Enroll a factor

`enroll(params)`

Starts the enrollment process for a new Multi-Factor Authentication (MFA) factor. This method creates a new `unverified` factor. To verify a factor, present the QR code or secret to the user and ask them to add it to their authenticator app. The user has to enter the code from their authenticator app to verify it.

Upon verifying a factor, all other sessions are logged out and the current session's authenticator level is promoted to `aal2`.

* Use `totp` or `phone` as the `factorType` and use the returned `id` to create a challenge.
* To create a challenge, see [`mfa.challenge()`](/docs/reference/javascript/auth-mfa-challenge).
* To verify a challenge, see [`mfa.verify()`](/docs/reference/javascript/auth-mfa-verify).
* To create and verify a TOTP challenge in a single step, see [`mfa.challengeAndVerify()`](/docs/reference/javascript/auth-mfa-challengeandverify).
* To generate a QR code for the `totp` secret in Next.js, you can do the following:

```
1

<Image src={data.totp.qr_code} alt={data.totp.uri} layout="fill"></Image>
```

* The `challenge` and `verify` steps are separated when using Phone factors as the user will need time to receive and input the code obtained from the SMS in challenge.

### Parameters

* paramsOne of the following options

  Details

  + Option 1object

    Details
  + Option 2object

    Details
  + Option 3object

    Details
  + Option 4MFAEnrollTOTPParams
  + Option 5MFAEnrollPhoneParams
  + Option 6MFAEnrollWebauthnParams

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Enroll a time-based, one-time password (TOTP) factorEnroll a Phone Factor

```
1

const { data, error } = await supabase.auth.mfa.enroll({

2

factorType: 'totp',

3

friendlyName: 'your_friendly_name'

4

})

5

6

// Use the id to create a challenge.

7

// The challenge can be verified by entering the code generated from the authenticator app.

8

// The code will be generated upon scanning the qr_code or entering the secret into the authenticator app.

9

const { id, type, totp: { qr_code, secret, uri }, friendly_name } = data

10

const challenge = await supabase.auth.mfa.challenge({ factorId: id });
```

Response

---

## Create a challenge

`challenge(params)`

Prepares a challenge used to verify that a user has access to a MFA factor.

* An [enrolled factor](/docs/reference/javascript/auth-mfa-enroll) is required before creating a challenge.
* To verify a challenge, see [`mfa.verify()`](/docs/reference/javascript/auth-mfa-verify).
* A phone factor sends a code to the user upon challenge. The channel defaults to `sms` unless otherwise specified.

### Parameters

* paramsOne of the following options

  Details

  + Option 1object

    Details
  + Option 2object

    Details
  + Option 3object

    Details
  + Option 4MFAChallengeTOTPParams
  + Option 5MFAChallengePhoneParams
  + Option 6MFAChallengeWebauthnParams

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Create a challenge for a factorCreate a challenge for a phone factorCreate a challenge for a phone factor (WhatsApp)

```
1

const { data, error } = await supabase.auth.mfa.challenge({

2

factorId: '34e770dd-9ff9-416c-87fa-43b31d7ef225'

3

})
```

Response

---

## Verify a challenge

`verify(params)`

Verifies a code against a challenge. The verification code is provided by the user by entering a code seen in their authenticator app.

* To verify a challenge, please [create a challenge](/docs/reference/javascript/auth-mfa-challenge) first.

### Parameters
