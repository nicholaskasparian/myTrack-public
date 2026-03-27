# Source: https://opencode.ai/docs/providers/
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# providers — Part 1


# Providers

Using any LLM provider in OpenCode.

OpenCode uses the [AI SDK](https://ai-sdk.dev/) and [Models.dev](https://models.dev) to support **75+ LLM providers** and it supports running local models.

To add a provider you need to:

1. Add the API keys for the provider using the `/connect` command.
2. Configure the provider in your OpenCode config.

---

### [Credentials](#credentials)

When you add a providerâs API keys with the `/connect` command, they are stored
in `~/.local/share/opencode/auth.json`.

---

### [Config](#config)

You can customize the providers through the `provider` section in your OpenCode
config.

---

#### [Base URL](#base-url)

You can customize the base URL for any provider by setting the `baseURL` option. This is useful when using proxy services or custom endpoints.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"anthropic": {

"options": {

"baseURL": "https://api.anthropic.com/v1"

}

}

}

}
```

---

## [OpenCode Zen](#opencode-zen)

OpenCode Zen is a list of models provided by the OpenCode team that have been
tested and verified to work well with OpenCode. [Learn more](/docs/zen).

1. Run the `/connect` command in the TUI, select `OpenCode Zen`, and head to [opencode.ai/auth](https://opencode.ai/zen).

   ```
   /connect
   ```
2. Sign in, add your billing details, and copy your API key.
3. Paste your API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run `/models` in the TUI to see the list of models we recommend.

   ```
   /models
   ```

It works like any other provider in OpenCode and is completely optional to use.

---

## [OpenCode Go](#opencode-go)

OpenCode Go is a low cost subscription plan that provides reliable access to popular open coding models provided by the OpenCode team that have been
tested and verified to work well with OpenCode.

1. Run the `/connect` command in the TUI, select `OpenCode Go`, and head to [opencode.ai/auth](https://opencode.ai/zen).

   ```
   /connect
   ```
2. Sign in, add your billing details, and copy your API key.
3. Paste your API key.

   ```
   â API key

   â

   â

   â enter
   ```
4. Run `/models` in the TUI to see the list of models we recommend.

   ```
   /models
   ```

It works like any other provider in OpenCode and is completely optional to use.

---

## [Directory](#directory)

Letâs look at some of the providers in detail. If youâd like to add a provider to the
list, feel free to open a PR.

---

### [302.AI](#302ai)

1. Head over to the [302.AI console](https://302.ai/), create an account, and generate an API key.
2. Run the `/connect` command and search for **302.AI**.

   ```
   /connect
   ```
3. Enter your 302.AI API key.

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

### [Amazon Bedrock](#amazon-bedrock)

To use Amazon Bedrock with OpenCode:

1. Head over to the **Model catalog** in the Amazon Bedrock console and request
   access to the models you want.
2. **Configure authentication** using one of the following methods:

   ---

   #### [Environment Variables (Quick Start)](#environment-variables-quick-start)

   Set one of these environment variables while running opencode:

   Terminal window

   ```
   # Option 1: Using AWS access keys

   AWS_ACCESS_KEY_ID=XXX AWS_SECRET_ACCESS_KEY=YYY opencode

   # Option 2: Using named AWS profile

   AWS_PROFILE=my-profile opencode

   # Option 3: Using Bedrock bearer token

   AWS_BEARER_TOKEN_BEDROCK=XXX opencode
   ```

   Or add them to your bash profile:

   ~/.bash\_profile

   ```
   export AWS_PROFILE=my-dev-profile

   export AWS_REGION=us-east-1
   ```

   ---

   #### [Configuration File (Recommended)](#configuration-file-recommended)

   For project-specific or persistent configuration, use `opencode.json`:

   opencode.json

   ```
   {

   "$schema": "https://opencode.ai/config.json",

   "provider": {

   "amazon-bedrock": {

   "options": {

   "region": "us-east-1",

   "profile": "my-aws-profile"

   }

   }

   }

   }
   ```

   **Available options:**

   * `region` - AWS region (e.g., `us-east-1`, `eu-west-1`)
   * `profile` - AWS named profile from `~/.aws/credentials`
   * `endpoint` - Custom endpoint URL for VPC endpoints (alias for generic `baseURL` option)

   ---

   #### [Advanced: VPC Endpoints](#advanced-vpc-endpoints)

   If youâre using VPC endpoints for Bedrock:

   opencode.json

   ```
   {

   "$schema": "https://opencode.ai/config.json",

   "provider": {

   "amazon-bedrock": {

   "options": {

   "region": "us-east-1",

   "profile": "production",

   "endpoint": "https://bedrock-runtime.us-east-1.vpce-xxxxx.amazonaws.com"

   }

   }

   }

   }
   ```

   ---

   #### [Authentication Methods](#authentication-methods)

   * **`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`**: Create an IAM user and generate access keys in the AWS Console
   * **`AWS_PROFILE`**: Use named profiles from `~/.aws/credentials`. First configure with `aws configure --profile my-profile` or `aws sso login`
   * **`AWS_BEARER_TOKEN_BEDROCK`**: Generate long-term API keys from the Amazon Bedrock console
   * **`AWS_WEB_IDENTITY_TOKEN_FILE` / `AWS_ROLE_ARN`**: For EKS IRSA (IAM Roles for Service Accounts) or other Kubernetes environments with OIDC federation. These environment variables are automatically injected by Kubernetes when using service account annotations.

   ---

   #### [Authentication Precedence](#authentication-precedence)

   Amazon Bedrock uses the following authentication priority:

   1. **Bearer Token** - `AWS_BEARER_TOKEN_BEDROCK` environment variable or token from `/connect` command
   2. **AWS Credential Chain** - Profile, access keys, shared credentials, IAM roles, Web Identity Tokens (EKS IRSA), instance metadata
3. Run the `/models` command to select the model you want.

   ```
   /models
   ```

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"amazon-bedrock": {

// ...

"models": {

"anthropic-claude-sonnet-4.5": {

"id": "arn:aws:bedrock:us-east-1:xxx:application-inference-profile/yyy"

}

}

}

}

}
```

---

### [Anthropic](#anthropic)

1. Once youâve signed up, run the `/connect` command and select Anthropic.

   ```
   /connect
   ```
2. Here you can select the **Claude Pro/Max** option and itâll open your browser
   and ask you to authenticate.

   ```
   â Select auth method

   â

   â Manually enter API Key

   â
   ```
3. Now all the Anthropic models should be available when you use the `/models` command.

   ```
   /models
   ```

There are plugins that allow you to use your Claude Pro/Max models with
OpenCode. Anthropic explicitly prohibits this.

Previous versions of OpenCode came bundled with these plugins but that is no
longer the case as of 1.3.0

Other companies support freedom of choice with developer tooling - you can use
the following subscriptions in OpenCode with zero setup:

* ChatGPT Plus
* Github Copilot
* Gitlab Duo

---

### [Azure OpenAI](#azure-openai)

1. Head over to the [Azure portal](https://portal.azure.com/) and create an **Azure OpenAI** resource. Youâll need:

   * **Resource name**: This becomes part of your API endpoint (`https://RESOURCE_NAME.openai.azure.com/`)
   * **API key**: Either `KEY 1` or `KEY 2` from your resource
2. Go to [Azure AI Foundry](https://ai.azure.com/) and deploy a model.
3. Run the `/connect` command and search for **Azure**.

   ```
   /connect
   ```
4. Enter your API key.

   ```
   â API key

   â

   â

   â enter
   ```
5. Set your resource name as an environment variable:

   Terminal window

   ```
   AZURE_RESOURCE_NAME=XXX opencode
   ```

   Or add it to your bash profile:

   ~/.bash\_profile

   ```
   export AZURE_RESOURCE_NAME=XXX
   ```
6. Run the `/models` command to select your deployed model.

   ```
   /models
   ```

---

### [Azure Cognitive Services](#azure-cognitive-services)

1. Head over to the [Azure portal](https://portal.azure.com/) and create an **Azure OpenAI** resource. Youâll need:

   * **Resource name**: This becomes part of your API endpoint (`https://AZURE_COGNITIVE_SERVICES_RESOURCE_NAME.cognitiveservices.azure.com/`)
   * **API key**: Either `KEY 1` or `KEY 2` from your resource
2. Go to [Azure AI Foundry](https://ai.azure.com/) and deploy a model.
3. Run the `/connect` command and search for **Azure Cognitive Services**.

   ```
   /connect
   ```
4. Enter your API key.

   ```
   â API key

   â

   â

   â enter
   ```
5. Set your resource name as an environment variable:

   Terminal window

   ```
   AZURE_COGNITIVE_SERVICES_RESOURCE_NAME=XXX opencode
   ```

   Or add it to your bash profile:

   ~/.bash\_profile

   ```
   export AZURE_COGNITIVE_SERVICES_RESOURCE_NAME=XXX
   ```
6. Run the `/models` command to select your deployed model.

   ```
