# Source: https://ai.google.dev/gemini-api/docs/gemini-3
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# gemini3 — Part 4

  use a separate model to access the Computer Use tool.
* **Tool support**: [Combining built-in tools with function calling](/gemini-api/docs/tool-combination) is now supported for Gemini 3 models. [Maps
  grounding](/gemini-api/docs/maps-grounding) is also now supported for Gemini 3
  models.

## OpenAI compatibility

For users utilizing the [OpenAI compatibility layer](/gemini-api/docs/openai),
standard parameters (OpenAI's `reasoning_effort`) are automatically mapped to
Gemini (`thinking_level`) equivalents.

## Prompting best practices

Gemini 3 is a reasoning model, which changes how you should prompt.

* **Precise instructions:** Be concise in your input prompts. Gemini 3 responds
  best to direct, clear instructions. It may over-analyze verbose or overly
  complex prompt engineering techniques used for older models.
* **Output verbosity:** By default, Gemini 3 is less verbose and prefers
  providing direct, efficient answers. If your use case requires a more
  conversational or "chatty" persona, you must explicitly steer the model in the
  prompt (e.g., "Explain this as a friendly, talkative assistant").
* **Context management:** When working with large datasets (e.g., entire books,
  odebases, or long videos), place your specific instructions or questions at the
  end of the prompt, after the data context. Anchor the model's reasoning to the
  provided data by starting your question with a phrase like, "Based on the
  information above...".

Learn more about prompt design strategies in the [prompt engineering guide](/gemini-api/docs/prompting-strategies).

## FAQ

1. **What is the knowledge cutoff for Gemini 3?** Gemini 3 models have a
   knowledge cutoff of January 2025. For more recent information, use the
   [Search Grounding](/gemini-api/docs/google-search) tool.
2. **What are the context window limits?** Gemini 3 models support a 1 million
   token input context window and up to 64k tokens of output.
3. **Is there a free tier for Gemini 3?** Gemini 3 Flash
   `gemini-3-flash-preview` and 3.1 Flash-Lite `gemini-3.1-flash-lite-preview` have
   free tiers in the Gemini API. You can try Gemini 3.1 Pro and 3 Flash for free in
   Google AI Studio, but there is no free tier available for
   `gemini-3.1-pro-preview` in the Gemini API.
4. **Will my old `thinking_budget` code still work?** Yes, `thinking_budget` is
   still supported for backward compatibility, but we recommend migrating to
   `thinking_level` for more predictable performance. Do not use both in the same
   request.
5. **Does Gemini 3 support the Batch API?** Yes, Gemini 3 supports the
   [Batch API](/gemini-api/docs/batch-api).
6. **Is Context Caching supported?** Yes, [Context Caching](/gemini-api/docs/caching) is supported for Gemini 3.
7. **Which tools are supported in Gemini 3?** Gemini 3 supports [Google Search](/gemini-api/docs/google-search), [Grounding with Google Maps](/gemini-api/docs/maps-grounding), [File Search](/gemini-api/docs/file-search),
   [Code Execution](/gemini-api/docs/code-execution), and [URL Context](/gemini-api/docs/url-context). It also supports standard [Function Calling](/gemini-api/docs/function-calling) for your own custom tools,
   and in [combination with built-in tools](/gemini-api/docs/tool-combination).
8. **What is `gemini-3.1-pro-preview-customtools`?** If you are using `gemini-3.1-pro-preview` and the model ignores your custom tools in favor of bash commands, try the `gemini-3.1-pro-preview-customtools` model instead. More info [here](/gemini-api/docs/models/gemini-3.1-pro-preview#gemini-31-pro-preview-customtools).

## Next steps

* Get started with the [Gemini 3 Cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started.ipynb#templateParams=%7B%22MODEL_ID%22%3A+%22gemini-3-pro-preview%22%7D)
* Check the dedicated Cookbook guide on [thinking levels](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_thinking_REST.ipynb#gemini3) and how to migrate from thinking budget to thinking levels.

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-03-23 UTC.

Need to tell us more?

[[["Easy to understand","easyToUnderstand","thumb-up"],["Solved my problem","solvedMyProblem","thumb-up"],["Other","otherUp","thumb-up"]],[["Missing the information I need","missingTheInformationINeed","thumb-down"],["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"],["Out of date","outOfDate","thumb-down"],["Samples / code issue","samplesCodeIssue","thumb-down"],["Other","otherDown","thumb-down"]],["Last updated 2026-03-23 UTC."],[],[]]
