# Source: https://opencode.ai/docs/config/
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# config — Part 2

You can set the default agent using the `default_agent` option. This determines which agent is used when none is explicitly specified.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"default_agent": "plan"

}
```

The default agent must be a primary agent (not a subagent). This can be a built-in agent like `"build"` or `"plan"`, or a [custom agent](/docs/agents) youâve defined. If the specified agent doesnât exist or is a subagent, OpenCode will fall back to `"build"` with a warning.

This setting applies across all interfaces: TUI, CLI (`opencode run`), desktop app, and GitHub Action.

---

### [Sharing](#sharing)

You can configure the [share](/docs/share) feature through the `share` option.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"share": "manual"

}
```

This takes:

* `"manual"` - Allow manual sharing via commands (default)
* `"auto"` - Automatically share new conversations
* `"disabled"` - Disable sharing entirely

By default, sharing is set to manual mode where you need to explicitly share conversations using the `/share` command.

---

### [Commands](#commands)

You can configure custom commands for repetitive tasks through the `command` option.

opencode.jsonc

```
{

"$schema": "https://opencode.ai/config.json",

"command": {

"test": {

"template": "Run the full test suite with coverage report and show any failures.\nFocus on the failing tests and suggest fixes.",

"description": "Run tests with coverage",

"agent": "build",

"model": "anthropic/claude-haiku-4-5",

},

"component": {

"template": "Create a new React component named $ARGUMENTS with TypeScript support.\nInclude proper typing and basic structure.",

"description": "Create a new component",

},

},

}
```

You can also define commands using markdown files in `~/.config/opencode/commands/` or `.opencode/commands/`. [Learn more here](/docs/commands).

---

### [Keybinds](#keybinds)

Customize keybinds in `tui.json`.

tui.json

```
{

"$schema": "https://opencode.ai/tui.json",

"keybinds": {}

}
```

[Learn more here](/docs/keybinds).

---

### [Snapshot](#snapshot)

OpenCode uses snapshots to track file changes during agent operations, enabling you to undo and revert changes within a session. Snapshots are enabled by default.

For large repositories or projects with many submodules, the snapshot system can cause slow indexing and significant disk usage as it tracks all changes using an internal git repository. You can disable snapshots using the `snapshot` option.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"snapshot": false

}
```

Note that disabling snapshots means changes made by the agent cannot be rolled back through the UI.

---

### [Autoupdate](#autoupdate)

OpenCode will automatically download any new updates when it starts up. You can disable this with the `autoupdate` option.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"autoupdate": false

}
```

If you donât want updates but want to be notified when a new version is available, set `autoupdate` to `"notify"`.
Notice that this only works if it was not installed using a package manager such as Homebrew.

---

### [Formatters](#formatters)

You can configure code formatters through the `formatter` option.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"formatter": {

"prettier": {

"disabled": true

},

"custom-prettier": {

"command": ["npx", "prettier", "--write", "$FILE"],

"environment": {

"NODE_ENV": "development"

},

"extensions": [".js", ".ts", ".jsx", ".tsx"]

}

}

}
```

[Learn more about formatters here](/docs/formatters).

---

### [Permissions](#permissions)

By default, opencode **allows all operations** without requiring explicit approval. You can change this using the `permission` option.

For example, to ensure that the `edit` and `bash` tools require user approval:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"permission": {

"edit": "ask",

"bash": "ask"

}

}
```

[Learn more about permissions here](/docs/permissions).

---

### [Compaction](#compaction)

You can control context compaction behavior through the `compaction` option.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"compaction": {

"auto": true,

"prune": true,

"reserved": 10000

}

}
```

* `auto` - Automatically compact the session when context is full (default: `true`).
* `prune` - Remove old tool outputs to save tokens (default: `true`).
* `reserved` - Token buffer for compaction. Leaves enough window to avoid overflow during compaction

---

### [Watcher](#watcher)

You can configure file watcher ignore patterns through the `watcher` option.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"watcher": {

"ignore": ["node_modules/**", "dist/**", ".git/**"]

}

}
```

Patterns follow glob syntax. Use this to exclude noisy directories from file watching.

---

### [MCP servers](#mcp-servers)

You can configure MCP servers you want to use through the `mcp` option.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {}

}
```

[Learn more here](/docs/mcp-servers).

---

### [Plugins](#plugins)

[Plugins](/docs/plugins) extend OpenCode with custom tools, hooks, and integrations.

Place plugin files in `.opencode/plugins/` or `~/.config/opencode/plugins/`. You can also load plugins from npm through the `plugin` option.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"plugin": ["opencode-helicone-session", "@my-org/custom-plugin"]

}
```

[Learn more here](/docs/plugins).

---

### [Instructions](#instructions)

You can configure the instructions for the model youâre using through the `instructions` option.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"instructions": ["CONTRIBUTING.md", "docs/guidelines.md", ".cursor/rules/*.md"]

}
```

This takes an array of paths and glob patterns to instruction files. [Learn more
about rules here](/docs/rules).

---

### [Disabled providers](#disabled-providers)

You can disable providers that are loaded automatically through the `disabled_providers` option. This is useful when you want to prevent certain providers from being loaded even if their credentials are available.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"disabled_providers": ["openai", "gemini"]

}
```

The `disabled_providers` option accepts an array of provider IDs. When a provider is disabled:

* It wonât be loaded even if environment variables are set.
* It wonât be loaded even if API keys are configured through the `/connect` command.
* The providerâs models wonât appear in the model selection list.

---

### [Enabled providers](#enabled-providers)

You can specify an allowlist of providers through the `enabled_providers` option. When set, only the specified providers will be enabled and all others will be ignored.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"enabled_providers": ["anthropic", "openai"]

}
```

This is useful when you want to restrict OpenCode to only use specific providers rather than disabling them one by one.

If a provider appears in both `enabled_providers` and `disabled_providers`, the `disabled_providers` takes priority for backwards compatibility.

---

### [Experimental](#experimental)

The `experimental` key contains options that are under active development.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"experimental": {}

}
```

---

## [Variables](#variables)

You can use variable substitution in your config files to reference environment variables and file contents.

---

### [Env vars](#env-vars)

Use `{env:VARIABLE_NAME}` to substitute environment variables:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"model": "{env:OPENCODE_MODEL}",

"provider": {

"anthropic": {

"models": {},

"options": {

"apiKey": "{env:ANTHROPIC_API_KEY}"

}

}

}

}
```

If the environment variable is not set, it will be replaced with an empty string.

---

### [Files](#files)

Use `{file:path/to/file}` to substitute the contents of a file:

opencode.json

