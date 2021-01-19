---
title: "Setup TailwindCSS on Svelte & Snowpack"
date: "2020-11-01T22:00:00.000Z"
tags: ["tailwindcss", "svelte", "snowpack"]
---

It seemed fairly easy to install TailwindCSS on a fresh Svelte install that was using the Snowpack builder, but following a few different online tutorials lead me down a few black holes.

Luckily, it is quite easy if you keep Postfix and any other build tools out of the process. Here is a very simple way to implement TailwindCSS into a Svelte install that uses Snowpack as the builder.

The first step is to install TailwindCSS with npm:

```bash
npm install tailwindcss
```

Next, you'll need to create the standard TailwindCSS CSS import file at `src/tailwind.css` with the contents:

```css
@import 'tailwindcss/dist/base.css';
@import 'tailwindcss/dist/components.css';
@import 'tailwindcss/dist/utilities.css';
```

Finally, open `src/App.svelte`, or whatever component you are using for the global layout in Svelte, and import the CSS file within it's script tag:

```js
<script>
  import {onMount} from 'svelte';
  import './tailwind.css'; // highlight-line
  let count = 0;
  ...
```

That's it! You're now free to use all of the TailwindCSS classes to your hearts content, and enjoy the immediate hot reloading capabilities of Snowpack 😍.
