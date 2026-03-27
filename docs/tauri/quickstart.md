# Source: https://v2.tauri.app/start/create-project/
# Last fetched: 2026-03-27T18:43:18.241096+00:00

# Create a Project

One thing that makes Tauri so flexible is its ability to work with virtually any frontend framework. We’ve created the [`create-tauri-app`](https://github.com/tauri-apps/create-tauri-app) utility to help you create a new Tauri project using one of the officially maintained framework templates.

`create-tauri-app` currently includes templates for vanilla (HTML, CSS and JavaScript without a framework), [Vue.js](https://vuejs.org), [Svelte](https://svelte.dev), [React](https://reactjs.org/), [SolidJS](https://www.solidjs.com/), [Angular](https://angular.io/), [Preact](https://preactjs.com/), [Yew](https://yew.rs/), [Leptos](https://github.com/leptos-rs/leptos), and [Sycamore](https://sycamore-rs.netlify.app/). You can also find or add your own community templates and frameworks in the [Awesome Tauri repo](https://github.com/tauri-apps/awesome-tauri).

Alternatively, you can [add Tauri to an existing project](#manual-setup-tauri-cli) to quickly turn your existing codebase into a Tauri app.

## [Using `create-tauri-app`](#using-create-tauri-app)

[Section titled “Using create-tauri-app”](#using-create-tauri-app)

To get started using `create-tauri-app` run one of the below commands in the folder you’d like to setup your project. If you’re not sure which command to use we recommend the Bash command on Linux and macOS and the PowerShell command on Windows.

* [Bash](#tab-panel-1616)
* [PowerShell](#tab-panel-1617)
* [Fish](#tab-panel-1618)
* [npm](#tab-panel-1619)
* [Yarn](#tab-panel-1620)
* [pnpm](#tab-panel-1621)
* [deno](#tab-panel-1622)
* [bun](#tab-panel-1623)
* [Cargo](#tab-panel-1624)

```
sh <(curl https://create.tauri.app/sh)
```

```
irm https://create.tauri.app/ps | iex
```

```
sh (curl -sSL https://create.tauri.app/sh | psub)
```

```
npm create tauri-app@latest
```

```
yarn create tauri-app
```

```
pnpm create tauri-app
```

```
deno run -A npm:create-tauri-app
```

```
bun create tauri-app
```

```
cargo install create-tauri-app --locked

cargo create-tauri-app
```

Follow along with the prompts to choose your project name, frontend language, package manager, and frontend framework, and frontend framework options if applicable.

#### [Scaffold a new project](#scaffold-a-new-project)

[Section titled “Scaffold a new project”](#scaffold-a-new-project)

1. Choose a name and a bundle identifier (unique-id for your app):

   ```
   ? Project name (tauri-app) ›

   ? Identifier (com.tauri-app.app) ›
   ```
2. Select a flavor for your frontend. First the language:

   ```
   ? Choose which language to use for your frontend ›

   Rust  (cargo)

   TypeScript / JavaScript  (pnpm, yarn, npm, bun)

   .NET  (dotnet)
   ```
3. Select a package manager (if there are multiple available):

   Options for **TypeScript / JavaScript**:

   ```
   ? Choose your package manager ›

   pnpm

   yarn

   npm

   bun
   ```
4. Select a UI Template and flavor (if there are multiple available):

   Options for **Rust**:

   ```
   ? Choose your UI template ›

   Vanilla

   Yew

   Leptos

   Sycamore
   ```

   Options for **TypeScript / JavaScript**:

   ```
   ? Choose your UI template ›

   Vanilla

   Vue

   Svelte

   React

   Solid

   Angular

   Preact

   ? Choose your UI flavor ›

   TypeScript

   JavaScript
   ```

   Options for **.NET**:

   ```
   ? Choose your UI template ›

   Blazor  (https://dotnet.microsoft.com/en-us/apps/aspnet/web-apps/blazor/)
   ```

Once completed, the utility reports that the template has been created and displays how to run it using the configured package manager. If it detects missing dependencies on your system, it prints a list of packages and prompts how to install them.

#### [Start the development server](#start-the-development-server)

[Section titled “Start the development server”](#start-the-development-server)

After `create-tauri-app` has completed, you can navigate into your project’s folder, install dependencies, and then use the [Tauri CLI](/reference/cli/) to start the development server:

* [npm](#tab-panel-1625)
* [yarn](#tab-panel-1626)
* [pnpm](#tab-panel-1627)
* [deno](#tab-panel-1628)
* [bun](#tab-panel-1629)
* [cargo](#tab-panel-1630)

```
cd tauri-app

npm install

npm run tauri dev
```

```
cd tauri-app

yarn install

yarn tauri dev
```

```
cd tauri-app

pnpm install

pnpm tauri dev
```

```
cd tauri-app

deno install

deno task tauri dev
```

```
cd tauri-app

bun install

bun tauri dev
```

```
cd tauri-app

cargo install tauri-cli --version "^2.0.0" --locked

cargo tauri dev
```

You’ll now see a new window open with your app running.

**Congratulations!** You’ve made your Tauri app! 🚀

## [Manual Setup (Tauri CLI)](#manual-setup-tauri-cli)

[Section titled “Manual Setup (Tauri CLI)”](#manual-setup-tauri-cli)

If you already have an existing frontend or prefer to set it up yourself, you can use the Tauri CLI to initialize the backend for your project separately.

1. Create a new directory for your project and initialize the frontend. You can use plain HTML, CSS, and JavaScript, or any framework you prefer such as Next.js, Nuxt, Svelte, Yew, or Leptos. You just need a way of serving the app in your browser. Just as an example, this is how you would setup a simple Vite app:

   * [npm](#tab-panel-1631)
   * [yarn](#tab-panel-1632)
   * [pnpm](#tab-panel-1633)
   * [deno](#tab-panel-1634)
   * [bun](#tab-panel-1635)

   ```
   mkdir tauri-app

   cd tauri-app

   npm create vite@latest .
   ```

   ```
   mkdir tauri-app

   cd tauri-app

   yarn create vite .
   ```

   ```
   mkdir tauri-app

   cd tauri-app

   pnpm create vite .
   ```

   ```
   mkdir tauri-app

   cd tauri-app

   deno run -A npm:create-vite .
   ```

   ```
   mkdir tauri-app

   cd tauri-app

   bun create vite
   ```
2. Then, install Tauri’s CLI tool using your package manager of choice. If you are using `cargo` to install the Tauri CLI, you will have to install it globally.

   * [npm](#tab-panel-1636)
   * [yarn](#tab-panel-1637)
   * [pnpm](#tab-panel-1638)
   * [deno](#tab-panel-1639)
   * [bun](#tab-panel-1640)
   * [cargo](#tab-panel-1641)

   ```
   npm install -D @tauri-apps/cli@latest
   ```

   ```
   yarn add -D @tauri-apps/cli@latest
   ```

   ```
   pnpm add -D @tauri-apps/cli@latest
   ```

   ```
   deno add -D npm:@tauri-apps/cli@latest
   ```

   ```
   bun add -D @tauri-apps/cli@latest
   ```

   ```
   cargo install tauri-cli --version "^2.0.0" --locked
   ```
3. Determine the URL of your frontend development server. This is the URL that Tauri will use to load your content. For example, if you are using Vite, the default URL is `http://localhost:5173`.
4. In your project directory, initialize Tauri:

   * [npm](#tab-panel-1642)
   * [yarn](#tab-panel-1643)
   * [pnpm](#tab-panel-1644)
   * [deno](#tab-panel-1645)
   * [bun](#tab-panel-1646)
   * [cargo](#tab-panel-1647)

   ```
   npx tauri init
   ```

   ```
   yarn tauri init
   ```

   ```
   pnpm tauri init
   ```

   ```
   deno task tauri init
   ```

   ```
   bun tauri init
   ```

   ```
   cargo tauri init
   ```

   After running the command it will display a prompt asking you for different options:

   ```
   ✔ What is your app name? tauri-app

   ✔ What should the window title be? tauri-app

   ✔ Where are your web assets located? ..

   ✔ What is the url of your dev server? http://localhost:5173

   ✔ What is your frontend dev command? pnpm run dev

   ✔ What is your frontend build command? pnpm run build
   ```

   This will create a `src-tauri` directory in your project with the necessary Tauri configuration files.
5. Verify your Tauri app is working by running the development server:

   * [npm](#tab-panel-1648)
   * [yarn](#tab-panel-1649)
   * [pnpm](#tab-panel-1650)
   * [deno](#tab-panel-1651)
   * [bun](#tab-panel-1652)
   * [cargo](#tab-panel-1653)

   ```
   npx tauri dev
   ```

   ```
   yarn tauri dev
   ```

   ```
   pnpm tauri dev
   ```

   ```
   deno task tauri dev
   ```

   ```
   bun tauri dev
   ```

   ```
   cargo tauri dev
   ```

   This command will compile the Rust code and open a window with your web content.

**Congratulations!** You’ve created a new Tauri project using the Tauri CLI! 🚀

## [Next Steps](#next-steps)

[Section titled “Next Steps”](#next-steps)

* [Learn about the project layout and what each file does](/start/project-structure/)
* [Add and Configure a Frontend Framework](/start/frontend/)
* [Tauri Command Line Interface (CLI) Reference](/reference/cli/)
* [Learn how to develop your Tauri app](/develop/)
* [Discover additional features to extend Tauri](/plugin/)

---

[Support on Open Collective](https://opencollective.com/tauri) [Sponsor on GitHub](https://github.com/sponsors/tauri-apps)

© 2026 Tauri Contributors. CC-BY / MIT
