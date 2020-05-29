---
title: "The easy way to add Tailwind CSS to Gatsby"
date: "2020-05-29T15:30:00.000Z"
tags: ["gatsby", "tailwindcss"]
---

I've had a bear of a time trying to add Tailwind CSS to my Gatsby site. Most of the blog posts I found for implementing the library were either outdated, referenced installing a lot of unnecessary npm modules, or contained a lot of opinionated boilerplate code. Instead, I decided to implement Tailwind in the simplest way possible.

> If you are starting a new blog on Gatsby and would like Tailwind CSS included with it by default, check out the [gatsby-starter-blog-tailwindcss](https://github.com/andrezzoid/gatsby-starter-blog-tailwindcss) starter. The config is clean, and I actually grabbed most of the implementation info from this repo.

## Create the config files

First create the following two configuration files needed for both Tailwind CSS and PostCSS, and modify as necessary:

<div class="gatsby-code-title">tailwind.config.js</div>

```js
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        serif: ["Merriweather", ...defaultTheme.fontFamily.serif],
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [],
}
```

<div class="gatsby-code-title">postcss.config.js</div>

```js
module.exports = () => ({
  plugins: [require("tailwindcss")],
})
```

## Add npm dependencies

Next, install the Tailwind CSS and Gatsby PostCSS Plugins npm packages:

```
npm install gatsby-plugin-postcss tailwindcss
```

## Add PostCSS plugin to Gatsby Config

In order to get PostCSS to trigger properly in the Gatsby build process, add the following line to the Gatsby config file:

<div class="gatsby-code-title">gatsby-config.js</div>

```js
    // ...
    `gatsby-plugin-postcss`,
   ],
 }
```

## Import Tailwind CSS

And finally, import the Tailwind CSS in the Gatsby Browser JS:

<div class="gatsby-code-title">gatsby-browser.js</div>

```js
// ...
import "tailwindcss/base.css"
import "tailwindcss/components.css"
import "tailwindcss/utilities.css"
// ...
```

## Conclusion

That should be a wrap! Now you can add Tailwind classes to your HTML elements like so:

```html
<div className="text-center">
```
