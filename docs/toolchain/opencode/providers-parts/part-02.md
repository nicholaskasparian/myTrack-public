# Source: https://opencode.ai/docs/providers/
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# providers — Part 2

   /models
   ```

---

### [Baseten](#baseten)

1. Head over to the [Baseten](https://app.baseten.co/), create an account, and generate an API key.
2. Run the `/connect` command and search for **Baseten**.

   ```
   /connect
   ```
3. Enter your Baseten API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select a model.

   ```
   /models
   ```

---

### [Cerebras](#cerebras)

1. Head over to the [Cerebras console](https://inference.cerebras.ai/), create an account, and generate an API key.
2. Run the `/connect` command and search for **Cerebras**.

   ```
   /connect
   ```
3. Enter your Cerebras API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select a model like *Qwen 3 Coder 480B*.

   ```
   /models
   ```

---

### [Cloudflare AI Gateway](#cloudflare-ai-gateway)

Cloudflare AI Gateway lets you access models from OpenAI, Anthropic, Workers AI, and more through a unified endpoint. With [Unified Billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/) you donât need separate API keys for each provider.

1. Head over to the [Cloudflare dashboard](https://dash.cloudflare.com/), navigate to **AI** > **AI Gateway**, and create a new gateway.
2. Set your Account ID and Gateway ID as environment variables.

   ~/.bash\_profile

   ```
   export CLOUDFLARE_ACCOUNT_ID=your-32-character-account-id

   export CLOUDFLARE_GATEWAY_ID=your-gateway-id
   ```
3. Run the `/connect` command and search for **Cloudflare AI Gateway**.

   ```
   /connect
   ```
4. Enter your Cloudflare API token.

   ```
   â API key

   â

   â

   â enter
   ```

   Or set it as an environment variable.

   ~/.bash\_profile

   ```
   export CLOUDFLARE_API_TOKEN=your-api-token
   ```
5. Run the `/models` command to select a model.

   ```
   /models
   ```

   You can also add models through your opencode config.

   opencode.json

   ```
   {

   "$schema": "https://opencode.ai/config.json",

   "provider": {

   "cloudflare-ai-gateway": {

   "models": {

   "openai/gpt-4o": {},

   "anthropic/claude-sonnet-4": {}

   }

   }

   }

   }
   ```

---

### [Cloudflare Workers AI](#cloudflare-workers-ai)

Cloudflare Workers AI lets you run AI models on Cloudflareâs global network directly via REST API, with no separate provider accounts needed for supported models.

1. Head over to the [Cloudflare dashboard](https://dash.cloudflare.com/), navigate to **Workers AI**, and select **Use REST API** to get your Account ID and create an API token.
2. Set your Account ID as an environment variable.

   ~/.bash\_profile

   ```
   export CLOUDFLARE_ACCOUNT_ID=your-32-character-account-id
   ```
3. Run the `/connect` command and search for **Cloudflare Workers AI**.

   ```
   /connect
   ```
4. Enter your Cloudflare API token.

   ```
   â API key

   â

   â

   â enter
   ```

   Or set it as an environment variable.

   ~/.bash\_profile

   ```
   export CLOUDFLARE_API_KEY=your-api-token
   ```
5. Run the `/models` command to select a model.

   ```
   /models
   ```

---

### [Cortecs](#cortecs)

1. Head over to the [Cortecs console](https://cortecs.ai/), create an account, and generate an API key.
2. Run the `/connect` command and search for **Cortecs**.

   ```
   /connect
   ```
3. Enter your Cortecs API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select a model like *Kimi K2 Instruct*.

   ```
   /models
   ```

---

### [DeepSeek](#deepseek)

1. Head over to the [DeepSeek console](https://platform.deepseek.com/), create an account, and click **Create new API key**.
2. Run the `/connect` command and search for **DeepSeek**.

   ```
   /connect
   ```
3. Enter your DeepSeek API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select a DeepSeek model like *DeepSeek Reasoner*.

   ```
   /models
   ```

---

### [Deep Infra](#deep-infra)

1. Head over to the [Deep Infra dashboard](https://deepinfra.com/dash), create an account, and generate an API key.
2. Run the `/connect` command and search for **Deep Infra**.

   ```
   /connect
   ```
3. Enter your Deep Infra API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select a model.

   ```
   /models
   ```

---

### [Firmware](#firmware)

1. Head over to the [Firmware dashboard](https://app.firmware.ai/signup), create an account, and generate an API key.
2. Run the `/connect` command and search for **Firmware**.

   ```
   /connect
   ```
3. Enter your Firmware API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select a model.

   ```
   /models
   ```

---

### [Fireworks AI](#fireworks-ai)

1. Head over to the [Fireworks AI console](https://app.fireworks.ai/), create an account, and click **Create API Key**.
2. Run the `/connect` command and search for **Fireworks AI**.

   ```
   /connect
   ```
3. Enter your Fireworks AI API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select a model like *Kimi K2 Instruct*.

   ```
   /models
   ```

---

### [GitLab Duo](#gitlab-duo)

OpenCode integrates with the [GitLab Duo Agent Platform](https://docs.gitlab.com/user/duo_agent_platform/),
providing AI-powered agentic chat with native tool calling capabilities.

1. Run the `/connect` command and select GitLab.

   ```
   /connect
   ```
2. Choose your authentication method:

   ```
   â Select auth method

   â

   â OAuth (Recommended)

   â Personal Access Token

   â
   ```

   #### [Using OAuth (Recommended)](#using-oauth-recommended)

   Select **OAuth** and your browser will open for authorization.

   #### [Using Personal Access Token](#using-personal-access-token)

   1. Go to [GitLab User Settings > Access Tokens](https://gitlab.com/-/user_settings/personal_access_tokens)
   2. Click **Add new token**
   3. Name: `OpenCode`, Scopes: `api`
   4. Copy the token (starts with `glpat-`)
   5. Enter it in the terminal
3. Run the `/models` command to see available models.

   ```
   /models
   ```

   Three Claude-based models are available:

   * **duo-chat-haiku-4-5** (Default) - Fast responses for quick tasks
   * **duo-chat-sonnet-4-5** - Balanced performance for most workflows
   * **duo-chat-opus-4-5** - Most capable for complex analysis

##### [Self-Hosted GitLab](#self-hosted-gitlab)

For self-hosted GitLab instances:

Terminal window

```
export GITLAB_INSTANCE_URL=https://gitlab.company.com

export GITLAB_TOKEN=glpat-...
```

If your instance runs a custom AI Gateway:

Terminal window

```
GITLAB_AI_GATEWAY_URL=https://ai-gateway.company.com
```

Or add to your bash profile:

~/.bash\_profile

```
export GITLAB_INSTANCE_URL=https://gitlab.company.com

export GITLAB_AI_GATEWAY_URL=https://ai-gateway.company.com

export GITLAB_TOKEN=glpat-...
```

##### [OAuth for Self-Hosted instances](#oauth-for-self-hosted-instances)

In order to make Oauth working for your self-hosted instance, you need to create
a new application (Settings â Applications) with the
callback URL `http://127.0.0.1:8080/callback` and following scopes:

* api (Access the API on your behalf)
* read\_user (Read your personal information)
* read\_repository (Allows read-only access to the repository)

Then expose application ID as environment variable:

Terminal window

```
export GITLAB_OAUTH_CLIENT_ID=your_application_id_here
```

More documentation on [opencode-gitlab-auth](https://www.npmjs.com/package/opencode-gitlab-auth) homepage.

##### [Configuration](#configuration)

Customize through `opencode.json`:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"gitlab": {

"options": {

"instanceUrl": "https://gitlab.com"

}

}

}

}
```

##### [GitLab Duo Agent Platform (DAP) Workflow Models](#gitlab-duo-agent-platform-dap-workflow-models)

DAP workflow models provide an alternative execution path that routes tool calls
through GitLabâs Duo Workflow Service (DWS) instead of the standard agentic chat.
When a `duo-workflow-*` model is selected, OpenCode will:

1. Discover available models from your GitLab namespace
2. Present a selection picker if multiple models are available
3. Cache the selected model to disk for fast subsequent startups
4. Route tool execution requests through OpenCodeâs permission-gated tool system

