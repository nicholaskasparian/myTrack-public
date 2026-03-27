# Source: https://clerk.com/docs/references/backend/user/get-user
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# `getUser()`

1. [Parameters](#parameters)
2. [Example](#example)
3. [Backend API (BAPI) endpoint](#backend-api-bapi-endpoint)

Copy as markdownCopy as markdownOpenOpen

Retrieves a single [`User`](/docs/reference/backend/types/backend-user) by their ID, if the ID is valid.

```
function getUser(userId: string): Promise<User>
```

## [Parameters](#parameters)

* Name
  :   `userId`

  Type
  :   `string`

  Description
  :   The ID of the user to retrieve.

## [Example](#example)

Note

Using `clerkClient` varies based on your framework. Refer to the [JS Backend SDK overview](/docs/js-backend/getting-started/quickstart) for usage details, including guidance on [how to access the `userId` and other properties](/docs/js-backend/getting-started/quickstart#get-the-user-id-and-other-properties).

```
const userId = 'user_123'

const response = await clerkClient.users.getUser(userId)
```

## [Backend API (BAPI) endpoint](#backend-api-bapi-endpoint)

This method in the SDK is a wrapper around the BAPI endpoint `GET/users/{user_id}`. See the [BAPI reference⁠](/docs/reference/backend-api/tag/users/get/users/%7Buser_id%7D) for more information.

## Feedback

Last updated on Mar 24, 2026

[Edit on GitHub](https://github.com/clerk/clerk-docs/edit/main/docs/reference/backend/user/get-user.mdx)
