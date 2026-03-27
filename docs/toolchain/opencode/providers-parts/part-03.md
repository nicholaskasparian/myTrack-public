# Source: https://opencode.ai/docs/providers/
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# providers — Part 3

Available DAP workflow models follow the `duo-workflow-*` naming convention and
are dynamically discovered from your GitLab instance.

##### [GitLab API Tools (Optional, but highly recommended)](#gitlab-api-tools-optional-but-highly-recommended)

To access GitLab tools (merge requests, issues, pipelines, CI/CD, etc.):

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"plugin": ["opencode-gitlab-plugin"]

}
```

This plugin provides comprehensive GitLab repository management capabilities including MR reviews, issue tracking, pipeline monitoring, and more.

---

### [GitHub Copilot](#github-copilot)

To use your GitHub Copilot subscription with opencode:

1. Run the `/connect` command and search for GitHub Copilot.

   ```
   /connect
   ```
2. Navigate to [github.com/login/device](https://github.com/login/device) and enter the code.

   ```
   â Login with GitHub Copilot

   â

   â https://github.com/login/device

   â

   â Enter code: 8F43-6FCF

   â

   â Waiting for authorization...
   ```
3. Now run the `/models` command to select the model you want.

   ```
   /models
   ```

---

### [Google Vertex AI](#google-vertex-ai)

To use Google Vertex AI with OpenCode:

1. Head over to the **Model Garden** in the Google Cloud Console and check the
   models available in your region.
2. Set the required environment variables:

   * `GOOGLE_CLOUD_PROJECT`: Your Google Cloud project ID
   * `VERTEX_LOCATION` (optional): The region for Vertex AI (defaults to `global`)
   * Authentication (choose one):
     + `GOOGLE_APPLICATION_CREDENTIALS`: Path to your service account JSON key file
     + Authenticate using gcloud CLI: `gcloud auth application-default login`

   Set them while running opencode.

   Terminal window

   ```
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json GOOGLE_CLOUD_PROJECT=your-project-id opencode
   ```

   Or add them to your bash profile.

   ~/.bash\_profile

   ```
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

   export GOOGLE_CLOUD_PROJECT=your-project-id

   export VERTEX_LOCATION=global
   ```

3. Run the `/models` command to select the model you want.

   ```
   /models
   ```

---

### [Groq](#groq)

1. Head over to the [Groq console](https://console.groq.com/), click **Create API Key**, and copy the key.
2. Run the `/connect` command and search for Groq.

   ```
   /connect
   ```
3. Enter the API key for the provider.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select the one you want.

   ```
   /models
   ```

---

### [Hugging Face](#hugging-face)

[Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers) provides access to open models supported by 17+ providers.

1. Head over to [Hugging Face settings](https://huggingface.co/settings/tokens/new?ownUserPermissions=inference.serverless.write&tokenType=fineGrained) to create a token with permission to make calls to Inference Providers.
2. Run the `/connect` command and search for **Hugging Face**.

   ```
   /connect
   ```
3. Enter your Hugging Face token.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select a model like *Kimi-K2-Instruct* or *GLM-4.6*.

   ```
   /models
   ```

---

### [Helicone](#helicone)

[Helicone](https://helicone.ai) is an LLM observability platform that provides logging, monitoring, and analytics for your AI applications. The Helicone AI Gateway routes your requests to the appropriate provider automatically based on the model.

1. Head over to [Helicone](https://helicone.ai), create an account, and generate an API key from your dashboard.
2. Run the `/connect` command and search for **Helicone**.

   ```
   /connect
   ```
3. Enter your Helicone API key.

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

For more providers and advanced features like caching and rate limiting, check the [Helicone documentation](https://docs.helicone.ai).

#### [Optional Configs](#optional-configs)

In the event you see a feature or model from Helicone that isnât configured automatically through opencode, you can always configure it yourself.

Hereâs [Heliconeâs Model Directory](https://helicone.ai/models), youâll need this to grab the IDs of the models you want to add.

~/.config/opencode/opencode.jsonc

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"helicone": {

"npm": "@ai-sdk/openai-compatible",

"name": "Helicone",

"options": {

"baseURL": "https://ai-gateway.helicone.ai",

},

"models": {

"gpt-4o": {

// Model ID (from Helicone's model directory page)

"name": "GPT-4o", // Your own custom name for the model

},

"claude-sonnet-4-20250514": {

"name": "Claude Sonnet 4",

},

},

},

},

}
```

#### [Custom Headers](#custom-headers)

Helicone supports custom headers for features like caching, user tracking, and session management. Add them to your provider config using `options.headers`:

~/.config/opencode/opencode.jsonc

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"helicone": {

"npm": "@ai-sdk/openai-compatible",

"name": "Helicone",

"options": {

"baseURL": "https://ai-gateway.helicone.ai",

"headers": {

"Helicone-Cache-Enabled": "true",

"Helicone-User-Id": "opencode",

},

},

},

},

}
```

##### [Session tracking](#session-tracking)

Heliconeâs [Sessions](https://docs.helicone.ai/features/sessions) feature lets you group related LLM requests together. Use the [opencode-helicone-session](https://github.com/H2Shami/opencode-helicone-session) plugin to automatically log each OpenCode conversation as a session in Helicone.

Terminal window

```
npm install -g opencode-helicone-session
```

Add it to your config.

opencode.json

```
{

"plugin": ["opencode-helicone-session"]

}
```

The plugin injects `Helicone-Session-Id` and `Helicone-Session-Name` headers into your requests. In Heliconeâs Sessions page, youâll see each OpenCode conversation listed as a separate session.

##### [Common Helicone headers](#common-helicone-headers)

| Header | Description |
| --- | --- |
| `Helicone-Cache-Enabled` | Enable response caching (`true`/`false`) |
| `Helicone-User-Id` | Track metrics by user |
| `Helicone-Property-[Name]` | Add custom properties (e.g., `Helicone-Property-Environment`) |
| `Helicone-Prompt-Id` | Associate requests with prompt versions |

See the [Helicone Header Directory](https://docs.helicone.ai/helicone-headers/header-directory) for all available headers.

---

### [llama.cpp](#llamacpp)

You can configure opencode to use local models through [llama.cppâs](https://github.com/ggml-org/llama.cpp) llama-server utility

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"llama.cpp": {

"npm": "@ai-sdk/openai-compatible",

"name": "llama-server (local)",

"options": {

"baseURL": "http://127.0.0.1:8080/v1"

},

"models": {

"qwen3-coder:a3b": {

"name": "Qwen3-Coder: a3b-30b (local)",

"limit": {

"context": 128000,

"output": 65536

}

}

}

}

}

}
```

In this example:

* `llama.cpp` is the custom provider ID. This can be any string you want.
* `npm` specifies the package to use for this provider. Here, `@ai-sdk/openai-compatible` is used for any OpenAI-compatible API.
* `name` is the display name for the provider in the UI.
* `options.baseURL` is the endpoint for the local server.
* `models` is a map of model IDs to their configurations. The model name will be displayed in the model selection list.

---

### [IO.NET](#ionet)

IO.NET offers 17 models optimized for various use cases:

1. Head over to the [IO.NET console](https://ai.io.net/), create an account, and generate an API key.
2. Run the `/connect` command and search for **IO.NET**.

   ```
   /connect
   ```
3. Enter your IO.NET API key.

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

### [LM Studio](#lm-studio)

You can configure opencode to use local models through LM Studio.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"lmstudio": {

"npm": "@ai-sdk/openai-compatible",

"name": "LM Studio (local)",

"options": {

"baseURL": "http://127.0.0.1:1234/v1"

},

"models": {

"google/gemma-3n-e4b": {

"name": "Gemma 3n-e4b (local)"

}

}

}

}

}
```

In this example:

* `lmstudio` is the custom provider ID. This can be any string you want.
* `npm` specifies the package to use for this provider. Here, `@ai-sdk/openai-compatible` is used for any OpenAI-compatible API.
* `name` is the display name for the provider in the UI.
* `options.baseURL` is the endpoint for the local server.
