---
title: "Creating a better reactive ReactJS JavaScript architecture"
date: "2016-08-12T10:32:00.000Z"
tags: ["javascript", "mobx", "reactjs"]
---

After working through a few ReactJS JavaScript projects based in Meteor, what the ecosystem lacks is a really good architecture that will grow with you. Not only should it be adaptable and somewhat future-proof in a space that seems to be ever-changing at a rapid pace, but it lacks having an established organizational paradigm present, specifically when dealing with reactive, single-page applications.

I'd like to detail the layout and structure of a project I'm currently working on. It aims to have a formal bootstrap process, a modularized approach, and a "go-to" method of creating new code without expanding additional mental thought. A lot of these ideas stem from the <a href="https://kadirahq.github.io/mantra/" target="_blank">Mantra</a> project, but the thoughts are universal and can be applied to any JavaScript project. The idea is to use that as a base for explaining the below concepts at a higher-level of detail.

## Bootstrap with dependency injection

The application should have a bootstrap process, that initialized all modules, their specific special methods, and injects dependencies. DI doesn't seem to be so popular in JavaScript, but it is a common method of dealing with dependencies in other languages such as PHP. This avoids having the need for duplicating `import from` commands in many similar files. Instead, you define an application context that injects dependencies to places you would like to use them.

The bootstrap also establishes a formal entry point for your application, and should be in charge of initializing your app and kicking off the entire process.

## Module-based approach

In my opinion, a modularized process is the way to go. To deal with core/root code, just create a core module. Every single aspect of your application outside of your bootstrap initialization process should be contained within a module. This makes code very easy to reason with, adds an organizational process that is hard to argue against, and adds a formal process for you adding code. Within those modules are specific folders, which in turn appear to be very modularized. The idea is to not have to think about where to create or find a specific piece of code; there's always a place, and it's always the same.

## Standards within modules

Within modules, a very formal standard is also in place. Modules each have their own definition which defines all methods and properties within that module. The `index.js` should appear something like this:

```javascript
import actions from './actions';
import reactions from './reactions';
import routes from './routes';
import stores from './stores';

export default {
  actions,
  reactions,
  routes,
  stores,
};
```

This lays the groundwork for the module. Within this module, the directory structure is as so:

```plain
/actions
/components
/containers
/reactions
/stores
index.js
routes.js
```

Just by looking at this structure, we understand the entry point is index.js. Here we are registering the actions, components, containers, and stores for our app, while the reactions and routes are immediately invoked functions which kick off the reaction and routes processes respectively.

## Route initialization

At the top of our route definition file, we import container components for the routes we want to establish. Our application context is defined within the bootstrapped route function, giving us access to our router and other dependencies through DI. Our router contains zero application logic; it is used just to define routes, and their respective container components. Let's keep this focused.

An example theoretical router:

```javascript
import React from 'react';
import mounter from 'mounter';

import Layout from './containers/Layout';
import Home from './containers/Home';

export default function ({ Router }) {
  Router.route('/', {
    name: 'home',
    init() {
      mounter(Layout, Home);
    }
  });
}
```

## Stores definition

Our /stores folder contains files which relate to the local state of our application. Each file relates to a specific area of our module. For example, let's say that within our core component, we want to define a global message component which any other module can call to show a notification message within our app. Our local state for this should be defined as so (using reactive MobX as an example here):

```javascript
import { observable } from 'mobx';

const globalMessage = observable({
  autoHideDuration: 2000,
  message: '',
  open: function open() {
    return Boolean(this.message);
  },
});

export default globalMessage;
```

This is a more complex example, but what we have here is a simple observable object with properties. At it's simplest, we can look at the `autoHideDuration` property, which is just a number, and the `message` property, which is just a string. We can also have computed properties such as `open`, which are linked & respond to the state of other store properties.

## Containers

Our routes are importing and routing to containers, which are our "smart components". The containers are responsible for routing our state to our components, or "dumb components". So, they should be reactive to changes within defined stores, and act as a top level component in charge of passing props down to all components. They should also contain zero application logic, as all application logic will be defined within `actions`.

We also need a connector, which maps defined actions to container properties. The actions are then passed down as regular props to our dumb components.

Theoretical container for our global message functionality:

```javascript
import { connector, composer, composeWithMobx } from 'react-app-init';
import GlobalMessage from './components/GlobalMessage';

const reactiveFn = ({ cleanup }, onChange) => {
  const {
    autoHideDuration,
    message,
    open,
  } = context().Store.core.globalMessage;

  onChange(null, {
    autoHideDuration,
    message,
    open,
  });

  return cleanup;
};

const mapper = actions => ({
  cleanup: actions.core.globalMessage.cleanup,
});

export default composer(composeWithMobx(reactiveFn), connector(mapper))(GlobalMessage);
```

This re-reruns whenever our reactive state changes, and passes props down to our dumb Global Message component, which then renders. Note how we are pulling in actions from our application context's dependency injection.

## Dumb components

Our dumb components also contain zero application logic. The idea is a compartmentalized approach, where everything has it's place. Dumb components are dumb, and don't do anything except render changes to state.

Here's an example dumb component for our global message functionality:

```javascript
import React, { PropTypes } from 'react';
import Snackbar from 'material-ui/Snackbar';

const GlobalMessage = ({
  autoHideDuration,
  cleanup,
  message,
  open,
}) => (
  <Snackbar
    autoHideDuration={autoHideDuration}
    message={message}
    onRequestClose={cleanup}
    open={open}
  />
);

GlobalMessage.propTypes = {
  autoHideDuration: PropTypes.number,
  cleanup: PropTypes.func,
  message: PropTypes.string.isRequired,
  open: PropTypes.bool,
};

export default GlobalMessage;
```

Here's where this approach should start "clicking" for you. We don't have a lot of different functions within our containers or components, spreading our application/business logic all over the place in an unorganized mess. Containers are JUST responsible for passing state to components, and components are just in charge of rendering the state. So where does our business logic go? In one controlled place...

## Actions

All of our business logic should be defined within actions. Since our containers map actions as props down to components, any interaction within a component or request to change state should be handled within an action. Something Mantra doesn't do is the namespacing of actions and stores to modules. I believe this is a very important distinction as our app will continue to grows, as without this namespacing we can also step on other modules' toes, which would make things really tough to debug.

Here's a sample action for our global message functionality:

```javascript
import { action } from 'mobx';

export default {
  setMessage: action(({ Store }, message) => {
    Store.core.globalMessage.message = message;
  }),

  clearMessage: action(({ Store }) => {
    Store.core.globalMessage.message = '';
    Store.core.globalMessage.autoHideDuration = 2000;
  }),
};
```

You can picture these functions as replacing your current method of handling component interactions and state changes. Since we now have a global state whether it be MobX or Redux, we can very easily set changes to our store objects from a very established area, and can very easily follow the process of state changes. Note that we also have the ability to pull in modules from our application context via dependency injection, which again avoids a lot of the needs of having tons of import definitions repeated at the top of every actions container.

## Reactions

Our last area of focus are reactions. These listen for reactive data changes, and then do something in response. For example, let's say on every route change, we want to show our global message component:

```javascript
export default ({ Router, actions }) => {
  Router.watchForChanges();
  actions.core.globalMessage.setMessage(`You're on ${Router.name} route`);
}
```

If our theoretical router had a reactive method of listening for route changes (think an event that is fired on every route change), then our global message event which be executed to show you the name of your current route.

Using something like Meteor or Horizon for reactive data collections, you can use these reactions with autoruns that define subscriptions and push collection data down to your Store. You can listen for route changes and store your current route in a piece of state, and have those changes of state re-run reactions for your reactive datasets based on specified routes. If you wanted more specific sub/unsub functionality that is container driven, you can also make your containers regular React components, and start & stop subscriptions by calling actions within your `componentWillMount` and `componentDidUnmount` lifecycle methods. It's up to you how you want to implement from your project needs and requirements.

## Other code

You can also place other code within your modules, such as `lib`, `startup`, `styles`, etc. You aren't limited on how to organize your code; the important thing is to make sure to have an organizational paradigm that remains consistent throughout your appfrastructure.

I hope these organizational definitions and recommended way of setting up your app hierarchy will help open you to better ways of setting up your infrastructure in a way that is very modularized and compartmentalized. Please let me know your thoughts so we can have an open discussion on better app organizational methods.
