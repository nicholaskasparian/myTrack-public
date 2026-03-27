# Source: https://playwright.dev/docs/locators
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# selectors — Part 2

http://localhost:3000

* ### Product 1

  Add to cart* ### Product 2

    Add to cart

```
<ul>
  <li>
    <h3>Product 1</h3>
    <button>Add to cart</button>
  </li>
  <li>
    <h3>Product 2</h3>
    <button>Add to cart</button>
  </li>
</ul>
```

```
await page
    .getByRole('listitem')
    .filter({ has: page.getByRole('heading', { name: 'Product 2' }) })
    .getByRole('button', { name: 'Add to cart' })
    .click();
```

We can also assert the product card to make sure there is only one:

```
await expect(page
    .getByRole('listitem')
    .filter({ has: page.getByRole('heading', { name: 'Product 2' }) }))
    .toHaveCount(1);
```

The filtering locator **must be relative** to the original locator and is queried starting with the original locator match, not the document root. Therefore, the following will not work, because the filtering locator starts matching from the `<ul>` list element that is outside of the `<li>` list item matched by the original locator:

```
// ✖ WRONG
await expect(page
    .getByRole('listitem')
    .filter({ has: page.getByRole('list').getByText('Product 2') }))
    .toHaveCount(1);
```

### Filter by not having child/descendant[​](#filter-by-not-having-childdescendant "Direct link to Filter by not having child/descendant")

We can also filter by **not having** a matching element inside.

```
await expect(page
    .getByRole('listitem')
    .filter({ hasNot: page.getByText('Product 2') }))
    .toHaveCount(1);
```

Note that the inner locator is matched starting from the outer one, not from the document root.

## Locator operators[​](#locator-operators "Direct link to Locator operators")

### Matching inside a locator[​](#matching-inside-a-locator "Direct link to Matching inside a locator")

You can chain methods that create a locator, like [page.getByText()](/docs/api/class-page#page-get-by-text) or [locator.getByRole()](/docs/api/class-locator#locator-get-by-role), to narrow down the search to a particular part of the page.

In this example we first create a locator called product by locating its role of `listitem`. We then filter by text. We can use the product locator again to get by role of button and click it and then use an assertion to make sure there is only one product with the text "Product 2".

```
const product = page.getByRole('listitem').filter({ hasText: 'Product 2' });

await product.getByRole('button', { name: 'Add to cart' }).click();

await expect(product).toHaveCount(1);
```

You can also chain two locators together, for example to find a "Save" button inside a particular dialog:

```
const saveButton = page.getByRole('button', { name: 'Save' });
// ...
const dialog = page.getByTestId('settings-dialog');
await dialog.locator(saveButton).click();
```

### Matching two locators simultaneously[​](#matching-two-locators-simultaneously "Direct link to Matching two locators simultaneously")

Method [locator.and()](/docs/api/class-locator#locator-and) narrows down an existing locator by matching an additional locator. For example, you can combine [page.getByRole()](/docs/api/class-page#page-get-by-role) and [page.getByTitle()](/docs/api/class-page#page-get-by-title) to match by both role and title.

```
const button = page.getByRole('button').and(page.getByTitle('Subscribe'));
```

### Matching one of the two alternative locators[​](#matching-one-of-the-two-alternative-locators "Direct link to Matching one of the two alternative locators")

If you'd like to target one of the two or more elements, and you don't know which one it will be, use [locator.or()](/docs/api/class-locator#locator-or) to create a locator that matches any one or both of the alternatives.

For example, consider a scenario where you'd like to click on a "New email" button, but sometimes a security settings dialog shows up instead. In this case, you can wait for either a "New email" button, or a dialog and act accordingly.

note

If both "New email" button and security dialog appear on screen, the "or" locator will match both of them, possibly throwing the ["strict mode violation" error](#strictness). In this case, you can use [locator.first()](/docs/api/class-locator#locator-first) to only match one of them.

```
const newEmail = page.getByRole('button', { name: 'New' });
const dialog = page.getByText('Confirm security settings');
await expect(newEmail.or(dialog).first()).toBeVisible();
if (await dialog.isVisible())
  await page.getByRole('button', { name: 'Dismiss' }).click();
await newEmail.click();
```

### Matching only visible elements[​](#matching-only-visible-elements "Direct link to Matching only visible elements")

note

It's usually better to find a [more reliable way](/docs/locators#quick-guide) to uniquely identify the element instead of checking the visibility.

Consider a page with two buttons, the first invisible and the second [visible](/docs/actionability#visible).

```
<button style='display: none'>Invisible</button>
<button>Visible</button>
```

* This will find both buttons and throw a [strictness](/docs/locators#strictness) violation error:

  ```
  await page.locator('button').click();
  ```
* This will only find a second button, because it is visible, and then click it.

  ```
  await page.locator('button').filter({ visible: true }).click();
  ```

## Lists[​](#lists "Direct link to Lists")

### Count items in a list[​](#count-items-in-a-list "Direct link to Count items in a list")

You can assert locators in order to count the items in a list.

For example, consider the following DOM structure:

http://localhost:3000

* apple* banana* orange

```
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

Use the count assertion to ensure that the list has 3 items.

```
await expect(page.getByRole('listitem')).toHaveCount(3);
```

### Assert all text in a list[​](#assert-all-text-in-a-list "Direct link to Assert all text in a list")

You can assert locators in order to find all the text in a list.

For example, consider the following DOM structure:

http://localhost:3000

* apple* banana* orange

```
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

Use [expect(locator).toHaveText()](/docs/api/class-locatorassertions#locator-assertions-to-have-text) to ensure that the list has the text "apple", "banana" and "orange".

```
await expect(page
    .getByRole('listitem'))
    .toHaveText(['apple', 'banana', 'orange']);
```

### Get a specific item[​](#get-a-specific-item "Direct link to Get a specific item")

There are many ways to get a specific item in a list.

#### Get by text[​](#get-by-text "Direct link to Get by text")

Use the [page.getByText()](/docs/api/class-page#page-get-by-text) method to locate an element in a list by its text content and then click on it.

For example, consider the following DOM structure:

http://localhost:3000

* apple* banana* orange

```
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

Locate an item by its text content and click it.

```
await page.getByText('orange').click();
```

#### Filter by text[​](#filter-by-text-1 "Direct link to Filter by text")

Use the [locator.filter()](/docs/api/class-locator#locator-filter) to locate a specific item in a list.

For example, consider the following DOM structure:

http://localhost:3000

* apple* banana* orange

```
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

Locate an item by the role of "listitem" and then filter by the text of "orange" and then click it.

```
await page
    .getByRole('listitem')
    .filter({ hasText: 'orange' })
    .click();
```

#### Get by test id[​](#get-by-test-id "Direct link to Get by test id")

Use the [page.getByTestId()](/docs/api/class-page#page-get-by-test-id) method to locate an element in a list. You may need to modify the html and add a test id if you don't already have a test id.

For example, consider the following DOM structure:

http://localhost:3000

* apple* banana* orange

```
<ul>
  <li data-testid='apple'>apple</li>
  <li data-testid='banana'>banana</li>
  <li data-testid='orange'>orange</li>
</ul>
```

Locate an item by its test id of "orange" and then click it.

```
await page.getByTestId('orange').click();
```

#### Get by nth item[​](#get-by-nth-item "Direct link to Get by nth item")

If you have a list of identical elements, and the only way to distinguish between them is the order, you can choose a specific element from a list with [locator.first()](/docs/api/class-locator#locator-first), [locator.last()](/docs/api/class-locator#locator-last) or [locator.nth()](/docs/api/class-locator#locator-nth).

```
const banana = await page.getByRole('listitem').nth(1);
```

However, use this method with caution. Often times, the page might change, and the locator will point to a completely different element from the one you expected. Instead, try to come up with a unique locator that will pass the [strictness criteria](#strictness).

### Chaining filters[​](#chaining-filters "Direct link to Chaining filters")

When you have elements with various similarities, you can use the [locator.filter()](/docs/api/class-locator#locator-filter) method to select the right one. You can also chain multiple filters to narrow down the selection.

For example, consider the following DOM structure:

http://localhost:3000

* John

  Say hello

  * Mary

    Say hello

    * John

      Say goodbye

      * Mary

        Say goodbye

```
<ul>
  <li>
    <div>John</div>
    <div><button>Say hello</button></div>
  </li>
  <li>
    <div>Mary</div>
    <div><button>Say hello</button></div>
  </li>
  <li>
    <div>John</div>
    <div><button>Say goodbye</button></div>
  </li>
  <li>
    <div>Mary</div>
    <div><button>Say goodbye</button></div>
  </li>
</ul>
```

To take a screenshot of the row with "Mary" and "Say goodbye":

```
const rowLocator = page.getByRole('listitem');

await rowLocator
    .filter({ hasText: 'Mary' })
    .filter({ has: page.getByRole('button', { name: 'Say goodbye' }) })
    .screenshot({ path: 'screenshot.png' });
```

You should now have a "screenshot.png" file in your project's root directory.

### Rare use cases[​](#rare-use-cases "Direct link to Rare use cases")

#### Do something with each element in the list[​](#do-something-with-each-element-in-the-list "Direct link to Do something with each element in the list")

Iterate elements:

```
for (const row of await page.getByRole('listitem').all())
  console.log(await row.textContent());
```

Iterate using regular for loop:

```
const rows = page.getByRole('listitem');
const count = await rows.count();
for (let i = 0; i < count; ++i)
  console.log(await rows.nth(i).textContent());
```

#### Evaluate in the page[​](#evaluate-in-the-page "Direct link to Evaluate in the page")

The code inside [locator.evaluateAll()](/docs/api/class-locator#locator-evaluate-all) runs in the page, you can call any DOM apis there.

```
const rows = page.getByRole('listitem');
const texts = await rows.evaluateAll(
    list => list.map(element => element.textContent));
```

## Strictness[​](#strictness "Direct link to Strictness")

Locators are strict. This means that all operations on locators that imply some target DOM element will throw an exception if more than one element matches. For example, the following call throws if there are several buttons in the DOM:

#### Throws an error if more than one[​](#throws-an-error-if-more-than-one "Direct link to Throws an error if more than one")

```
await page.getByRole('button').click();
```

On the other hand, Playwright understands when you perform a multiple-element operation, so the following call works perfectly fine when the locator resolves to multiple elements.

#### Works fine with multiple elements[​](#works-fine-with-multiple-elements "Direct link to Works fine with multiple elements")

```
await page.getByRole('button').count();
```

You can explicitly opt-out from strictness check by telling Playwright which element to use when multiple elements match, through [locator.first()](/docs/api/class-locator#locator-first), [locator.last()](/docs/api/class-locator#locator-last), and [locator.nth()](/docs/api/class-locator#locator-nth). These methods are **not recommended** because when your page changes, Playwright may click on an element you did not intend. Instead, follow best practices above to create a locator that uniquely identifies the target element.

## More Locators[​](#more-locators "Direct link to More Locators")

For less commonly used locators, look at the [other locators](/docs/other-locators) guide.

* [Introduction](#introduction)
  + [Quick Guide](#quick-guide)* [Locating elements](#locating-elements)
    + [Locate by role](#locate-by-role)+ [Locate by label](#locate-by-label)+ [Locate by placeholder](#locate-by-placeholder)+ [Locate by text](#locate-by-text)+ [Locate by alt text](#locate-by-alt-text)+ [Locate by title](#locate-by-title)+ [Locate by test id](#locate-by-test-id)+ [Locate by CSS or XPath](#locate-by-css-or-xpath)* [Locate in Shadow DOM](#locate-in-shadow-dom)* [Filtering Locators](#filtering-locators)
        + [Filter by text](#filter-by-text)+ [Filter by not having text](#filter-by-not-having-text)+ [Filter by child/descendant](#filter-by-childdescendant)+ [Filter by not having child/descendant](#filter-by-not-having-childdescendant)* [Locator operators](#locator-operators)
          + [Matching inside a locator](#matching-inside-a-locator)+ [Matching two locators simultaneously](#matching-two-locators-simultaneously)+ [Matching one of the two alternative locators](#matching-one-of-the-two-alternative-locators)+ [Matching only visible elements](#matching-only-visible-elements)* [Lists](#lists)
            + [Count items in a list](#count-items-in-a-list)+ [Assert all text in a list](#assert-all-text-in-a-list)+ [Get a specific item](#get-a-specific-item)+ [Chaining filters](#chaining-filters)+ [Rare use cases](#rare-use-cases)* [Strictness](#strictness)* [More Locators](#more-locators)
