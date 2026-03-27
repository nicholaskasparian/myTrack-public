# Source: https://opencode.ai/docs/mcp-servers/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# mcp — Part 1


# MCP servers

Add local and remote MCP tools.

You can add external tools to OpenCode using the *Model Context Protocol*, or MCP. OpenCode supports both local and remote servers.

Once added, MCP tools are automatically available to the LLM alongside built-in tools.

---

#### [Caveats](#caveats)

When you use an MCP server, it adds to the context. This can quickly add up if you have a lot of tools. So we recommend being careful with which MCP servers you use.

Certain MCP servers, like the GitHub MCP server, tend to add a lot of tokens and can easily exceed the context limit.

---

## [Enable](#enable)

You can define MCP servers in your [OpenCode Config](https://opencode.ai/docs/config/) under `mcp`. Add each MCP with a unique name. You can refer to that MCP by name when prompting the LLM.

opencode.jsonc

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"name-of-mcp-server": {

// ...

"enabled": true,

},

"name-of-other-mcp-server": {

// ...

},

},

}
```

You can also disable a server by setting `enabled` to `false`. This is useful if you want to temporarily disable a server without removing it from your config.

---

### [Overriding remote defaults](#overriding-remote-defaults)

Organizations can provide default MCP servers via their `.well-known/opencode` endpoint. These servers may be disabled by default, allowing users to opt-in to the ones they need.

To enable a specific server from your organizationâs remote config, add it to your local config with `enabled: true`:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"jira": {

"type": "remote",

"url": "https://jira.example.com/mcp",

"enabled": true

}

}

}
```

Your local config values override the remote defaults. See [config precedence](/docs/config#precedence-order) for more details.

---

## [Local](#local)

Add local MCP servers using `type` to `"local"` within the MCP object.

opencode.jsonc

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"my-local-mcp-server": {

"type": "local",

// Or ["bun", "x", "my-mcp-command"]

"command": ["npx", "-y", "my-mcp-command"],

"enabled": true,

"environment": {

"MY_ENV_VAR": "my_env_var_value",

},

},

},

}
```

The command is how the local MCP server is started. You can also pass in a list of environment variables as well.

For example, hereâs how you can add the test [`@modelcontextprotocol/server-everything`](https://www.npmjs.com/package/@modelcontextprotocol/server-everything) MCP server.

opencode.jsonc

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"mcp_everything": {

"type": "local",

"command": ["npx", "-y", "@modelcontextprotocol/server-everything"],

},

},

}
```

And to use it I can add `use the mcp_everything tool` to my prompts.

```
use the mcp_everything tool to add the number 3 and 4
```

---

#### [Options](#options)

Here are all the options for configuring a local MCP server.

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | String | Y | Type of MCP server connection, must be `"local"`. |
| `command` | Array | Y | Command and arguments to run the MCP server. |
| `environment` | Object |  | Environment variables to set when running the server. |
| `enabled` | Boolean |  | Enable or disable the MCP server on startup. |
| `timeout` | Number |  | Timeout in ms for fetching tools from the MCP server. Defaults to 5000 (5 seconds). |

---

## [Remote](#remote)

Add remote MCP servers by setting `type` to `"remote"`.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"my-remote-mcp": {

"type": "remote",

"url": "https://my-mcp-server.com",

"enabled": true,

"headers": {

"Authorization": "Bearer MY_API_KEY"

}

}

}

}
```

The `url` is the URL of the remote MCP server and with the `headers` option you can pass in a list of headers.

---

#### [Options](#options-1)

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | String | Y | Type of MCP server connection, must be `"remote"`. |
| `url` | String | Y | URL of the remote MCP server. |
| `enabled` | Boolean |  | Enable or disable the MCP server on startup. |
| `headers` | Object |  | Headers to send with the request. |
| `oauth` | Object |  | OAuth authentication configuration. See [OAuth](#oauth) section below. |
| `timeout` | Number |  | Timeout in ms for fetching tools from the MCP server. Defaults to 5000 (5 seconds). |

---

## [OAuth](#oauth)

OpenCode automatically handles OAuth authentication for remote MCP servers. When a server requires authentication, OpenCode will:

1. Detect the 401 response and initiate the OAuth flow
2. Use **Dynamic Client Registration (RFC 7591)** if supported by the server
3. Store tokens securely for future requests

---

### [Automatic](#automatic)

For most OAuth-enabled MCP servers, no special configuration is needed. Just configure the remote server:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"my-oauth-server": {

"type": "remote",

"url": "https://mcp.example.com/mcp"

}

}

}
```

If the server requires authentication, OpenCode will prompt you to authenticate when you first try to use it. If not, you can [manually trigger the flow](#authenticating) with `opencode mcp auth <server-name>`.

---

### [Pre-registered](#pre-registered)

If you have client credentials from the MCP server provider, you can configure them:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"my-oauth-server": {

"type": "remote",

"url": "https://mcp.example.com/mcp",

"oauth": {

"clientId": "{env:MY_MCP_CLIENT_ID}",

"clientSecret": "{env:MY_MCP_CLIENT_SECRET}",

"scope": "tools:read tools:execute"

}

}

}

}
```

---

### [Authenticating](#authenticating)

You can manually trigger authentication or manage credentials.

Authenticate with a specific MCP server:

Terminal window

```
opencode mcp auth my-oauth-server
```

List all MCP servers and their auth status:

Terminal window

```
opencode mcp list
```

Remove stored credentials:

Terminal window

```
opencode mcp logout my-oauth-server
```

The `mcp auth` command will open your browser for authorization. After you authorize, OpenCode will store the tokens securely in `~/.local/share/opencode/mcp-auth.json`.

---

#### [Disabling OAuth](#disabling-oauth)

If you want to disable automatic OAuth for a server (e.g., for servers that use API keys instead), set `oauth` to `false`:

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"my-api-key-server": {

"type": "remote",

"url": "https://mcp.example.com/mcp",

"oauth": false,

"headers": {

"Authorization": "Bearer {env:MY_API_KEY}"

}

}

}

}
```

---

#### [OAuth Options](#oauth-options)

| Option | Type | Description |
| --- | --- | --- |
| `oauth` | Object | false | OAuth config object, or `false` to disable OAuth auto-detection. |
| `clientId` | String | OAuth client ID. If not provided, dynamic client registration will be attempted. |
| `clientSecret` | String | OAuth client secret, if required by the authorization server. |
| `scope` | String | OAuth scopes to request during authorization. |

#### [Debugging](#debugging)

If a remote MCP server is failing to authenticate, you can diagnose issues with:

Terminal window

```
# View auth status for all OAuth-capable servers

opencode mcp auth list

# Debug connection and OAuth flow for a specific server

opencode mcp debug my-oauth-server
```

The `mcp debug` command shows the current auth status, tests HTTP connectivity, and attempts the OAuth discovery flow.

---

## [Manage](#manage)

Your MCPs are available as tools in OpenCode, alongside built-in tools. So you can manage them through the OpenCode config like any other tool.

---

### [Global](#global)

This means that you can enable or disable them globally.

opencode.json

```
{

"$schema": "https://opencode.ai/config.json",

"mcp": {

"my-mcp-foo": {

"type": "local",

"command": ["bun", "x", "my-mcp-command-foo"]

},

"my-mcp-bar": {

"type": "local",

"command": ["bun", "x", "my-mcp-command-bar"]

}

},

"tools": {

"my-mcp-foo": false

}

}
```

We can also use a glob pattern to disable all matching MCPs.

opencode.json

```
