---
title: "Enable Bootstrap 4 in Laravel 5.5"
date: "2017-09-13T11:59:00.000Z"
tags: ["bootstrap", "laravel"]
---

Laravel 5.5 just recently got released, and ships with the current stable version of Bootstrap, which is version 3. However, Bootstrap 4 recently hit beta, and should now be solid enough to start development with, especially for new Laravel projects that are just now getting started.

Bootstrap 4 can be easily enabled following these steps. First, remove the Laravel-supplied version of bootstrap-sass from npm:

```plain
npm uninstall --save-dev bootstrap-sass
```

Then install the new version of `bootstrap` from npm. Tether is no longer used with Bootstrap 4; it was replaced with Popper.js, so let's go ahead and install the `popper.js` library too:

```plain
npm install --save-dev bootstrap@^4.0.0-beta popper.js
```

We now have to update our `bootstrap.js` file with the new requirements. Note that there is some ambiguity with the name of this file, as `bootstrap.js` is named bootstrap because it is the main file that instantiates JavaScript libraries -- it has nothing to do with the Bootstrap library. That said, this is also the same file that is used to instantiate the Bootstrap library ;)

In `resources/assets/js/bootstrap.js`, replace:

```javascript
try {
    window.$ = window.jQuery = require('jquery');

    require('bootstrap-sass');
} catch (e) {}
```

with:

```javascript
try {
    window.$ = window.jQuery = require('jquery');
    window.Popper = require('popper.js');

    require('bootstrap');
} catch (e) {}
```

What we are doing here is changing the reference of `bootstrap-sass` (the old Bootstrap 3 library) with `bootstrap` (the Bootstrap 4 library). We are also defining the global `Popper` variable to look at the related NPM library (`popper.js`).

After a recompilation of assets:

```plain
npm run dev
```

we should now have Bootstrap 4 installed within Laravel 5.5.
