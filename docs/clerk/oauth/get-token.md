# Source: https://clerk.com/docs/references/backend/user/get-user-oauth-access-token
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# getUserOauthAccessToken()

1. [Parameters](#parameters)
2. [Example](#example)
3. [Backend API (BAPI) endpoint](#backend-api-bapi-endpoint)

Copy as markdownCopy as markdownOpenOpen

Retrieves the corresponding OAuth access token⁠ for a user that has previously authenticated with a particular OAuth provider. Returns a [`PaginatedResourceResponse`](/docs/reference/backend/types/paginated-resource-response) object with a `data` property that contains an array of [`OauthAccessToken`](/docs/reference/backend/types/backend-oauth-access-token) objects, and a `totalCount` property that indicates the total number of OAuth access tokens in the system for the specified user and provider.

```
function getUserOauthAccessToken(
  userId: string,
  provider: `${OAuthProvider}`,
): Promise<PaginatedResourceResponse<OauthAccessToken[]>>
```

## [Parameters](#parameters)

* Name
  :   `userId`

  Type
  :   `string`

  Description
  :   The ID of the user to retrieve the OAuth access token for.
* Name
  :   `provider`

  Type
  :   `${OAuthProvider}`

  Description
  :   The OAuth provider to retrieve the access token for. If using a custom OAuth provider, prefix the provider name with `custom_` (e.g., `custom_foo`).

## [Example](#example)

Note

Using `clerkClient` varies based on your framework. Refer to the [JS Backend SDK overview](/docs/js-backend/getting-started/quickstart) for usage details, including guidance on [how to access the `userId` and other properties](/docs/js-backend/getting-started/quickstart#get-the-user-id-and-other-properties).

```
const userId = 'user_123'

const provider = 'google'

const response = await clerkClient.users.getUserOauthAccessToken(userId, provider)
```

You can also explore [the example](/docs/guides/configure/auth-strategies/social-connections/overview#get-an-o-auth-access-token-for-a-social-provider) that demonstrates how this method retrieves a social provider's OAuth access token, enabling access to user data from both the provider and Clerk.

## [Backend API (BAPI) endpoint](#backend-api-bapi-endpoint)

This method in the SDK is a wrapper around the BAPI endpoint `GET/users/{user_id}/oauth_access_tokens/{provider}`. See the [BAPI reference⁠](/docs/reference/backend-api/tag/users/get/users/%7Buser_id%7D/oauth_access_tokens/%7Bprovider%7D) for more information.

## Feedback

Last updated on Mar 24, 2026

[Edit on GitHub](https://github.com/clerk/clerk-docs/edit/main/docs/reference/backend/user/get-user-oauth-access-token.mdx)
