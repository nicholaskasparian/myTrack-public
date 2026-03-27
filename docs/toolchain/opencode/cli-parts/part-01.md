# Source: https://opencode.ai/docs/cli/
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# cli — Part 1


# CLI

OpenCode CLI options and commands.

The OpenCode CLI by default starts the [TUI](/docs/tui) when run without any arguments.

Terminal window

```
opencode
```

But it also accepts commands as documented on this page. This allows you to interact with OpenCode programmatically.

Terminal window

```
opencode run "Explain how closures work in JavaScript"
```

---

### [tui](#tui)

Start the OpenCode terminal user interface.

Terminal window

```
opencode [project]
```

#### [Flags](#flags)

| Flag | Short | Description |
| --- | --- | --- |
| `--continue` | `-c` | Continue the last session |
| `--session` | `-s` | Session ID to continue |
| `--fork` |  | Fork the session when continuing (use with `--continue` or `--session`) |
| `--prompt` |  | Prompt to use |
| `--model` | `-m` | Model to use in the form of provider/model |
| `--agent` |  | Agent to use |
| `--port` |  | Port to listen on |
| `--hostname` |  | Hostname to listen on |

---

## [Commands](#commands)

The OpenCode CLI also has the following commands.

---

### [agent](#agent)

Manage agents for OpenCode.

Terminal window

```
opencode agent [command]
```

---

### [attach](#attach)

Attach a terminal to an already running OpenCode backend server started via `serve` or `web` commands.

Terminal window

```
opencode attach [url]
```

This allows using the TUI with a remote OpenCode backend. For example:

Terminal window

```
# Start the backend server for web/mobile access

opencode web --port 4096 --hostname 0.0.0.0

# In another terminal, attach the TUI to the running backend

opencode attach http://10.20.30.40:4096
```

#### [Flags](#flags-1)

| Flag | Short | Description |
| --- | --- | --- |
| `--dir` |  | Working directory to start TUI in |
| `--session` | `-s` | Session ID to continue |

---

#### [create](#create)

Create a new agent with custom configuration.

Terminal window

```
opencode agent create
```

This command will guide you through creating a new agent with a custom system prompt and tool configuration.

---

#### [list](#list)

List all available agents.

Terminal window

```
opencode agent list
```

---

### [auth](#auth)

Command to manage credentials and login for providers.

Terminal window

```
opencode auth [command]
```

---

#### [login](#login)

OpenCode is powered by the provider list at [Models.dev](https://models.dev), so you can use `opencode auth login` to configure API keys for any provider youâd like to use. This is stored in `~/.local/share/opencode/auth.json`.

Terminal window

```
opencode auth login
```

When OpenCode starts up it loads the providers from the credentials file. And if there are any keys defined in your environments or a `.env` file in your project.

---

#### [list](#list-1)

Lists all the authenticated providers as stored in the credentials file.

Terminal window

```
opencode auth list
```

Or the short version.

Terminal window

```
opencode auth ls
```

---

#### [logout](#logout)

Logs you out of a provider by clearing it from the credentials file.

Terminal window

```
opencode auth logout
```

---

### [github](#github)

Manage the GitHub agent for repository automation.

Terminal window

```
opencode github [command]
```

---

#### [install](#install)

Install the GitHub agent in your repository.

Terminal window

```
opencode github install
```

This sets up the necessary GitHub Actions workflow and guides you through the configuration process. [Learn more](/docs/github).

---

#### [run](#run)

Run the GitHub agent. This is typically used in GitHub Actions.

Terminal window

```
opencode github run
```

##### [Flags](#flags-2)

| Flag | Description |
| --- | --- |
| `--event` | GitHub mock event to run the agent for |
| `--token` | GitHub personal access token |

---

### [mcp](#mcp)

Manage Model Context Protocol servers.

Terminal window

```
opencode mcp [command]
```

---

#### [add](#add)

Add an MCP server to your configuration.

Terminal window

```
opencode mcp add
```

This command will guide you through adding either a local or remote MCP server.

---

#### [list](#list-2)

List all configured MCP servers and their connection status.

Terminal window

```
opencode mcp list
```

Or use the short version.

Terminal window

```
opencode mcp ls
```

---

#### [auth](#auth-1)

Authenticate with an OAuth-enabled MCP server.

Terminal window

```
opencode mcp auth [name]
```

If you donât provide a server name, youâll be prompted to select from available OAuth-capable servers.

You can also list OAuth-capable servers and their authentication status.

Terminal window

```
opencode mcp auth list
```

Or use the short version.

Terminal window

```
opencode mcp auth ls
```

---

#### [logout](#logout-1)

Remove OAuth credentials for an MCP server.

Terminal window

```
opencode mcp logout [name]
```

---

#### [debug](#debug)

Debug OAuth connection issues for an MCP server.

Terminal window

```
opencode mcp debug <name>
```

---

### [models](#models)

List all available models from configured providers.

Terminal window

```
opencode models [provider]
```

This command displays all models available across your configured providers in the format `provider/model`.

This is useful for figuring out the exact model name to use in [your config](/docs/config/).

You can optionally pass a provider ID to filter models by that provider.

Terminal window

```
opencode models anthropic
```

#### [Flags](#flags-3)

| Flag | Description |
| --- | --- |
| `--refresh` | Refresh the models cache from models.dev |
| `--verbose` | Use more verbose model output (includes metadata like costs) |

Use the `--refresh` flag to update the cached model list. This is useful when new models have been added to a provider and you want to see them in OpenCode.

Terminal window

```
opencode models --refresh
```

---

### [run](#run-1)

Run opencode in non-interactive mode by passing a prompt directly.

Terminal window

```
opencode run [message..]
```

This is useful for scripting, automation, or when you want a quick answer without launching the full TUI. For example.

Terminal window

```
opencode run Explain the use of context in Go
```

You can also attach to a running `opencode serve` instance to avoid MCP server cold boot times on every run:

Terminal window

```
# Start a headless server in one terminal

opencode serve

# In another terminal, run commands that attach to it

opencode run --attach http://localhost:4096 "Explain async/await in JavaScript"
```

#### [Flags](#flags-4)

| Flag | Short | Description |
| --- | --- | --- |
| `--command` |  | The command to run, use message for args |
| `--continue` | `-c` | Continue the last session |
| `--session` | `-s` | Session ID to continue |
| `--fork` |  | Fork the session when continuing (use with `--continue` or `--session`) |
| `--share` |  | Share the session |
| `--model` | `-m` | Model to use in the form of provider/model |
| `--agent` |  | Agent to use |
| `--file` | `-f` | File(s) to attach to message |
| `--format` |  | Format: default (formatted) or json (raw JSON events) |
| `--title` |  | Title for the session (uses truncated prompt if no value provided) |
| `--attach` |  | Attach to a running opencode server (e.g., <http://localhost:4096>) |
| `--port` |  | Port for the local server (defaults to random port) |

---

### [serve](#serve)

Start a headless OpenCode server for API access. Check out the [server docs](/docs/server) for the full HTTP interface.

Terminal window

```
opencode serve
```

This starts an HTTP server that provides API access to opencode functionality without the TUI interface. Set `OPENCODE_SERVER_PASSWORD` to enable HTTP basic auth (username defaults to `opencode`).

#### [Flags](#flags-5)

| Flag | Description |
| --- | --- |
| `--port` | Port to listen on |
| `--hostname` | Hostname to listen on |
| `--mdns` | Enable mDNS discovery |
| `--cors` | Additional browser origin(s) to allow CORS |

---

### [session](#session)

Manage OpenCode sessions.

Terminal window

```
opencode session [command]
```
