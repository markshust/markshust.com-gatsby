---
title: "Creating a multi-page form using MobX with Meteor & React"
date: "2016-06-02T13:58:00.000Z"
tags: ["meteor", "mobx", "reactjs"]
---

Mobx is a really simple state manager that can be used really nicely with React, when you don't need the complexity of a Redux implementation.

Using Mobx is pretty straight-forward, however their getting started documentation uses `stage-0` class properties, which are currently [not supported with Meteor 1.3](https://github.com/meteor/meteor/issues/6096). The simple fix is to use ES6 formatting.

In a sample application, I wanted to use Mobx for a multi-page form with FlowRouter. First, I created the store for my form, which contains all values within my form across all pages:

<div class="gatsby-code-title">FormStore.js</div>

```javascript
import { extendObservable } from 'mobx';

class FormStore {
  constructor() {
    extendObservable(this, {
      firstName: '',
      lastName: '',
      street: '',
      ...
    });
  }
};

export default FormStore;
```

Then, I included the FormStore within my `FlowRouter.jsx` file, instantiated it, and passed it to my form component through a prop:

<div class="gatsby-code-title">FlowRouter.jsx</div>

```javascript
import React from 'react';
import FormStore from '../stores/form';
import LayoutMain from '../layouts/main';
import MyFormStep from '../components/MyFormStep';

const formStore = new FormStore();

FlowRouter.route("/my-form/:step", {
  name: "my-form-step",
  action(params) {
    mount(LayoutMain, {
      content: &lt;MyFormStep formStore={formStore} {...params} /&gt;,
      params,
    });
  },
});
```

The `MyFormStep` component is simple component which renders a child component, depending on the `step` param:

<div class="gatsby-code-title">MyFormStep.jsx</div>

```javascript
import React from 'react';
import MyFormStep1 from './MyFormStep1';
import MyFormStep2 from './MyFormStep2';

const getComponent = props => {
  let component;

  switch (parseInt(props.step)) {
    case 1:
      component = &lt;MyFormStep1 {...props} /&gt;;
      break;
    case 2:
      component = &lt;MyFormStep2 {...props} /&gt;;
      break;
  }

  return component;
};

const MyFormStep = props => (
  <div style={styles.base}>
    {getComponent(props)}
  </div>
);

export default MyFormStep;
```

There is no need to listen for Mobx observables here, as we aren't referencing an observable value. In our child component `MyFormStep1` is where we watch for observables.

Here is a sample `MyFormStep1` component, where all we need to do is wrap `React.createClass` with `observer`:

<div class="gatsby-code-title">MyFormStep1.jsx</div>

```javascript
import React from 'react';
import { observer } from 'mobx-react';

const MyFormStep1 = observer(React.createClass({
  handleSubmit(e) {
    e.preventDefault();
    console.log(this.props.formStore);
    ...
    FlowRouter.go('my-form-step', {step: 2});
  },

  render() {
    const { formStore } = this.props;

    console.log("This component re-renders whenever formState updates...", formState);

    return (
      <div>
        <h1>Page 1</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              name="firstName"
              type="text"
              required="true"
              value={formStore.firstName}
              onChange={e => formStore.firstName = e.target.value}
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              name="lastName"
              type="text"
              required="true"
              value={formStore.lastName}
              onChange={e => formStore.lastName = e.target.value}
            />
          </div>
          <div>
            <label htmlFor="street">Street</label>
            <input
              name="street"
              type="text"
              required="true"
              value={formStore.street}
              onChange={e => formStore.street = e.target.value}
            />
          </div>
          ...
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}));

export default MyFormStep1;
```

Note that in the `onChange` events, we don't need to pass things up through a function prop to sync state, but just directly write to formStore, and everything is automatically synced. This is one of the great features of Mobx.

This is just a lot of boilerplate code which can help you out -- it's not meant to be complete and can be greatly optimized, but hope it's enough to send you in the right direction. I was stuck for a little while implementing Mobx because of the `class-0` issue, however once everything was converted to ES6 for Meteor compatibility, things started working great.

You can easily persist the data within Meteor by setting up parameterless functions as prop values within your store's extendObservable, and load the data on initial render from a Meteor reactive dataset.

Using Mobx can dramatically cut down on implementation of state, and is much simpler to implement than Redux. I highly recommend Mobx, and it's a great mating for using it with Meteor & React.
