# Source: https://opencode.ai/docs/providers/
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# providers — Part 4

* `models` is a map of model IDs to their configurations. The model name will be displayed in the model selection list.

---

### [Moonshot AI](#moonshot-ai)

To use Kimi K2 from Moonshot AI:

1. Head over to the [Moonshot AI console](https://platform.moonshot.ai/console), create an account, and click **Create API key**.
2. Run the `/connect` command and search for **Moonshot AI**.

   ```
   /connect
   ```
3. Enter your Moonshot API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select *Kimi K2*.

   ```
   /models
   ```

---

### [MiniMax](#minimax)

1. Head over to the [MiniMax API Console](https://platform.minimax.io/login), create an account, and generate an API key.
2. Run the `/connect` command and search for **MiniMax**.

   ```
   /connect
   ```
3. Enter your MiniMax API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select a model like *M2.1*.

   ```
   /models
   ```

---

### [Nebius Token Factory](#nebius-token-factory)

1. Head over to the [Nebius Token Factory console](https://tokenfactory.nebius.com/), create an account, and click **Add Key**.
2. Run the `/connect` command and search for **Nebius Token Factory**.

   ```
   /connect
   ```
3. Enter your Nebius Token Factory API key.

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

### [Ollama](#ollama)

You can configure opencode to use local models through Ollama.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"ollama": {

"npm": "@ai-sdk/openai-compatible",

"name": "Ollama (local)",

"options": {

"baseURL": "http://localhost:11434/v1"

},

"models": {

"llama2": {

"name": "Llama 2"

}

}

}

}

}
```

In this example:

* `ollama` is the custom provider ID. This can be any string you want.
* `npm` specifies the package to use for this provider. Here, `@ai-sdk/openai-compatible` is used for any OpenAI-compatible API.
* `name` is the display name for the provider in the UI.
* `options.baseURL` is the endpoint for the local server.
* `models` is a map of model IDs to their configurations. The model name will be displayed in the model selection list.

---

### [Ollama Cloud](#ollama-cloud)

To use Ollama Cloud with OpenCode:

1. Head over to <https://ollama.com/> and sign in or create an account.
2. Navigate to **Settings** > **Keys** and click **Add API Key** to generate a new API key.
3. Copy the API key for use in OpenCode.
4. Run the `/connect` command and search for **Ollama Cloud**.

   ```
   /connect
   ```
5. Enter your Ollama Cloud API key.

   ```
   â API key

   â

   â

   â enter
   ```
6. **Important**: Before using cloud models in OpenCode, you must pull the model information locally:

   Terminal window

   ```
   ollama pull gpt-oss:20b-cloud
   ```
7. Run the `/models` command to select your Ollama Cloud model.

   ```
   /models
   ```

---

### [OpenAI](#openai)

We recommend signing up for [ChatGPT Plus or Pro](https://chatgpt.com/pricing).

1. Once youâve signed up, run the `/connect` command and select OpenAI.

   ```
   /connect
   ```
2. Here you can select the **ChatGPT Plus/Pro** option and itâll open your browser
   and ask you to authenticate.

   ```
   â Select auth method

   â

   â ChatGPT Plus/Pro

   â Manually enter API Key

   â
   ```
3. Now all the OpenAI models should be available when you use the `/models` command.

   ```
   /models
   ```

##### [Using API keys](#using-api-keys)

If you already have an API key, you can select **Manually enter API Key** and paste it in your terminal.

---

### [OpenCode Zen](#opencode-zen-1)

OpenCode Zen is a list of tested and verified models provided by the OpenCode team. [Learn more](/docs/zen).

1. Sign in to **[OpenCode Zen](https://opencode.ai/auth)** and click **Create API Key**.
2. Run the `/connect` command and search for **OpenCode Zen**.

   ```
   /connect
   ```
3. Enter your OpenCode API key.

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

### [OpenRouter](#openrouter)

1. Head over to the [OpenRouter dashboard](https://openrouter.ai/settings/keys), click **Create API Key**, and copy the key.
2. Run the `/connect` command and search for OpenRouter.

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
4. Many OpenRouter models are preloaded by default, run the `/models` command to select the one you want.

   ```
   /models
   ```

   You can also add additional models through your opencode config.

   opencode.json

   ```
   {

   "$schema": "https://opencode.ai/config.json",

   "provider": {

   "openrouter": {

   "models": {

   "somecoolnewmodel": {}

   }

   }

   }

   }
   ```
5. You can also customize them through your opencode config. Hereâs an example of specifying a provider

   opencode.json

   ```
   {

   "$schema": "https://opencode.ai/config.json",

   "provider": {

   "openrouter": {

   "models": {

   "moonshotai/kimi-k2": {

   "options": {

   "provider": {

   "order": ["baseten"],

   "allow_fallbacks": false

   }

   }

   }

   }

   }

   }

   }
   ```

---

### [SAP AI Core](#sap-ai-core)

SAP AI Core provides access to 40+ models from OpenAI, Anthropic, Google, Amazon, Meta, Mistral, and AI21 through a unified platform.

1. Go to your [SAP BTP Cockpit](https://account.hana.ondemand.com/), navigate to your SAP AI Core service instance, and create a service key.
2. Run the `/connect` command and search for **SAP AI Core**.

   ```
   /connect
   ```
3. Enter your service key JSON.

   ```
   â Service key

   â

   â

   â enter
   ```

   Or set the `AICORE_SERVICE_KEY` environment variable:

   Terminal window

   ```
   AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}' opencode
   ```

   Or add it to your bash profile:

   ~/.bash\_profile

   ```
   export AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}'
   ```
4. Optionally set deployment ID and resource group:

   Terminal window

   ```
   AICORE_DEPLOYMENT_ID=your-deployment-id AICORE_RESOURCE_GROUP=your-resource-group opencode
   ```
5. Run the `/models` command to select from 40+ available models.

   ```
   /models
   ```

---

### [STACKIT](#stackit)

STACKIT AI Model Serving provides fully managed soverign hosting environment for AI models, focusing on LLMs like Llama, Mistral, and Qwen, with maximum data sovereignty on European infrastructure.

1. Head over to [STACKIT Portal](https://portal.stackit.cloud), navigate to **AI Model Serving**, and create an auth token for your project.
2. Run the `/connect` command and search for **STACKIT**.

   ```
   /connect
   ```
3. Enter your STACKIT AI Model Serving auth token.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select from available models like *Qwen3-VL 235B* or *Llama 3.3 70B*.

   ```
   /models
   ```

---

### [OVHcloud AI Endpoints](#ovhcloud-ai-endpoints)

1. Head over to the [OVHcloud panel](https://ovh.com/manager). Navigate to the `Public Cloud` section, `AI & Machine Learning` > `AI Endpoints` and in `API Keys` tab, click **Create a new API key**.
2. Run the `/connect` command and search for **OVHcloud AI Endpoints**.

   ```
   /connect
   ```
3. Enter your OVHcloud AI Endpoints API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select a model like *gpt-oss-120b*.

   ```
   /models
   ```

---

### [Scaleway](#scaleway)

To use [Scaleway Generative APIs](https://www.scaleway.com/en/docs/generative-apis/) with Opencode:

1. Head over to the [Scaleway Console IAM settings](https://console.scaleway.com/iam/api-keys) to generate a new API key.
2. Run the `/connect` command and search for **Scaleway**.

   ```
   /connect
