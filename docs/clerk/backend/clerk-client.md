# Source: https://clerk.com/docs/references/backend/overview
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# Clerk's JavaScript Backend SDK

1. [Installation](#installation)
2. [Resources](#resources)
   1. [Users](#users)
   2. [Organizations](#organizations)
   3. [Billing](#billing)
   4. [Allowlist identifiers](#allowlist-identifiers)
   5. [API keys](#api-keys)
   6. [Domains](#domains)
   7. [Sessions](#sessions)
   8. [Clients](#clients)
   9. [Invitations](#invitations)
   10. [Redirect URLs](#redirect-urls)
   11. [Email addresses](#email-addresses)
   12. [Phone numbers](#phone-numbers)
   13. [SAML connections](#saml-connections)
   14. [Sign-in tokens](#sign-in-tokens)
   15. [Testing tokens](#testing-tokens)
   16. [M2M tokens](#m2-m-tokens)
   17. [OAuth applications](#o-auth-applications)
3. [Authentication utilities](#authentication-utilities)

Copy as markdownCopy as markdownOpenOpen

Clerk's JavaScript Backend SDK exposes the [Backend API⁠](/docs/reference/backend-api) resources and low-level authentication utilities for JavaScript environments, making it easier to integrate Clerk into your server-side applications.

## [Installation](#installation)

Follow the instructions in the [quickstart](/docs/getting-started/quickstart) to add the JS Backend SDK to your project.

## [Resources](#resources)

The SDK is organized around resources, such as **Users** and **Organizations**. Each resource provides a set of operations (for example, creating, listing, or updating) that map directly to the Backend API. Each section below highlights the primary resources available in the SDK. For a complete list of resources and operations, see the [Backend API reference⁠](/docs/reference/backend-api).

### [Users](#users)

The **User** resource provides operations for creating, retrieving, and managing users within your application. Most operations return, or work directly with, the Backend [`User`](/docs/reference/backend/types/backend-user) object, which represents a user who has successfully signed up to your application. It holds information about a user, such as their unique identifier, name, email addresses, phone numbers, and more.

### [Organizations](#organizations)

The **Organization** resource provides operations for creating, retrieving, and managing Organizations within your application. Most operations return, or work directly with, the following Backend objects:

* [`Organization`](/docs/reference/backend/types/backend-organization) object holds information about an Organization.
* [`OrganizationInvitation`](/docs/reference/backend/types/backend-organization-invitation) object is the model around an Organization invitation.
* [`OrganizationMembership`](/docs/reference/backend/types/backend-organization-membership) object is the model around an Organization membership entity and describes the relationship between users and Organizations.

### [Billing](#billing)

The **Billing** resource provides operations for creating and managing Subscription Plans and Features within your application. Most operations return, or work directly with, the following Backend objects:

* [`CommerceSubscription`](/docs/reference/backend/types/commerce-subscription) object holds information about a Subscription, as well as methods for managing it.
* [`CommerceSubscriptionItem`](/docs/reference/backend/types/commerce-subscription-item) object holds information about a Subscription Item, as well as methods for managing it.
* [`CommercePlan`](/docs/reference/backend/types/commerce-plan) object holds information about a Plan, as well as methods for managing it.
* [`Feature`](/docs/reference/backend/types/feature) object represents a Feature of a Subscription Plan.

### [Allowlist identifiers](#allowlist-identifiers)

The **Allowlist Identifier** resource allows you to control who can sign up to your application, by restricting access based on the user's email address or phone number. Most operations return, or work directly with, the Backend [`AllowlistIdentifier`](/docs/reference/backend/types/backend-allowlist-identifier) object, which represents an identifier that has been added to the allowlist of your application.

### [API keys](#api-keys)

The **API Key** resource allows you to manage API keys for your application. Most operations return, or work directly with, the Backend [`APIKey`](/docs/reference/backend/types/backend-api-key) object.

### [Domains](#domains)

The **Domain** resource allows you to manage the domains associated with your Clerk instance. Each domain contains information about the URLs where Clerk operates and the required CNAME targets.

### [Sessions](#sessions)

The **Session** resource provides operations for creating, retrieving, and managing sessions within your application. Sessions are created when a user successfully goes through the sign-in or sign-up flows. Most operations return, or work directly with, the Backend [`Session`](/docs/reference/backend/types/backend-session) object, which is an abstraction over an HTTP session and models the period of information exchange between a user and the server.

### [Clients](#clients)

The **Client** resource provides operations for creating, retrieving, and managing clients within your application. Most operations return, or work directly with, the Backend [`Client`](/docs/reference/backend/types/backend-client) object, which tracks authenticated sessions for a given device or software accessing your application, such as your web browser, native application, or Chrome Extension.

### [Invitations](#invitations)

The **Invitation** resource allows you to manage invitations for your application. Invitations allow you to invite someone to sign up to your application, via email. Most operations return, or work directly with, the Backend [`Invitation`](/docs/reference/backend/types/backend-invitation) object, which represents an invitation that has been sent to a potential user.

### [Redirect URLs](#redirect-urls)

The **Redirect URL** resource allows you to manage the redirect URLs associated with your Clerk instance. Redirect URLs are whitelisted URLs that facilitate secure authentication flows in native applications, such as React Native or Expo. In these contexts, Clerk ensures that security-critical nonces are passed only to the whitelisted URLs. Most operations return, or work directly with, the Backend [`RedirectURL`](/docs/reference/backend/types/backend-redirect-url) object, which holds information about a redirect URL.

### [Email addresses](#email-addresses)

The **Email Address** resource allows you to manage email addresses associated with your users. Email addresses are one of the identifiers used to provide identification for users. They must be verified to ensure that they are assigned to their rightful owners. Most operations return, or work directly with, the Backend [`EmailAddress`](/docs/reference/backend/types/backend-email-address) object, which holds all necessary state around the verification process.

### [Phone numbers](#phone-numbers)

The **Phone Number** resource allows you to manage phone numbers associated with your users. Phone numbers can be used as a proof of identification for users, or simply as a means of contacting users. They must be verified to ensure that they are assigned to the rightful owners. Most operations return, or work directly with, the Backend [`PhoneNumber`](/docs/reference/backend/types/backend-phone-number) object, which holds all necessary state around the verification process.

### [SAML connections](#saml-connections)

The **SAML Connection** resource allows you to manage SAML connections associated with your Organizations. A SAML Connection holds configuration data required for facilitating a SAML SSO flow between your Clerk Instance (SP) and a particular SAML IdP. Most operations return, or work directly with, the Backend [`SamlConnection`](/docs/reference/backend/types/backend-saml-connection) object, which holds information about a SAML connection for an Organization.

### [Sign-in tokens](#sign-in-tokens)

The **Sign-in Token** resource allows you to create and manage sign-in tokens for your application. Sign-in tokens are JWTs that can be used to sign in to an application without specifying any credentials. A sign-in token can be used at most once and can be consumed from the Frontend API using the `ticket` strategy.

### [Testing tokens](#testing-tokens)

The **Testing Token** resource allows you to create and manage [testing tokens](/docs/guides/development/testing/overview#testing-tokens) for your application. Testing tokens allow you to bypass bot detection mechanisms that protect Clerk applications from malicious bots, ensuring your end-to-end test suites run smoothly. Without Testing tokens, you may encounter "Bot traffic detected" errors in your requests.

### [M2M tokens](#m2-m-tokens)

The **M2M Token** resource allows you to create and manage [machine-to-machine (M2M) tokens](/docs/guides/development/machine-auth/m2m-tokens) for your application. M2M tokens allow you to manage authentication between machines. It is intended primarily as a method for authenticating requests between different backend services within your own infrastructure.

### [OAuth applications](#o-auth-applications)

The **OAuth Application** resource allows you to create and manage OAuth applications for your Clerk instance. OAuth applications contain data for clients using Clerk as an OAuth2 identity provider. Most operations return, or work directly with, the Backend [`OAuthApplication`](/docs/reference/backend/types/backend-oauth-application) object, which holds information about an OAuth application.

## [Authentication utilities](#authentication-utilities)

In addition to the resources listed above, the JS Backend SDK also provides low-level authentication utilities that can be used to verify Clerk-generated tokens and authenticate requests from your frontend:

* [`authenticateRequest()`](/docs/reference/backend/authenticate-request): Authenticates a token passed from the frontend.
* [`verifyToken()`](/docs/reference/backend/verify-token): Verifies a Clerk-generated token signature.
* [`verifyWebhook()`](/docs/reference/backend/verify-webhook): Verifies the authenticity of a webhook request using Svix.

## Feedback

Last updated on Mar 24, 2026

[Edit on GitHub](https://github.com/clerk/clerk-docs/edit/main/docs/reference/backend/overview.mdx)
