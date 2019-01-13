---
title: "Getting Started with Yeoman, Angular, Firebase, & AngularFire: Part One"
date: "2014-09-18T15:28:00.000Z"
tags: ["angularfire", "angularjs", "firebase", "yeomon"]
---

So, I'm starting to build web apps on the next best thing, <a href="http://firebase.com" target="_blank">Firebase</a>. That said, I'm coming from a formal PHP world involving Zend Framework, complex setups, continuous deployments, and other tools which are complex, but built for stability and structure. Well, none of that exists with Angular and Firebase, at least not yet. The closest thing I could find to it is Yeoman, which provides the much needed build tools to grunt your code and start providing some nice formality to an otherwise pretty haphazard & unorganized programming language. Here's how to get setup on <a href="http://yeoman.io" target="_blank">Yeoman</a>, setup <a href="https://angularjs.org" target="_blank">Angular</a>, and get going with some Firebase bindings together with <a href="https://www.firebase.com/docs/web/libraries/angular/index.html" target="_blank">AngularFire</a> to make everything work pretty nicely together. These instructions are all for a Mac, but should also work on linux builds.

## Setup the Prerequisites

### Install Node

We need node setup to get npm (node's package manager) and grunt working, so let's download and install that from:

http://nodejs.org/download/

### Install Yeoman

Now that we have npm, let's go ahead and install Yeoman. We'll install it globally (with the -g flag) so that it's accesible from anywhere on our system. So open up Terminal and run the following command:

```plain
npm install -g yo
```

### Install the Angularfire Yeoman Generator

A generator will help scaffold our projects a little quicker, and get us up and running quickly. There is one specific to AngularFire which we'll use, and also setup globally:

```plain
npm install -g generator-angularfire
```

Note: On Yosemite, it appears that you now also have to manually install bower and grunt-cli:

```plain
npm install -g bower grunt-cli
```

### Signup for Firebase

We'll be using the awesome Firebase BaaS for our project, which you can signup for a free developer Firebase at <a href="http://firebase.com" target="_blank">firebase.com</a>. Create an 'app' and note the project name (it'll be something like https://**mywebapp**.firebaseio.com, where mywebapp is the name of your instance).

## Create your base project

Everything we need so far is installed, so let's create our project:

```plain
mkdir mywebapp && cd mywebapp
```

And scaffold our project, foo, with Yeoman:

```plain
yo angularfire foo
```

Yeoman will then ask you a series of questions:

- *Firebase instance:* Type in just the prefix of your whole URL (if your URL is https://mywebapp.firebaseio.com, just type in mywebapp).
- *Use FirebaseSimpleLogin:* n - we don't need this right now.
- *Would you like to use Sass (with Compass)?:* y - we can play around with this later. And Sass is awesome as well.
- *Would you like to include Bootstrap?:* y - we'll use bootstrap for some base theming.
- *Would you like to use the Sass version of Bootstrap?:* y - well, we have Sass installed, and Bootstrap.... so this makes sense.
- *Which modules would you like to include?:* By default all modules are selected, so just hit enter - this will give us a chance to play around with these.

Bower will now fetch all of the JavaScript libraries we need, and install them into our app. Bower is a package manager similar to npm, but goes and gets web assets like JavaScript libraries for us. All of these package managers make our lives easier, so we don't have to scower the web to find all of the JavaScript libraries we need. I wish I had something like this ten years ago.

### Angular Bugfix

Right now, our app should run. But I found there is a bug that prevents it running smoothly out of the box with Angular. Let's edit the Gruntfile.js file in the root of our project folder:

```js
...
// Automatically inject Bower components into the app
wiredep: {
  options: {
    cwd: '<%= yeoman.app %>'
  },
  app: {
    src: ['<%= yeoman.app %>/index.html'],
    ignorePath:  /\.\.\//
  },
  sass: {
    src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
    ignorePath: /(\.\.\/){1,2}bower_components\//
  }
},
...
```

Remove the `cwd` property of the wiredep.options property. This doesn't mesh well with Angular 1.9. You can comment it out if you wish. Now we should be good to go.

## Preview the app

Let's see what we have so far. We use grunt to build our JavaScript project -- it'll check our scripts, compile our code, run cleanup, run tests, minify the JavaScript, and all sorts of other tasks we can avoid doing manually.

We just run the `grunt` command to build:

```plain
grunt
```

All tests should pass. If not, use Dr. Google. And `grunt serve` to kickoff our node web server to view our app:

```plain
grunt serve
```

Coming from a LAMP world of setting up Apache virtual hosts, configuring PHP, restarting the server, etc..... this is a godsend. That's it; grunt, grunt serve... and you have a running app, and see the Yeoman "'Allo, 'Allo!" message.

### Test out Angular & Firebase

In the http://localhost:9000 website URL that opened, you should see a "chat" link in the top navigation. Click it, and enter some chat messages. You can open up the Firebase Forge portal in another window, and watch the real-time notifications happen as you hit the 'send' button. There you go: three-way binding/syncing (model/view/firebase).

To stop your web server from running, go back to Terminal and hit Ctrl + C. This will kill your web server. You can type `grunt serve` at anytime from your project root to get the web server running again.

### Homework

You now have an Angular app running with Firebase and AngularFire, controlled by the Yeoman scaffolder. This is pretty great, and you didn't even code anything yet!

Since this tutorial is a bit long, I'm splitting this into a Part One and Part Two. The Firebase-specific chat code is located at `app/scripts/controllers/chat.js`, but you really need a good understanding of how Angular works, before you learn how Firebase works with Angular.

Take a look around the code, and explore & test how things work. There are some really good tutorial series over at <a href="https://thinkster.io" target="_blank">https://thinkster.io</a>, one specifically on Angular which I would recommend. Part Two will be out shortly, when I'll show you how to create a custom model in Angular and bind it all directly to Firebase, along with some other neat things we can do.

Until next time, have fun and explore Angular and Firebase!
