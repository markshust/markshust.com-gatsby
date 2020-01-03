---
title: "Create and deploy a NodeJS Express app with Docker"
date: "2016-08-14T05:08:00.000Z"
tags: ["docker", "express", "nodejs"]
---

I'll show you a stupid fast and simple way to create an express app with NodeJS, then deploy it with Docker. All you need is a simple text editor.

## Install NodeJS & Docker

Install node with n:

```meta
npm i -g n
n latest
```

Install Docker by pulling out the appropriate build from <a href="https://docs.docker.com/engine/installation/" target="_blank">https://docs.docker.com/engine/installation/</a>.

## App setup

Let's now get our express app setup. Create a new directory and initialize your package.json file:

```meta
mkdir test && cd test
npm init -y
```

Let's now install express:

```meta
npm i -S express
```

And set your main npm start script. Change the line that reads:

```meta
"test": "echo \"Error: no test specified\" && exit 1"
```

to this:

```meta
"start": "node index.js"
```

## App coding

And we'll create our `index.js` file. We'll keep it simple ;)

<div class="gatsby-code-title">index.js</div>

```javascript
const app = require('express')();

app.get('/', (req, res) => {
  res.send('Cleveland Cavaliers are world champs!');
});

app.listen(3000, () => console.log('Server running'));
```

Make sure it works by executing:

```meta
npm start
```

Now, when you visit http://localhost:3000 on your local machine, you should see something that will make Golden State Warriors fans cry.

Hint: Check out `nodemon` so you can make changes to your app code and not have to restart node on every change.

## Docker setup

Now that our app is running, let's setup our Docker config.

First, create a `.dockerignore` file containing one line:

```meta
node_modules
```

We want to exclude our local packages from Docker, as these will be installed at build time.

Now, we'll create a new file named `Dockerfile` with the following contents:

<div class="gatsby-code-title">Dockerfile</div>

```docker
FROM mhart/alpine-node

WORKDIR /src

COPY package.json .
RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

We'll be using the `mhart/alpine-node` base image, as these is a super tiny NodeJS instance built on the minimalistic Alpine linux distribution. The output of my build was about 55MB. and it took less than a minute for the initial build. Subsequent builds took about one second =)

The Docker instructions are pretty simple. We just copy over the package.json file, install our npm modules, then copy our app over and run npm.

Let's build our production image:

```meta
docker build -t test .
```

Now, we can run our our image to test it out. We'll map port 3000 from our host to container, and run in daemon mode so it keeps running in the background:

```meta
docker run -p 3000:3000 -d test
```

Now, when you visit http://localhost:3000, you can see the same output as before, but things are now running from your Docker container. You can now push your Docker image to a private repository or build service, then deploy to production, and know there are no dependencies, build issues, or anything else to worry about. It will just work.
