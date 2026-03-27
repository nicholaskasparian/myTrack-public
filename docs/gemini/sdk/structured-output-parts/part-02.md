# Source: https://ai.google.dev/gemini-api/docs/structured-output
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# structured-output — Part 2

  console.log(match);
}

run();
```

### REST

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [{
      "parts": [{"text": "Search for all details for the latest Euro."}]
    }],
    "tools": [
      {"googleSearch": {}},
      {"urlContext": {}}
    ],
    "generationConfig": {
        "responseMimeType": "application/json",
        "responseJsonSchema": {
            "type": "object",
            "properties": {
                "winner": {"type": "string", "description": "The name of the winner."},
                "final_match_score": {"type": "string", "description": "The final score."},
                "scorers": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "The name of the scorer."
                }
            },
            "required": ["winner", "final_match_score", "scorers"]
        }
    }
  }'
```

## JSON schema support

To generate a JSON object, set the `response_mime_type` in the generation configuration to `application/json` and provide a `response_json_schema`. The schema must be a valid [JSON Schema](https://json-schema.org/) that describes the desired output format.

The model will then generate a response that is a syntactically valid JSON string matching the provided schema. When using structured outputs, the model will produce outputs in the same order as the keys in the schema.

Gemini's structured output mode supports a subset of the [JSON Schema](https://json-schema.org) specification.

The following values of `type` are supported:

* **`string`**: For text.
* **`number`**: For floating-point numbers.
* **`integer`**: For whole numbers.
* **`boolean`**: For true/false values.
* **`object`**: For structured data with key-value pairs.
* **`array`**: For lists of items.
* **`null`**: To allow a property to be null, include `"null"` in the type array (e.g., `{"type": ["string", "null"]}`).

These descriptive properties help guide the model:

* **`title`**: A short description of a property.
* **`description`**: A longer and more detailed description of a property.

### Type-specific properties

**For `object` values:**

* **`properties`**: An object where each key is a property name and each value is a schema for that property.
* **`required`**: An array of strings, listing which properties are mandatory.
* **`additionalProperties`**: Controls whether properties not listed in `properties` are allowed. Can be a boolean or a schema.

**For `string` values:**

* **`enum`**: Lists a specific set of possible strings for classification tasks.
* **`format`**: Specifies a syntax for the string, such as `date-time`, `date`, `time`.

**For `number` and `integer` values:**

* **`enum`**: Lists a specific set of possible numeric values.
* **`minimum`**: The minimum inclusive value.
* **`maximum`**: The maximum inclusive value.

**For `array` values:**

* **`items`**: Defines the schema for all items in the array.
* **`prefixItems`**: Defines a list of schemas for the first N items, allowing for tuple-like structures.
* **`minItems`**: The minimum number of items in the array.
* **`maxItems`**: The maximum number of items in the array.

## Model support

The following models support structured output:

| Model | Structured Outputs |
| --- | --- |
| Gemini 3.1 Pro Preview | ✔️ |
| Gemini 3 Flash Preview | ✔️ |
| Gemini 2.5 Pro | ✔️ |
| Gemini 2.5 Flash | ✔️ |
| Gemini 2.5 Flash-Lite | ✔️ |
| Gemini 2.0 Flash | ✔️\* |
| Gemini 2.0 Flash-Lite | ✔️\* |

*\* Note that Gemini 2.0 requires an explicit `propertyOrdering` list within the JSON input to define the preferred structure. You can find an example in this [cookbook](https://github.com/google-gemini/cookbook/blob/main/examples/Pdf_structured_outputs_on_invoices_and_forms.ipynb).*

## Structured outputs vs. function calling

Both structured outputs and function calling use JSON schemas, but they serve different purposes:

| Feature | Primary Use Case |
| --- | --- |
| **Structured Outputs** | **Formatting the final response to the user.** Use this when you want the model's *answer* to be in a specific format (e.g., extracting data from a document to save to a database). |
| **Function Calling** | **Taking action during the conversation.** Use this when the model needs to *ask you* to perform a task (e.g., "get current weather") before it can provide a final answer. |

## Best practices

* **Clear descriptions:** Use the `description` field in your schema to provide clear instructions to the model about what each property represents. This is crucial for guiding the model's output.
* **Strong typing:** Use specific types (`integer`, `string`, `enum`) whenever possible. If a parameter has a limited set of valid values, use an `enum`.
* **Prompt engineering:** Clearly state in your prompt what you want the model to do. For example, "Extract the following information from the text..." or "Classify this feedback according to the provided schema...".
* **Validation:** While structured output guarantees syntactically correct JSON, it does not guarantee the values are semantically correct. Always validate the final output in your application code before using it.
* **Error handling:** Implement robust error handling in your application to gracefully manage cases where the model's output, while schema-compliant, may not meet your business logic requirements.

## Limitations

* **Schema subset:** Not all features of the JSON Schema specification are supported. The model ignores unsupported properties.
* **Schema complexity:** The API may reject very large or deeply nested schemas. If you encounter errors, try simplifying your schema by shortening property names, reducing nesting, or limiting the number of constraints.

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-02-26 UTC.

Need to tell us more?

[[["Easy to understand","easyToUnderstand","thumb-up"],["Solved my problem","solvedMyProblem","thumb-up"],["Other","otherUp","thumb-up"]],[["Missing the information I need","missingTheInformationINeed","thumb-down"],["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"],["Out of date","outOfDate","thumb-down"],["Samples / code issue","samplesCodeIssue","thumb-down"],["Other","otherDown","thumb-down"]],["Last updated 2026-02-26 UTC."],[],[]]
