# Source: https://supabase.com/docs/reference/javascript/select
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# functions — Part 8


})
```

Response

Notes

---

## Sign in a user through OAuth

`signInWithOAuth(credentials)`

Log in an existing user via a third-party provider. This method supports the PKCE flow.

* This method is used for signing in using [Social Login (OAuth) providers](/docs/guides/auth#configure-third-party-providers).
* It works by redirecting your application to the provider's authorization screen, before bringing back the user to your app.

### Parameters

* credentialsSignInWithOAuthCredentials

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Sign in using a third-party providerSign in using a third-party provider with redirectSign in with scopes and access provider tokens

```
1

const { data, error } = await supabase.auth.signInWithOAuth({

2

provider: 'github'

3

})
```

Response

---

## Sign in a user through SSO

`signInWithSSO(params)`

Attempts a single-sign on using an enterprise Identity Provider. A successful SSO attempt will redirect the current page to the identity provider authorization page. The redirect URL is implementation and SSO protocol specific.

You can use it by providing a SSO domain. Typically you can extract this domain by asking users for their email address. If this domain is registered on the Auth instance the redirect will use that organization's currently active SSO Identity Provider for the login.

If you have built an organization-specific login page, you can use the organization's SSO Identity Provider UUID directly instead.

* Before you can call this method you need to [establish a connection](/docs/guides/auth/sso/auth-sso-saml#managing-saml-20-connections) to an identity provider. Use the [CLI commands](/docs/reference/cli/supabase-sso) to do this.
* If you've associated an email domain to the identity provider, you can use the `domain` property to start a sign-in flow.
* In case you need to use a different way to start the authentication flow with an identity provider, you can use the `providerId` property. For example:
  + Mapping specific user email addresses with an identity provider.
  + Using different hints to identity the identity provider to be used by the user, like a company-specific page, IP address or other tracking information.

### Parameters

* paramsOne of the following options

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

Sign in with email domainSign in with provider UUID

```
1

// You can extract the user's email domain and use it to trigger the

2

// authentication flow with the correct identity provider.

3

4

const { data, error } = await supabase.auth.signInWithSSO({

5

domain: 'company.com'

6

})

7

8

if (data?.url) {

9

// redirect the user to the identity provider's authentication flow

10

window.location.href = data.url

11

}
```

---

## Sign in a user through Web3 (Solana, Ethereum)

`signInWithWeb3(credentials)`

Signs in a user by verifying a message signed by the user's private key. Supports Ethereum (via Sign-In-With-Ethereum) & Solana (Sign-In-With-Solana) standards, both of which derive from the EIP-4361 standard With slight variation on Solana's side.

* Uses a Web3 (Ethereum, Solana) wallet to sign a user in.
* Read up on the [potential for abuse](/docs/guides/auth/auth-web3#potential-for-abuse) before using it.

### Parameters

* credentialsOne of the following options

  Details

  + Option 1One of the following options

    Details

    - Option 1object

      Details
    - Option 2object

      Details
  + Option 2One of the following options

    Details

    - Option 1object

      Details
    - Option 2object

      Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Sign in with Solana or Ethereum (Window API)Sign in with Ethereum (Message and Signature)Sign in with Solana (Brave)Sign in with Solana (Wallet Adapter)

```
1

// uses window.ethereum for the wallet

2

const { data, error } = await supabase.auth.signInWithWeb3({

3

chain: 'ethereum',

4

statement: 'I accept the Terms of Service at https://example.com/tos'

5

})

6

7

// uses window.solana for the wallet

8

const { data, error } = await supabase.auth.signInWithWeb3({

9

chain: 'solana',

10

statement: 'I accept the Terms of Service at https://example.com/tos'

11

})
```

---

## Get user claims from verified JWT

`getClaims(jwt?, options)`

Extracts the JWT claims present in the access token by first verifying the JWT against the server's JSON Web Key Set endpoint `/.well-known/jwks.json` which is often cached, resulting in significantly faster responses. Prefer this method over #getUser which always sends a request to the Auth server for each JWT.

If the project is not using an asymmetric JWT signing key (like ECC or RSA) it always sends a request to the Auth server (similar to #getUser) to verify the JWT.

* Parses the user's [access token](/docs/guides/auth/sessions#access-token-jwt-claims) as a [JSON Web Token (JWT)](/docs/guides/auth/jwts) and returns its components if valid and not expired.
* If your project is using asymmetric JWT signing keys, then the verification is done locally usually without a network request using the [WebCrypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).
* A network request is sent to your project's JWT signing key discovery endpoint `https://project-id.supabase.co/auth/v1/.well-known/jwks.json`, which is cached locally. If your environment is ephemeral, such as a Lambda function that is destroyed after every request, a network request will be sent for each new invocation. Supabase provides a network-edge cache providing fast responses for these situations.
* If the user's access token is about to expire when calling this function, the user's session will first be refreshed before validating the JWT.
* If your project is using a symmetric secret to sign the JWT, it always sends a request similar to `getUser()` to validate the JWT at the server before returning the decoded token. This is also used if the WebCrypto API is not available in the environment. Make sure you polyfill it in such situations.
* The returned claims can be customized per project using the [Custom Access Token Hook](/docs/guides/auth/auth-hooks/custom-access-token-hook).

### Parameters

* jwt

  Optional

  string

  An optional specific JWT you wish to verify, not the one you can obtain from #getSession.
* optionsobject

  Various additional options that allow you to customize the behavior of this method.

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details
* Option 3object

  Details

Get JWT claims, header and signature

```
1

const { data, error } = await supabase.auth.getClaims()
```

Response

---

## Sign out a user

`signOut(options)`

Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.

For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`. There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.

If using `others` scope, no `SIGNED_OUT` event is fired!

* In order to use the `signOut()` method, the user needs to be signed in first.
* By default, `signOut()` uses the global scope, which signs out all other sessions that the user is logged into as well. Customize this behavior by passing a scope parameter.
* Since Supabase Auth uses JWTs for authentication, the access token JWT will be valid until it's expired. When the user signs out, Supabase revokes the refresh token and deletes the JWT from the client-side. This does not revoke the JWT and it will still be valid until it expires.

### Parameters

* optionsSignOut

  Details

### Return Type

Promise<object>

Details

Sign out (all sessions)Sign out (current session)Sign out (other sessions)

```
1

const { error } = await supabase.auth.signOut()
```

---

## Send a password reset request

`resetPasswordForEmail(email, options)`

Sends a password reset request to an email address. This method supports the PKCE flow.

* The password reset flow consist of 2 broad steps: (i) Allow the user to login via the password reset link; (ii) Update the user's password.
* The `resetPasswordForEmail()` only sends a password reset link to the user's email. To update the user's password, see [`updateUser()`](/docs/reference/javascript/auth-updateuser).
* A `PASSWORD_RECOVERY` event will be emitted when the password recovery link is clicked. You can use [`onAuthStateChange()`](/docs/reference/javascript/auth-onauthstatechange) to listen and invoke a callback function on these events.
* When the user clicks the reset link in the email they are redirected back to your application. You can configure the URL that the user is redirected to with the `redirectTo` parameter. See [redirect URLs and wildcards](/docs/guides/auth/redirect-urls#use-wildcards-in-redirect-urls) to add additional redirect URLs to your project.
* After the user has been redirected successfully, prompt them for a new password and call `updateUser()`:

```
1

const { data, error } = await supabase.auth.updateUser({

2

password: new_password

3

})
```

### Parameters

* emailstring

  The email address of the user.
* optionsobject

  Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

  Details

Reset passwordReset password (React)

```
1

const { data, error } = await supabase.auth.resetPasswordForEmail(email, {

2

redirectTo: 'https://example.com/update-password',

3

})
```

Response

---

## Verify and log in through OTP

`verifyOtp(params)`

Log in a user given a User supplied OTP or TokenHash received through mobile or email.

* The `verifyOtp` method takes in different verification types.
* If a phone number is used, the type can either be:
  1. `sms` – Used when verifying a one-time password (OTP) sent via SMS during sign-up or sign-in.
  2. `phone_change` – Used when verifying an OTP sent to a new phone number during a phone number update process.
* If an email address is used, the type can be one of the following (note: `signup` and `magiclink` types are deprecated):
  1. `email` – Used when verifying an OTP sent to the user's email during sign-up or sign-in.
  2. `recovery` – Used when verifying an OTP sent for account recovery, typically after a password reset request.
  3. `invite` – Used when verifying an OTP sent as part of an invitation to join a project or organization.
  4. `email_change` – Used when verifying an OTP sent to a new email address during an email update process.
* The verification type used should be determined based on the corresponding auth method called before `verifyOtp` to sign up / sign-in a user.
* The `TokenHash` is contained in the [email templates](/docs/guides/auth/auth-email-templates) and can be used to sign in. You may wish to use the hash for the PKCE flow for Server Side Auth. Read [the Password-based Auth guide](/docs/guides/auth/passwords) for more details.

### Parameters

* paramsOne of the following options

  Details

  + Option 1VerifyMobileOtpParams

    Details
  + Option 2VerifyEmailOtpParams

    Details
  + Option 3VerifyTokenHashParams

    Details

### Return Type

Promise<One of the following options>

Details

* Option 1object

  Details
* Option 2object

