# Source: https://playwright.dev/docs/locators
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# selectors — Part 1


On this page

## Introduction[​](#introduction "Direct link to Introduction")

[Locator](/docs/api/class-locator "Locator")s are the central piece of Playwright's auto-waiting and retry-ability. In a nutshell, locators represent a way to find element(s) on the page at any moment.

### Quick Guide[​](#quick-guide "Direct link to Quick Guide")

These are the recommended built-in locators.

* [page.getByRole()](#locate-by-role) to locate by explicit and implicit accessibility attributes.
* [page.getByText()](#locate-by-text) to locate by text content.
* [page.getByLabel()](#locate-by-label) to locate a form control by associated label's text.
* [page.getByPlaceholder()](#locate-by-placeholder) to locate an input by placeholder.
* [page.getByAltText()](#locate-by-alt-text) to locate an element, usually image, by its text alternative.
* [page.getByTitle()](#locate-by-title) to locate an element by its title attribute.
* [page.getByTestId()](#locate-by-test-id) to locate an element based on its `data-testid` attribute (other attributes can be configured).

```
await page.getByLabel('User Name').fill('John');

await page.getByLabel('Password').fill('secret-password');

await page.getByRole('button', { name: 'Sign in' }).click();

await expect(page.getByText('Welcome, John!')).toBeVisible();
```

## Locating elements[​](#locating-elements "Direct link to Locating elements")

Playwright comes with multiple built-in locators. To make tests resilient, we recommend prioritizing user-facing attributes and explicit contracts such as [page.getByRole()](/docs/api/class-page#page-get-by-role).

For example, consider the following DOM structure.

http://localhost:3000

Sign in

```
<button>Sign in</button>
```

Locate the element by its role of `button` with name "Sign in".

```
await page.getByRole('button', { name: 'Sign in' }).click();
```

note

Use the [code generator](/docs/codegen) to generate a locator, and then edit it as you'd like.

Every time a locator is used for an action, an up-to-date DOM element is located in the page. In the snippet below, the underlying DOM element will be located twice, once prior to every action. This means that if the DOM changes in between the calls due to re-render, the new element corresponding to the locator will be used.

```
const locator = page.getByRole('button', { name: 'Sign in' });

await locator.hover();
await locator.click();
```

Note that all methods that create a locator, such as [page.getByLabel()](/docs/api/class-page#page-get-by-label), are also available on the [Locator](/docs/api/class-locator "Locator") and [FrameLocator](/docs/api/class-framelocator "FrameLocator") classes, so you can chain them and iteratively narrow down your locator.

```
const locator = page
    .frameLocator('#my-frame')
    .getByRole('button', { name: 'Sign in' });

await locator.click();
```

### Locate by role[​](#locate-by-role "Direct link to Locate by role")

The [page.getByRole()](/docs/api/class-page#page-get-by-role) locator reflects how users and assistive technology perceive the page, for example whether some element is a button or a checkbox. When locating by role, you should usually pass the accessible name as well, so that the locator pinpoints the exact element.

For example, consider the following DOM structure.

http://localhost:3000

### Sign up

Subscribe

Submit

```
<h3>Sign up</h3>
<label>
  <input type="checkbox" /> Subscribe
</label>
<br/>
<button>Submit</button>
```

You can locate each element by its implicit role:

```
await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();

await page.getByRole('checkbox', { name: 'Subscribe' }).check();

await page.getByRole('button', { name: /submit/i }).click();
```

Role locators include [buttons, checkboxes, headings, links, lists, tables, and many more](https://www.w3.org/TR/html-aria/#docconformance) and follow W3C specifications for [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles), [ARIA attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) and [accessible name](https://w3c.github.io/accname/#dfn-accessible-name). Note that many html elements like `<button>` have an [implicitly defined role](https://w3c.github.io/html-aam/#html-element-role-mappings) that is recognized by the role locator.

Note that role locators **do not replace** accessibility audits and conformance tests, but rather give early feedback about the ARIA guidelines.

When to use role locators

We recommend prioritizing role locators to locate elements, as it is the closest way to how users and assistive technology perceive the page.

### Locate by label[​](#locate-by-label "Direct link to Locate by label")

Most form controls usually have dedicated labels that could be conveniently used to interact with the form. In this case, you can locate the control by its associated label using [page.getByLabel()](/docs/api/class-page#page-get-by-label).

For example, consider the following DOM structure.

http://localhost:3000

Password

```
<label>Password <input type="password" /></label>
```

You can fill the input after locating it by the label text:

```
await page.getByLabel('Password').fill('secret');
```

When to use label locators

Use this locator when locating form fields.

### Locate by placeholder[​](#locate-by-placeholder "Direct link to Locate by placeholder")

Inputs may have a placeholder attribute to hint to the user what value should be entered. You can locate such an input using [page.getByPlaceholder()](/docs/api/class-page#page-get-by-placeholder).

For example, consider the following DOM structure.

http://localhost:3000

```
<input type="email" placeholder="name@example.com" />
```

You can fill the input after locating it by the placeholder text:

```
await page
    .getByPlaceholder('name@example.com')
    .fill('playwright@microsoft.com');
```

When to use placeholder locators

Use this locator when locating form elements that do not have labels but do have placeholder texts.

### Locate by text[​](#locate-by-text "Direct link to Locate by text")

Find an element by the text it contains. You can match by a substring, exact string, or a regular expression when using [page.getByText()](/docs/api/class-page#page-get-by-text).

For example, consider the following DOM structure.

http://localhost:3000

Welcome, John

```
<span>Welcome, John</span>
```

You can locate the element by the text it contains:

```
await expect(page.getByText('Welcome, John')).toBeVisible();
```

Set an exact match:

```
await expect(page.getByText('Welcome, John', { exact: true })).toBeVisible();
```

Match with a regular expression:

```
await expect(page.getByText(/welcome, [A-Za-z]+$/i)).toBeVisible();
```

note

Matching by text always normalizes whitespace, even with exact match. For example, it turns multiple spaces into one, turns line breaks into spaces and ignores leading and trailing whitespace.

When to use text locators

We recommend using text locators to find non interactive elements like `div`, `span`, `p`, etc. For interactive elements like `button`, `a`, `input`, etc. use [role locators](#locate-by-role).

You can also [filter by text](#filter-by-text) which can be useful when trying to find a particular item in a list.

### Locate by alt text[​](#locate-by-alt-text "Direct link to Locate by alt text")

All images should have an `alt` attribute that describes the image. You can locate an image based on the text alternative using [page.getByAltText()](/docs/api/class-page#page-get-by-alt-text).

For example, consider the following DOM structure.

http://localhost:3000

![playwright logo](/img/playwright-logo.svg)

```
<img alt="playwright logo" src="/img/playwright-logo.svg" width="100" />
```

You can click on the image after locating it by the text alternative:

```
await page.getByAltText('playwright logo').click();
```

When to use alt locators

Use this locator when your element supports alt text such as `img` and `area` elements.

### Locate by title[​](#locate-by-title "Direct link to Locate by title")

Locate an element with a matching title attribute using [page.getByTitle()](/docs/api/class-page#page-get-by-title).

For example, consider the following DOM structure.

http://localhost:3000

25 issues

```
<span title='Issues count'>25 issues</span>
```

You can check the issues count after locating it by the title text:

```
await expect(page.getByTitle('Issues count')).toHaveText('25 issues');
```

When to use title locators

Use this locator when your element has the `title` attribute.

### Locate by test id[​](#locate-by-test-id "Direct link to Locate by test id")

Testing by test ids is the most resilient way of testing as even if your text or role of the attribute changes, the test will still pass. QA's and developers should define explicit test ids and query them with [page.getByTestId()](/docs/api/class-page#page-get-by-test-id). However testing by test ids is not user facing. If the role or text value is important to you then consider using user facing locators such as [role](#locate-by-role) and [text locators](#locate-by-text).

For example, consider the following DOM structure.

http://localhost:3000

Itinéraire

```
<button data-testid="directions">Itinéraire</button>
```

You can locate the element by its test id:

```
await page.getByTestId('directions').click();
```

When to use testid locators

You can also use test ids when you choose to use the test id methodology or when you can't locate by [role](#locate-by-role) or [text](#locate-by-text).

#### Set a custom test id attribute[​](#set-a-custom-test-id-attribute "Direct link to Set a custom test id attribute")

By default, [page.getByTestId()](/docs/api/class-page#page-get-by-test-id) will locate elements based on the `data-testid` attribute, but you can configure it in your test config or by calling [selectors.setTestIdAttribute()](/docs/api/class-selectors#selectors-set-test-id-attribute).

Set the test id to use a custom data attribute for your tests.

playwright.config.ts

```
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    testIdAttribute: 'data-pw'
  }
});
```

In your html you can now use `data-pw` as your test id instead of the default `data-testid`.

http://localhost:3000

Itinéraire

```
<button data-pw="directions">Itinéraire</button>
```

And then locate the element as you would normally do:

```
await page.getByTestId('directions').click();
```

### Locate by CSS or XPath[​](#locate-by-css-or-xpath "Direct link to Locate by CSS or XPath")

If you absolutely must use CSS or XPath locators, you can use [page.locator()](/docs/api/class-page#page-locator) to create a locator that takes a selector describing how to find an element in the page. Playwright supports CSS and XPath selectors, and auto-detects them if you omit `css=` or `xpath=` prefix.

```
await page.locator('css=button').click();
await page.locator('xpath=//button').click();

await page.locator('button').click();
await page.locator('//button').click();
```

XPath and CSS selectors can be tied to the DOM structure or implementation. These selectors can break when the DOM structure changes. Long CSS or XPath chains below are an example of a **bad practice** that leads to unstable tests:

```
await page.locator(
    '#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input'
).click();

await page
    .locator('//*[@id="tsf"]/div[2]/div[1]/div[1]/div/div[2]/input')
    .click();
```

When to use this

CSS and XPath are not recommended as the DOM can often change leading to non resilient tests. Instead, try to come up with a locator that is close to how the user perceives the page such as [role locators](#locate-by-role) or [define an explicit testing contract](#locate-by-test-id) using test ids.

## Locate in Shadow DOM[​](#locate-in-shadow-dom "Direct link to Locate in Shadow DOM")

All locators in Playwright **by default** work with elements in Shadow DOM. The exceptions are:

* Locating by XPath does not pierce shadow roots.
* [Closed-mode shadow roots](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters) are not supported.

Consider the following example with a custom web component:

```
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

You can locate in the same way as if the shadow root was not present at all.

To click `<div>Details</div>`:

```
await page.getByText('Details').click();
```

```
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

To click `<x-details>`:

```
await page.locator('x-details', { hasText: 'Details' }).click();
```

```
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

To ensure that `<x-details>` contains the text "Details":

```
await expect(page.locator('x-details')).toContainText('Details');
```

## Filtering Locators[​](#filtering-locators "Direct link to Filtering Locators")

Consider the following DOM structure where we want to click on the buy button of the second product card. We have a few options in order to filter the locators to get the right one.

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

### Filter by text[​](#filter-by-text "Direct link to Filter by text")

Locators can be filtered by text with the [locator.filter()](/docs/api/class-locator#locator-filter) method. It will search for a particular string somewhere inside the element, possibly in a descendant element, case-insensitively. You can also pass a regular expression.

```
await page
    .getByRole('listitem')
    .filter({ hasText: 'Product 2' })
    .getByRole('button', { name: 'Add to cart' })
    .click();
```

Use a regular expression:

```
await page
    .getByRole('listitem')
    .filter({ hasText: /Product 2/ })
    .getByRole('button', { name: 'Add to cart' })
    .click();
```

### Filter by not having text[​](#filter-by-not-having-text "Direct link to Filter by not having text")

Alternatively, filter by **not having** text:

```
// 5 in-stock items
await expect(page.getByRole('listitem').filter({ hasNotText: 'Out of stock' })).toHaveCount(5);
```

### Filter by child/descendant[​](#filter-by-childdescendant "Direct link to Filter by child/descendant")

Locators support an option to only select elements that have or have not a descendant matching another locator. You can therefore filter by any other locator such as a [locator.getByRole()](/docs/api/class-locator#locator-get-by-role), [locator.getByTestId()](/docs/api/class-locator#locator-get-by-test-id), [locator.getByText()](/docs/api/class-locator#locator-get-by-text) etc.

