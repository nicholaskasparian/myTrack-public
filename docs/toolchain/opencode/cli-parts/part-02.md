# Source: https://opencode.ai/docs/cli/
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# cli — Part 2


---

#### [list](#list-3)

List all OpenCode sessions.

Terminal window

```
opencode session list
```

##### [Flags](#flags-6)

| Flag | Short | Description |
| --- | --- | --- |
| `--max-count` | `-n` | Limit to N most recent sessions |
| `--format` |  | Output format: table or json (table) |

---

### [stats](#stats)

Show token usage and cost statistics for your OpenCode sessions.

Terminal window

```
opencode stats
```

#### [Flags](#flags-7)

| Flag | Description |
| --- | --- |
| `--days` | Show stats for the last N days (all time) |
| `--tools` | Number of tools to show (all) |
| `--models` | Show model usage breakdown (hidden by default). Pass a number to show top N |
| `--project` | Filter by project (all projects, empty string: current project) |

---

### [export](#export)

Export session data as JSON.

Terminal window

```
opencode export [sessionID]
```

If you donât provide a session ID, youâll be prompted to select from available sessions.

---

### [import](#import)

Import session data from a JSON file or OpenCode share URL.

Terminal window

```
opencode import <file>
```

You can import from a local file or an OpenCode share URL.

Terminal window

```
opencode import session.json

opencode import https://opncd.ai/s/abc123
```

---

### [web](#web)

Start a headless OpenCode server with a web interface.

Terminal window

```
opencode web
```

This starts an HTTP server and opens a web browser to access OpenCode through a web interface. Set `OPENCODE_SERVER_PASSWORD` to enable HTTP basic auth (username defaults to `opencode`).

#### [Flags](#flags-8)

| Flag | Description |
| --- | --- |
| `--port` | Port to listen on |
| `--hostname` | Hostname to listen on |
| `--mdns` | Enable mDNS discovery |
| `--cors` | Additional browser origin(s) to allow CORS |

---

### [acp](#acp)

Start an ACP (Agent Client Protocol) server.

Terminal window

```
opencode acp
```

This command starts an ACP server that communicates via stdin/stdout using nd-JSON.

#### [Flags](#flags-9)

| Flag | Description |
| --- | --- |
| `--cwd` | Working directory |
| `--port` | Port to listen on |
| `--hostname` | Hostname to listen on |

---

### [uninstall](#uninstall)

Uninstall OpenCode and remove all related files.

Terminal window

```
opencode uninstall
```

#### [Flags](#flags-10)

| Flag | Short | Description |
| --- | --- | --- |
| `--keep-config` | `-c` | Keep configuration files |
| `--keep-data` | `-d` | Keep session data and snapshots |
| `--dry-run` |  | Show what would be removed without removing |
| `--force` | `-f` | Skip confirmation prompts |

---

### [upgrade](#upgrade)

Updates opencode to the latest version or a specific version.

Terminal window

```
opencode upgrade [target]
```

To upgrade to the latest version.

Terminal window

```
opencode upgrade
```

To upgrade to a specific version.

Terminal window

```
opencode upgrade v0.1.48
```

#### [Flags](#flags-11)

| Flag | Short | Description |
| --- | --- | --- |
| `--method` | `-m` | The installation method that was used; curl, npm, pnpm, bun, brew |

---

## [Global Flags](#global-flags)

The opencode CLI takes the following global flags.

| Flag | Short | Description |
| --- | --- | --- |
| `--help` | `-h` | Display help |
| `--version` | `-v` | Print version number |
| `--print-logs` |  | Print logs to stderr |
| `--log-level` |  | Log level (DEBUG, INFO, WARN, ERROR) |

---

## [Environment variables](#environment-variables)

OpenCode can be configured using environment variables.

| Variable | Type | Description |
| --- | --- | --- |
| `OPENCODE_AUTO_SHARE` | boolean | Automatically share sessions |
| `OPENCODE_GIT_BASH_PATH` | string | Path to Git Bash executable on Windows |
| `OPENCODE_CONFIG` | string | Path to config file |
| `OPENCODE_TUI_CONFIG` | string | Path to TUI config file |
| `OPENCODE_CONFIG_DIR` | string | Path to config directory |
| `OPENCODE_CONFIG_CONTENT` | string | Inline json config content |
| `OPENCODE_DISABLE_AUTOUPDATE` | boolean | Disable automatic update checks |
| `OPENCODE_DISABLE_PRUNE` | boolean | Disable pruning of old data |
| `OPENCODE_DISABLE_TERMINAL_TITLE` | boolean | Disable automatic terminal title updates |
| `OPENCODE_PERMISSION` | string | Inlined json permissions config |
| `OPENCODE_DISABLE_DEFAULT_PLUGINS` | boolean | Disable default plugins |
| `OPENCODE_DISABLE_LSP_DOWNLOAD` | boolean | Disable automatic LSP server downloads |
| `OPENCODE_ENABLE_EXPERIMENTAL_MODELS` | boolean | Enable experimental models |
| `OPENCODE_DISABLE_AUTOCOMPACT` | boolean | Disable automatic context compaction |
| `OPENCODE_DISABLE_CLAUDE_CODE` | boolean | Disable reading from `.claude` (prompt + skills) |
| `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT` | boolean | Disable reading `~/.claude/CLAUDE.md` |
| `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS` | boolean | Disable loading `.claude/skills` |
| `OPENCODE_DISABLE_MODELS_FETCH` | boolean | Disable fetching models from remote sources |
| `OPENCODE_FAKE_VCS` | string | Fake VCS provider for testing purposes |
| `OPENCODE_DISABLE_FILETIME_CHECK` | boolean | Disable file time checking for optimization |
| `OPENCODE_CLIENT` | string | Client identifier (defaults to `cli`) |
| `OPENCODE_ENABLE_EXA` | boolean | Enable Exa web search tools |
| `OPENCODE_SERVER_PASSWORD` | string | Enable basic auth for `serve`/`web` |
| `OPENCODE_SERVER_USERNAME` | string | Override basic auth username (default `opencode`) |
| `OPENCODE_MODELS_URL` | string | Custom URL for fetching models configuration |

---

### [Experimental](#experimental)

These environment variables enable experimental features that may change or be removed.

| Variable | Type | Description |
| --- | --- | --- |
| `OPENCODE_EXPERIMENTAL` | boolean | Enable all experimental features |
| `OPENCODE_EXPERIMENTAL_ICON_DISCOVERY` | boolean | Enable icon discovery |
| `OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT` | boolean | Disable copy on select in TUI |
| `OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS` | number | Default timeout for bash commands in ms |
| `OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX` | number | Max output tokens for LLM responses |
| `OPENCODE_EXPERIMENTAL_FILEWATCHER` | boolean | Enable file watcher for entire dir |
| `OPENCODE_EXPERIMENTAL_OXFMT` | boolean | Enable oxfmt formatter |
| `OPENCODE_EXPERIMENTAL_LSP_TOOL` | boolean | Enable experimental LSP tool |
| `OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER` | boolean | Disable file watcher |
| `OPENCODE_EXPERIMENTAL_EXA` | boolean | Enable experimental Exa features |
| `OPENCODE_EXPERIMENTAL_LSP_TY` | boolean | Enable TY LSP for python files |
| `OPENCODE_EXPERIMENTAL_MARKDOWN` | boolean | Enable experimental markdown features |
| `OPENCODE_EXPERIMENTAL_PLAN_MODE` | boolean | Enable plan mode |
