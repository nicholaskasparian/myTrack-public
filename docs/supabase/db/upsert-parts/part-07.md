# Source: https://supabase.com/docs/reference/javascript/upsert
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# upsert — Part 7

* By default, the user needs to verify their email address before logging in. To turn this off, disable **Confirm email** in [your project](/dashboard/project/_/auth/providers).
* **Confirm email** determines if users need to confirm their email address after signing up.
  + If **Confirm email** is enabled, a `user` is returned but `session` is null.
  + If **Confirm email** is disabled, both a `user` and a `session` are returned.
* When the user confirms their email address, they are redirected to the [`SITE_URL`](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) by default. You can modify your `SITE_URL` or add additional redirect URLs in [your project](/dashboard/project/_/auth/url-configuration).
* If signUp() is called for an existing confirmed user:
  + When both **Confirm email** and **Confirm phone** (even when phone provider is disabled) are enabled in [your project](/dashboard/project/_/auth/providers), an obfuscated/fake user object is returned.
  + When either **Confirm email** or **Confirm phone** (even when phone provider is disabled) is disabled, the error message, `User already registered` is returned.
* To fetch the currently logged-in user, refer to [`getUser()`](/docs/reference/javascript/auth-getuser).

### Parameters

* credentialsSignUpWithPasswordCredentials

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Sign up with an email and passwordSign up with a phone number and password (SMS)Sign up with a phone number and password (whatsapp)Sign up with additional user metadataSign up with a redirect URL

```
1

const { data, error } = await supabase.auth.signUp({

2

email: 'example@email.com',

3

password: 'example-password',

4

})
```

Response

---

## Listen to auth events

`onAuthStateChange(callback)`

Receive a notification every time an auth event happens. Safe to use without an async function as callback.

* Subscribes to important events occurring on the user's session.
* Use on the frontend/client. It is less useful on the server.
* Events are emitted across tabs to keep your application's UI up-to-date. Some events can fire very frequently, based on the number of tabs open. Use a quick and efficient callback function, and defer or debounce as many operations as you can to be performed outside of the callback.
* **Important:** A callback can be an `async` function and it runs synchronously during the processing of the changes causing the event. You can easily create a dead-lock by using `await` on a call to another method of the Supabase library.
  + Avoid using `async` functions as callbacks.
  + Limit the number of `await` calls in `async` callbacks.
  + Do not use other Supabase functions in the callback function. If you must, dispatch the functions once the callback has finished executing. Use this as a quick way to achieve this:

    ```
    1

    supabase.auth.onAuthStateChange((event, session) => {

    2

    setTimeout(async () => {

    3

    // await on other Supabase function here

    4

    // this runs right after the callback has finished

    5

    }, 0)

    6

    })
    ```
* Emitted events:
  + `INITIAL_SESSION`
    - Emitted right after the Supabase client is constructed and the initial session from storage is loaded.
  + `SIGNED_IN`
    - Emitted each time a user session is confirmed or re-established, including on user sign in and when refocusing a tab.
    - Avoid making assumptions as to when this event is fired, this may occur even when the user is already signed in. Instead, check the user object attached to the event to see if a new user has signed in and update your application's UI.
    - This event can fire very frequently depending on the number of tabs open in your application.
  + `SIGNED_OUT`
    - Emitted when the user signs out. This can be after:
      * A call to `supabase.auth.signOut()`.
      * After the user's session has expired for any reason:
        + User has signed out on another device.
        + The session has reached its timebox limit or inactivity timeout.
        + User has signed in on another device with single session per user enabled.
        + Check the [User Sessions](/docs/guides/auth/sessions) docs for more information.
    - Use this to clean up any local storage your application has associated with the user.
  + `TOKEN_REFRESHED`
    - Emitted each time a new access and refresh token are fetched for the signed in user.
    - It's best practice and highly recommended to extract the access token (JWT) and store it in memory for further use in your application.
      * Avoid frequent calls to `supabase.auth.getSession()` for the same purpose.
    - There is a background process that keeps track of when the session should be refreshed so you will always receive valid tokens by listening to this event.
    - The frequency of this event is related to the JWT expiry limit configured on your project.
  + `USER_UPDATED`
    - Emitted each time the `supabase.auth.updateUser()` method finishes successfully. Listen to it to update your application's UI based on new profile information.
  + `PASSWORD_RECOVERY`
    - Emitted instead of the `SIGNED_IN` event when the user lands on a page that includes a password recovery link in the URL.
    - Use it to show a UI to the user where they can [reset their password](/docs/guides/auth/passwords#resetting-a-users-password-forgot-password).

### Parameters

* callbackfunction

  A callback function to be invoked when an auth event happens.

  Details

### Return Type

object

Details

Listen to auth changesListen to sign outStore OAuth provider tokens on sign inUse React Context for the User's sessionListen to password recovery eventsListen to sign inListen to token refreshListen to user updates

```
1

const { data } = supabase.auth.onAuthStateChange((event, session) => {

2

console.log(event, session)

3

4

if (event === 'INITIAL_SESSION') {

5

// handle initial session

6

} else if (event === 'SIGNED_IN') {

7

// handle sign in event

8

} else if (event === 'SIGNED_OUT') {

9

// handle sign out event

10

} else if (event === 'PASSWORD_RECOVERY') {

11

// handle password recovery event

12

} else if (event === 'TOKEN_REFRESHED') {

13

// handle token refreshed event

14

} else if (event === 'USER_UPDATED') {

15

// handle user updated event

16

}

17

})

18

19

// call unsubscribe to remove the callback

20

data.subscription.unsubscribe()
```

---

## Create an anonymous user

`signInAnonymously(credentials?)`

Creates a new anonymous user.

* Returns an anonymous user
* It is recommended to set up captcha for anonymous sign-ins to prevent abuse. You can pass in the captcha token in the `options` param.

### Parameters

* credentials

  Optional

  SignInAnonymouslyCredentials

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Create an anonymous userCreate an anonymous user with custom user metadata

```
1

const { data, error } = await supabase.auth.signInAnonymously({

2

options: {

3

captchaToken

4

}

5

});
```

Response

---

## Sign in a user

`signInWithPassword(credentials)`

Log in an existing user with an email and password or phone and password.

Be aware that you may get back an error message that will not distinguish between the cases where the account does not exist or that the email/phone and password combination is wrong or that the account can only be accessed via social login.

* Requires either an email and password or a phone number and password.

### Parameters

* credentialsSignInWithPasswordCredentials

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Sign in with email and passwordSign in with phone and password

```
1

const { data, error } = await supabase.auth.signInWithPassword({

2

email: 'example@email.com',

3

password: 'example-password',

4

})
```

Response

---

## Sign in with ID token (native sign-in)

`signInWithIdToken(credentials)`

Allows signing in with an OIDC ID token. The authentication provider used should be enabled and configured.

* Use an ID token to sign in.
* Especially useful when implementing sign in using native platform dialogs in mobile or desktop apps using Sign in with Apple or Sign in with Google on iOS and Android.
* You can also use Google's [One Tap](https://developers.google.com/identity/gsi/web/guides/display-google-one-tap) and [Automatic sign-in](https://developers.google.com/identity/gsi/web/guides/automatic-sign-in-sign-out) via this API.

### Parameters

* credentialsSignInWithIdTokenCredentials

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Sign In using ID Token

```
1

const { data, error } = await supabase.auth.signInWithIdToken({

2

provider: 'google',

3

token: 'your-id-token'

4

})
```

Response

---

## Sign in a user through OTP

`signInWithOtp(credentials)`

Log in a user using magiclink or a one-time password (OTP).

If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent. If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent. If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.

Be aware that you may get back an error message that will not distinguish between the cases where the account does not exist or, that the account can only be accessed via social login.

Do note that you will need to configure a Whatsapp sender on Twilio if you are using phone sign in with the 'whatsapp' channel. The whatsapp channel is not supported on other providers at this time. This method supports PKCE when an email is passed.

* Requires either an email or phone number.
* This method is used for passwordless sign-ins where a OTP is sent to the user's email or phone number.
* If the user doesn't exist, `signInWithOtp()` will signup the user instead. To restrict this behavior, you can set `shouldCreateUser` in `SignInWithPasswordlessCredentials.options` to `false`.
* If you're using an email, you can configure whether you want the user to receive a magiclink or a OTP.
* If you're using phone, you can configure whether you want the user to receive a OTP.
* The magic link's destination URL is determined by the [`SITE_URL`](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls).
* See [redirect URLs and wildcards](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) to add additional redirect URLs to your project.
* Magic links and OTPs share the same implementation. To send users a one-time code instead of a magic link, [modify the magic link email template](/dashboard/project/_/auth/templates) to include `{{ .Token }}` instead of `{{ .ConfirmationURL }}`.
* See our [Twilio Phone Auth Guide](/docs/guides/auth/phone-login?showSMSProvider=Twilio) for details about configuring WhatsApp sign in.

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

Sign in with emailSign in with SMS OTPSign in with WhatsApp OTP

```
1

const { data, error } = await supabase.auth.signInWithOtp({

2

email: 'example@email.com',

3

options: {

4

emailRedirectTo: 'https://example.com/welcome'

5

}

6
