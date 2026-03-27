# Source: https://opencode.ai/docs/config/
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# config — Part 1


# Config

Using the OpenCode JSON config.

You can configure OpenCode using a JSON config file.

---

## [Format](#format)

OpenCode supports both **JSON** and **JSONC** (JSON with Comments) formats.

opencode.jsonc

```
{

"$schema": "https://opencode.ai/config.json",

"model": "anthropic/claude-sonnet-4-5",

"autoupdate": true,

"server": {

"port": 4096,

},

}
```

---

## [Locations](#locations)

You can place your config in a couple of different locations and they have a
different order of precedence.

Configuration files are merged together, not replaced. Settings from the following config locations are combined. Later configs override earlier ones only for conflicting keys. Non-conflicting settings from all configs are preserved.

For example, if your global config sets `autoupdate: true` and your project config sets `model: "anthropic/claude-sonnet-4-5"`, the final configuration will include both settings.

---

### [Precedence order](#precedence-order)

Config sources are loaded in this order (later sources override earlier ones):

1. **Remote config** (from `.well-known/opencode`) - organizational defaults
2. **Global config** (`~/.config/opencode/opencode.json`) - user preferences
3. **Custom config** (`OPENCODE_CONFIG` env var) - custom overrides
4. **Project config** (`opencode.json` in project) - project-specific settings
5. **`.opencode` directories** - agents, commands, plugins
6. **Inline config** (`OPENCODE_CONFIG_CONTENT` env var) - runtime overrides

This means project configs can override global defaults, and global configs can override remote organizational defaults.

---

### [Remote](#remote)

Organizations can provide default configuration via the `.well-known/opencode` endpoint. This is fetched automatically when you authenticate with a provider that supports it.

Remote config is loaded first, serving as the base layer. All other config sources (global, project) can override these defaults.

For example, if your organization provides MCP servers that are disabled by default:

Remote config from .well-known/opencode

```
{

"mcp": {

"jira": {

"type": "remote",

"url": "https://jira.example.com/mcp",

"enabled": false

}

}

}
```

You can enable specific servers in your local config:

opencode.json

```
{

"mcp": {

"jira": {

"type": "remote",

"url": "https://jira.example.com/mcp",

"enabled": true

}

}

}
```

---

### [Global](#global)

Place your global OpenCode config in `~/.config/opencode/opencode.json`. Use global config for user-wide server/runtime preferences like providers, models, and permissions.

For TUI-specific settings, use `~/.config/opencode/tui.json`.

Global config overrides remote organizational defaults.

---

### [Per project](#per-project)

Add `opencode.json` in your project root. Project config has the highest precedence among standard config files - it overrides both global and remote configs.

For project-specific TUI settings, add `tui.json` alongside it.

When OpenCode starts up, it looks for a config file in the current directory or traverse up to the nearest Git directory.

This is also safe to be checked into Git and uses the same schema as the global one.

---

### [Custom path](#custom-path)

Specify a custom config file path using the `OPENCODE_CONFIG` environment variable.

Terminal window

```
export OPENCODE_CONFIG=/path/to/my/custom-config.json

opencode run "Hello world"
```

Custom config is loaded between global and project configs in the precedence order.

---

### [Custom directory](#custom-directory)

Specify a custom config directory using the `OPENCODE_CONFIG_DIR`
environment variable. This directory will be searched for agents, commands,
modes, and plugins just like the standard `.opencode` directory, and should
follow the same structure.

Terminal window

```
export OPENCODE_CONFIG_DIR=/path/to/my/config-directory

opencode run "Hello world"
```

The custom directory is loaded after the global config and `.opencode` directories, so it **can override** their settings.

---

## [Schema](#schema)

The server/runtime config schema is defined in [**`opencode.ai/config.json`**](https://opencode.ai/config.json).

TUI config uses [**`opencode.ai/tui.json`**](https://opencode.ai/tui.json).

Your editor should be able to validate and autocomplete based on the schema.

---

### [TUI](#tui)

Use a dedicated `tui.json` (or `tui.jsonc`) file for TUI-specific settings.

tui.json

```
{

"$schema": "https://opencode.ai/tui.json",

"scroll_speed": 3,

"scroll_acceleration": {

"enabled": true

},

"diff_style": "auto"

}
```

Use `OPENCODE_TUI_CONFIG` to point to a custom TUI config file.

Legacy `theme`, `keybinds`, and `tui` keys in `opencode.json` are deprecated and automatically migrated when possible.

[Learn more about TUI configuration here](/docs/tui#configure).

---

### [Server](#server)

You can configure server settings for the `opencode serve` and `opencode web` commands through the `server` option.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"server": {

"port": 4096,

"hostname": "0.0.0.0",

"mdns": true,

"mdnsDomain": "myproject.local",

"cors": ["http://localhost:5173"]

}

}
```

Available options:

* `port` - Port to listen on.
* `hostname` - Hostname to listen on. When `mdns` is enabled and no hostname is set, defaults to `0.0.0.0`.
* `mdns` - Enable mDNS service discovery. This allows other devices on the network to discover your OpenCode server.
* `mdnsDomain` - Custom domain name for mDNS service. Defaults to `opencode.local`. Useful for running multiple instances on the same network.
* `cors` - Additional origins to allow for CORS when using the HTTP server from a browser-based client. Values must be full origins (scheme + host + optional port), eg `https://app.example.com`.

[Learn more about the server here](/docs/server).

---

### [Tools](#tools)

You can manage the tools an LLM can use through the `tools` option.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"tools": {

"write": false,

"bash": false

}

}
```

[Learn more about tools here](/docs/tools).

---

### [Models](#models)

You can configure the providers and models you want to use in your OpenCode config through the `provider`, `model` and `small_model` options.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {},

"model": "anthropic/claude-sonnet-4-5",

"small_model": "anthropic/claude-haiku-4-5"

}
```

The `small_model` option configures a separate model for lightweight tasks like title generation. By default, OpenCode tries to use a cheaper model if one is available from your provider, otherwise it falls back to your main model.

Provider options can include `timeout`, `chunkTimeout`, and `setCacheKey`:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"anthropic": {

"options": {

"timeout": 600000,

"chunkTimeout": 30000,

"setCacheKey": true

}

}

}

}
```

* `timeout` - Request timeout in milliseconds (default: 300000). Set to `false` to disable.
* `chunkTimeout` - Timeout in milliseconds between streamed response chunks. If no chunk arrives in time, the request is aborted.
* `setCacheKey` - Ensure a cache key is always set for designated provider.

You can also configure [local models](/docs/models#local). [Learn more](/docs/models).

---

#### [Provider-Specific Options](#provider-specific-options)

Some providers support additional configuration options beyond the generic `timeout` and `apiKey` settings.

##### [Amazon Bedrock](#amazon-bedrock)

Amazon Bedrock supports AWS-specific configuration:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"provider": {

"amazon-bedrock": {

"options": {

"region": "us-east-1",

"profile": "my-aws-profile",

"endpoint": "https://bedrock-runtime.us-east-1.vpce-xxxxx.amazonaws.com"

}

}

}

}
```

* `region` - AWS region for Bedrock (defaults to `AWS_REGION` env var or `us-east-1`)
* `profile` - AWS named profile from `~/.aws/credentials` (defaults to `AWS_PROFILE` env var)
* `endpoint` - Custom endpoint URL for VPC endpoints. This is an alias for the generic `baseURL` option using AWS-specific terminology. If both are specified, `endpoint` takes precedence.

[Learn more about Amazon Bedrock configuration](/docs/providers#amazon-bedrock).

---

### [Themes](#themes)

Set your UI theme in `tui.json`.

tui.json

```
{

"$schema": "https://opencode.ai/tui.json",

"theme": "tokyonight"

}
```

[Learn more here](/docs/themes).

---

### [Agents](#agents)

You can configure specialized agents for specific tasks through the `agent` option.

opencode.jsonc

```
{

"$schema": "https://opencode.ai/config.json",

"agent": {

"code-reviewer": {

"description": "Reviews code for best practices and potential issues",

"model": "anthropic/claude-sonnet-4-5",

"prompt": "You are a code reviewer. Focus on security, performance, and maintainability.",

"tools": {

// Disable file modification tools for review-only agent

"write": false,

"edit": false,

},

},

},

}
```

You can also define agents using markdown files in `~/.config/opencode/agents/` or `.opencode/agents/`. [Learn more here](/docs/agents).

---

### [Default agent](#default-agent)

