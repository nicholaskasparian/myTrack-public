# Source: https://clerk.com/docs/authentication/social-connections/overview
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# social-connections — Part 2


When using the [Account Portal](/docs/guides/account-portal/overview) pages, users can see which providers they have already connected to and which ones they can still connect to on their [user profile page](/docs/guides/account-portal/overview#user-profile).

When using the [prebuilt components](/docs/reference/components/overview), you can use the [<UserProfile/>](/docs/reference/components/user/user-profile) component to allow users to connect to further social providers.

## [OAuth for native applications](#o-auth-for-native-applications)

Currently, the prebuilt components are not supported in native applications, but you can use the Clerk API to [build a custom flow for authenticating with social connections](/docs/guides/development/custom-flows/authentication/oauth-connections).

Clerk ensures that security critical nonces are passed only to allowlisted URLs when the SSO flow is completed in native browsers or webviews. For maximum security in your **production** instances, you need to allowlist your custom redirect URLs via the [Clerk Dashboard⁠](https://dashboard.clerk.com/) or the [Clerk Backend API](/docs/reference/backend/redirect-urls/create-redirect-url).

To allowlist a redirect URL via the Clerk Dashboard:

1. In the Clerk Dashboard, navigate to the [**Native applications**⁠](https://dashboard.clerk.com/~/native-applications) page.
2. Scroll down to the **Allowlist for mobile SSO redirect** section and add your redirect URLs.

Note

By default, Clerk uses `{bundleIdentifier}://callback` as the redirect URL.

## [OAuth for Apple native applications](#o-auth-for-apple-native-applications)

You can use [Sign in with Apple⁠](https://developer.apple.com/sign-in-with-apple/) to offer a native authentication experience in your iOS, watchOS, macOS or tvOS apps.

Instead of the typical OAuth flow that performs redirects in a browser context, you can utilize Apple's native authorization and provide the openID token and grant code to Clerk. Clerk ensures that the user will be verified in a secure and reliable way with the information that Apple has provided about the user.

For additional information on how to configure Apple as a social provider for your Clerk instance, see the [dedicated guide](/docs/guides/configure/auth-strategies/social-connections/apple).

## [Supported social providers](#supported-social-providers)

Clerk provides a wide range of social providers to ease your user's sign-up and sign-in processes. Select a provider to learn how to configure it for your Clerk app.

![Apple logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fapple.svg&w=64&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)![Apple logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fapple-dark.svg&w=64&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Apple](/docs/guides/configure/auth-strategies/social-connections/apple)

Add Apple as an authentication provider for your Clerk app.

![Atlassian logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fatlassian.svg&w=64&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Atlassian](/docs/guides/configure/auth-strategies/social-connections/atlassian)

Add Atlassian as an authentication provider for your Clerk app.

![Bitbucket logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fbitbucket.svg&w=128&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Bitbucket](/docs/guides/configure/auth-strategies/social-connections/bitbucket)

Add Bitbucket as an authentication provider for your Clerk app.

![Box logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fbox.svg&w=96&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Box](/docs/guides/configure/auth-strategies/social-connections/box)

Add Box as an authentication provider for your Clerk app.

![Coinbase logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fcoinbase.svg&w=96&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Coinbase](/docs/guides/configure/auth-strategies/social-connections/coinbase)

Add Coinbase as an authentication provider for your Clerk app.

![Discord logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fdiscord.svg&w=128&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)![Discord logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fdiscord-dark.svg&w=128&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Discord](/docs/guides/configure/auth-strategies/social-connections/discord)

Add Discord as an authentication provider for your Clerk app.

![Dropbox logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fdropbox.svg&w=96&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Dropbox](/docs/guides/configure/auth-strategies/social-connections/dropbox)

Add Dropbox as an authentication provider for your Clerk app.

![Facebook logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Ffacebook.svg&w=96&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Facebook](/docs/guides/configure/auth-strategies/social-connections/facebook)

Add Facebook as an authentication provider for your Clerk app.

![GitHub logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fgithub.svg&w=128&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)![GitHub logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fgithub-dark.svg&w=128&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [GitHub](/docs/guides/configure/auth-strategies/social-connections/github)

Add GitHub as an authentication provider for your Clerk app.

![GitLab logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fgitlab.svg&w=256&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [GitLab](/docs/guides/configure/auth-strategies/social-connections/gitlab)

Add GitLab as an authentication provider for your Clerk app.

![Google logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fgoogle.svg&w=256&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Google](/docs/guides/configure/auth-strategies/social-connections/google)

Add Google as an authentication provider for your Clerk app.

![HubSpot logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fhubspot.svg&w=96&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [HubSpot](/docs/guides/configure/auth-strategies/social-connections/hubspot)

Add HubSpot as an authentication provider for your Clerk app.

![Hugging Face logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fhuggingface.svg&w=640&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Hugging Face](/docs/guides/configure/auth-strategies/social-connections/hugging-face)

Add Hugging Face as an authentication provider for your Clerk app.

![LINE logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fline.svg&w=128&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [LINE](/docs/guides/configure/auth-strategies/social-connections/line)

Add LINE as an authentication provider for your Clerk app.

![Linear logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Flinear.svg&w=128&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Linear](/docs/guides/configure/auth-strategies/social-connections/linear)

Add Linear as an authentication provider for your Clerk app.

![LinkedIn logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Flinkedin.svg&w=256&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [LinkedIn](/docs/guides/configure/auth-strategies/social-connections/linkedin-oidc)

Add LinkedIn as an authentication provider for your Clerk app.

![Microsoft logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fmicrosoft.svg&w=96&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Microsoft](/docs/guides/configure/auth-strategies/social-connections/microsoft)

Add Microsoft as an authentication provider for your Clerk app.

![Notion logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fnotion.svg&w=256&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Notion](/docs/guides/configure/auth-strategies/social-connections/notion)

Add Notion as an authentication provider for your Clerk app.

![Slack logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fslack.svg&w=128&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Slack](/docs/guides/configure/auth-strategies/social-connections/slack)

Add Slack as an authentication provider for your Clerk app.

![Spotify logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fspotify.svg&w=128&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Spotify](/docs/guides/configure/auth-strategies/social-connections/spotify)

Add Spotify as an authentication provider for your Clerk app.

![TikTok logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Ftiktok.svg&w=128&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [TikTok](/docs/guides/configure/auth-strategies/social-connections/tiktok)

Add TikTok as an authentication provider for your Clerk app.

![Twitch logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Ftwitch.svg&w=96&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Twitch](/docs/guides/configure/auth-strategies/social-connections/twitch)

Add Twitch as an authentication provider for your Clerk app.

![Vercel logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fvercel.svg&w=3840&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)![Vercel logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fvercel-dark.svg&w=3840&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Vercel](/docs/guides/configure/auth-strategies/social-connections/vercel)

Add Vercel as an authentication provider for your Clerk app.

![X/Twitter logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fx-twitter.svg&w=32&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)![X/Twitter logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fx-twitter-dark.svg&w=32&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [X/Twitter v2](/docs/guides/configure/auth-strategies/social-connections/x-twitter)

Add X (Twitter v2) as an authentication provider for your Clerk app.

![Xero logo](/_next/image?url=%2Fdocs%2Fraw%2F_public%2Fimages%2Flogos%2Fauth_providers%2Fxero.svg&w=128&q=75&dpl=dpl_LQBnujTXyUW2a1AgaqJyhxdE49G5)

### [Xero](/docs/guides/configure/auth-strategies/social-connections/xero)

Add Xero as an authentication provider for your Clerk app.

Don't see the provider you're looking for? You can [configure a custom OIDC-compatible provider](/docs/guides/configure/auth-strategies/social-connections/custom-provider) or [request a new one⁠](https://feedback.clerk.com/roadmap).

## Feedback

Last updated on Mar 24, 2026

[Edit on GitHub](https://github.com/clerk/clerk-docs/edit/main/docs/guides/configure/auth-strategies/social-connections/overview.mdx)
