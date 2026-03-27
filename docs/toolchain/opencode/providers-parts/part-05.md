# Source: https://opencode.ai/docs/providers/
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# providers — Part 5

   ```
3. Enter your Scaleway API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select a model like *devstral-2-123b-instruct-2512* or *gpt-oss-120b*.

   ```
   /models
   ```

---

### [Together AI](#together-ai)

1. Head over to the [Together AI console](https://api.together.ai), create an account, and click **Add Key**.
2. Run the `/connect` command and search for **Together AI**.

   ```
   /connect
   ```
3. Enter your Together AI API key.

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

### [Venice AI](#venice-ai)

1. Head over to the [Venice AI console](https://venice.ai), create an account, and generate an API key.
2. Run the `/connect` command and search for **Venice AI**.

   ```
   /connect
   ```
3. Enter your Venice AI API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select a model like *Llama 3.3 70B*.

   ```
   /models
   ```

---

### [Vercel AI Gateway](#vercel-ai-gateway)

Vercel AI Gateway lets you access models from OpenAI, Anthropic, Google, xAI, and more through a unified endpoint. Models are offered at list price with no markup.

1. Head over to the [Vercel dashboard](https://vercel.com/), navigate to the **AI Gateway** tab, and click **API keys** to create a new API key.
2. Run the `/connect` command and search for **Vercel AI Gateway**.

   ```
   /connect
   ```
3. Enter your Vercel AI Gateway API key.

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

You can also customize models through your opencode config. Hereâs an example of specifying provider routing order.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"vercel": {

"models": {

"anthropic/claude-sonnet-4": {

"options": {

"order": ["anthropic", "vertex"]

}

}

}

}

}

}
```

Some useful routing options:

| Option | Description |
| --- | --- |
| `order` | Provider sequence to try |
| `only` | Restrict to specific providers |
| `zeroDataRetention` | Only use providers with zero data retention policies |

---

### [xAI](#xai)

1. Head over to the [xAI console](https://console.x.ai/), create an account, and generate an API key.
2. Run the `/connect` command and search for **xAI**.

   ```
   /connect
   ```
3. Enter your xAI API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select a model like *Grok Beta*.

   ```
   /models
   ```

---

### [Z.AI](#zai)

1. Head over to the [Z.AI API console](https://z.ai/manage-apikey/apikey-list), create an account, and click **Create a new API key**.
2. Run the `/connect` command and search for **Z.AI**.

   ```
   /connect
   ```

   If you are subscribed to the **GLM Coding Plan**, select **Z.AI Coding Plan**.
3. Enter your Z.AI API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run the `/models` command to select a model like *GLM-4.7*.

   ```
   /models
   ```

---

### [ZenMux](#zenmux)

1. Head over to the [ZenMux dashboard](https://zenmux.ai/settings/keys), click **Create API Key**, and copy the key.
2. Run the `/connect` command and search for ZenMux.

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
4. Many ZenMux models are preloaded by default, run the `/models` command to select the one you want.

   ```
   /models
   ```

   You can also add additional models through your opencode config.

   opencode.json

   ```
   {

   "$schema": "https://opencode.ai/config.json",

   "provider": {

   "zenmux": {

   "models": {

   "somecoolnewmodel": {}

   }

   }

   }

   }
   ```

---

## [Custom provider](#custom-provider)

To add any **OpenAI-compatible** provider thatâs not listed in the `/connect` command:

1. Run the `/connect` command and scroll down to **Other**.

   Terminal window

   ```
   $ /connect

   â  Add credential

   â

   â  Select provider

   â  ...

   â  â Other

   â
   ```
2. Enter a unique ID for the provider.

   Terminal window

   ```
   $ /connect

   â  Add credential

   â

   â  Enter provider id

   â  myprovider

   â
   ```
3. Enter your API key for the provider.

   Terminal window

   ```
   $ /connect

   â  Add credential

   â

   â²  This only stores a credential for myprovider - you will need to configure it in opencode.json, check the docs for examples.

   â

   â  Enter your API key

   â  sk-...

   â
   ```
4. Create or update your `opencode.json` file in your project directory:

   opencode.json

   ```
   {

   "$schema": "https://opencode.ai/config.json",

   "provider": {

   "myprovider": {

   "npm": "@ai-sdk/openai-compatible",

   "name": "My AI ProviderDisplay Name",

   "options": {

   "baseURL": "https://api.myprovider.com/v1"

   },

   "models": {

   "my-model-name": {

   "name": "My Model Display Name"

   }

   }

   }

   }

   }
   ```

   Here are the configuration options:

   * **npm**: AI SDK package to use, `@ai-sdk/openai-compatible` for OpenAI-compatible providers (for `/v1/chat/completions`). If your provider/model uses `/v1/responses`, use `@ai-sdk/openai`.
   * **name**: Display name in UI.
   * **models**: Available models.
   * **options.baseURL**: API endpoint URL.
   * **options.apiKey**: Optionally set the API key, if not using auth.
   * **options.headers**: Optionally set custom headers.

   More on the advanced options in the example below.
5. Run the `/models` command and your custom provider and models will appear in the selection list.

---

##### [Example](#example)

Hereâs an example setting the `apiKey`, `headers`, and model `limit` options.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"myprovider": {

"npm": "@ai-sdk/openai-compatible",

"name": "My AI ProviderDisplay Name",

"options": {

"baseURL": "https://api.myprovider.com/v1",

"apiKey": "{env:ANTHROPIC_API_KEY}",

"headers": {

"Authorization": "Bearer custom-token"

}

},

"models": {

"my-model-name": {

"name": "My Model Display Name",

"limit": {

"context": 200000,

"output": 65536

}

}

}

}

}

}
```

Configuration details:

* **apiKey**: Set using `env` variable syntax, [learn more](/docs/config#env-vars).
* **headers**: Custom headers sent with each request.
* **limit.context**: Maximum input tokens the model accepts.
* **limit.output**: Maximum tokens the model can generate.

The `limit` fields allow OpenCode to understand how much context you have left. Standard providers pull these from models.dev automatically.

---

## [Troubleshooting](#troubleshooting)

If you are having trouble with configuring a provider, check the following:

1. **Check the auth setup**: Run `opencode auth list` to see if the credentials
   for the provider are added to your config.

   This doesnât apply to providers like Amazon Bedrock, that rely on environment variables for their auth.
2. For custom providers, check the opencode config and:

   * Make sure the provider ID used in the `/connect` command matches the ID in your opencode config.
   * The right npm package is used for the provider. For example, use `@ai-sdk/cerebras` for Cerebras. And for all other OpenAI-compatible providers, use `@ai-sdk/openai-compatible` (for `/v1/chat/completions`); if a model uses `/v1/responses`, use `@ai-sdk/openai`. For mixed setups under one provider, you can override per model via `provider.npm`.
