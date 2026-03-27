# Source: https://opencode.ai/docs/config/
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# config — Part 3

```
{

"$schema": "https://opencode.ai/config.json",

"instructions": ["./custom-instructions.md"],

"provider": {

"openai": {

"options": {

"apiKey": "{file:~/.secrets/openai-key}"

}

}

}

}
```

File paths can be:

* Relative to the config file directory
* Or absolute paths starting with `/` or `~`

These are useful for:

* Keeping sensitive data like API keys in separate files.
* Including large instruction files without cluttering your config.
* Sharing common configuration snippets across multiple config files.
