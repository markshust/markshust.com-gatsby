---
title: "Creating a Custom Production Docker Image for Meteor 1.3"
date: "2016-02-01T12:58:00.000Z"
tags: ["docker", "meteor"]
---

Meteor 1.3 introduces custom `package.json` support, which allows you to use custom NPM packages within your Meteor app. This is great, because up to Meteor 1.2 you needed to use oddly formatted "NPM wrapper" packages.

This setup does include a slightly different build process though, as we need to install these custom NPM packages within our production Meteor app.

## Previous Ways to Build Meteor with Docker

I've previously used [meteord](https://github.com/meteorhacks/meteord) to build my production Meteor images, which were then in turn sent and deployed through [Google Cloud Platform on Kubernetes](http://markshust.com/2015/11/23/setting-kubernetes-architecture-google-cloud-platform). Unfortunately as the time of this writing, [Meteor 1.3 beta 5](https://github.com/meteor/meteor/issues/5788) is [not yet compatible](https://github.com/meteorhacks/meteord/issues/78).

While I enjoyed using meteord for deploying because it was a zero-config, zero-hassle deployment, it has it's downsides. The binary script that runs when building your Docker image downloads and installs Meteor every time. This is very slow an inefficient. Normally, you would tie this install script to a [cached Docker layer](https://docs.docker.com/engine/introduction/understanding-docker/#how-does-a-docker-image-work), so the next time the build happens, the layer is cached an no longer needs to be run, saving you 2+ minutes on every build. Using Meteor 1.3 beta 5 with this image is an even worse idea at the moment, as 1.3 needs to download additional tools when running a `meteor build` because 1.3 uses different tools to compile the binary. Luckily, there is a better way.

I prefer Docker images with a full set of instructions within their Dockerfile. This makes things really easy to understand, because we don't have to go searching through bash scripts to find out what is going on. What beginners really don't understand about Meteor apps is that after bundled, they are compiled into a simple NodeJS app. This means we can deploy a Meteor app just like a regular NodeJS app, and there is really no reason to involve Meteor at all at the build level. This keeps our production images small, lean & fast to deploy.

## Meteor Build

I first proceed to think through how my Meteor app is being built and what it needs. You can in fact build architecture-specific builds from any machine (such as my Mac), so I decided to build the Meteor bundle locally for my architecture, then build the corresponding Docker image which takes that bundle and deploys it. This can be run as follows:

```bash
meteor build --architecture=os.linux.x86_64 --server=$SERVER --directory $BUILD_DIR
```

Since we already have Meteor installed on our host machine, and everything is already cached and ready to go, let's avoid involving Meteor with the production build at all. This will build a complete bundle which we can then use to deploy. This is even better if building for Cordova/iOS, as we need to run this build anyway so we can deploy it with XCode.

## Picking a Base Image

The first step I took was to look for a very streamlined NodeJS image with 0.10.41 with NPM 2. I greatly prefer working with official repositories rather than creating my own. Luckily, I found the `node:0.10.41-slim` image. I checked out [it's Dockerfile](https://github.com/nodejs/docker-node/blob/4b1b5052db3d6bc462103fac2671175d447b102e/0.10/slim/Dockerfile), and low and behold: NodeJS 0.10.41 with NPM 2. It's also super-slimmed down without any baggage, weighing in at 158MB. Perfect, this will be my base image.

There are other NodeJS images which are smaller like [Alpine](https://github.com/mhart/alpine-node), however they aren't compatible with Kubernetes, so they were avoided.

## Building a Production Docker Image

Let's now build our Dockerfile. After a lot of trial and error, here's what I wound up with:

<div class="gatsby-code-title">Dockerfile</div>

```docker
FROM node:0.10.41-slim
MAINTAINER Mark Shust &lt;mark@shust.com&gt;

ADD . /opt/app
WORKDIR /opt/app/programs/server

RUN npm install \
  && npm cache clear \
  && mv /opt/app/programs/server/node_modules /opt/

RUN mv /opt/app/package.json /opt

WORKDIR /opt
RUN npm install \
  && npm cache clear

RUN ln -s node_modules app/programs/server/node_modules \
  && ln -s node_modules app/programs/web.browser/node_modules \
  && ln -s node_modules app/programs/web.cordova/node_modules

WORKDIR /opt/app

ENV PORT 80
EXPOSE 80

CMD ["node", "main.js"]
```

This Dockerfile is meant to be ran within the bundled archive's `bundle` folder. We'll run this later with a custom build script, but more on that later. First, let's explain what is going on within this file.

```docker
ADD . /opt/app
WORKDIR /opt/app/programs/server

RUN npm install \
  && npm cache clear \
  && mv /opt/app/programs/server/node_modules /opt/
```

All of these lines with the exception of the last `mv` directive are standard when deploying Meteor apps. The `programs/server` folder comes with it's own package.json file, and you need to `npm install` to install the dependencies with NPM. The next line moves the node_modules folder into the main directory, so they are reside at /opt/node_modules instead of /opt/app/programs/server/node_modules. I'm doing this to setup a general location to store contents of all node_modules folders. Because Meteor 1.3 allows you to define your own package.json file, we also need to install those.

```docker
RUN mv /opt/app/package.json /opt

WORKDIR /opt
RUN npm install \
  && npm cache clear

RUN ln -s node_modules app/programs/server/node_modules \
  && ln -s node_modules app/programs/web.browser/node_modules \
  && ln -s node_modules app/programs/web.cordova/node_modules
```

Here's where our Meteor 1.3-specific comes into play. I'm copying our user-defined packages.json file to /opt/packages.json. When we then go to /opt and then run npm install, everything installed with our custom-created packages.json file is now merged with the output of our previous npm install command that contains our required Meteor NPM dependencies. This means the contents of our Meteor installed NPM packages, along with our custom NPM packages, are now all in one place: /opt/node_modules.

Then, we setup symlinks to our app/programs/*/node_modules directories, so our server, web browser and web cordova folders all have access to all NPM packages.

```docker
WORKDIR /opt/app

ENV PORT 80
EXPOSE 80

CMD ["node", "main.js"]
```

Our final app code is now all done in /opt/app, so all we have to do is set the PORT environment variable, expose that port, and tell Docker to run `node main.js`, which is the entry point of our Meteor app.

## Custom Builder Bash Script

We'll take one step back here, because we are trying to automate this build process as much as possible. I built a custom build script in my main Meteor app directory with the following:

<div class="gatsby-code-title">.dockerbuilddeploy</div>

```bash
#!/bin/bash
VERSION=$1
CURRENT_DIR=`basename $PWD`
BUILD_DIR=../$CURRENT_DIR-build
DOCKER_TAG=gcr.io/my-project-12345/myapp
SERVER=http://mydomain.com

rm -rf $BUILD_DIR

echo "Building to $BUILD_DIR"
meteor build --architecture=os.linux.x86_64 --server=$SERVER --directory $BUILD_DIR

cp package.json $BUILD_DIR/bundle/
cp Dockerfile $BUILD_DIR/bundle/
cp .dockerignore $BUILD_DIR/bundle/
cd $BUILD_DIR/bundle/

echo "Building Dockerfile..."
docker build -t ${DOCKER_TAG}:${VERSION} .
gcloud docker push ${DOCKER_TAG}:${VERSION}
kubectl rolling-update ${CURRENT_DIR} --update-period=15s --image=${DOCKER_TAG}:${VERSION}
```

It can be executed with a specific version number by running:

```plain
./.dockerbuilddeploy 1.0.0
```

Feel free to modify this as you wish, but generally when I say my code is done and is ready to be pushed to production, I'll want my Docker image to be automatically built and deployed to production. This script bundles my Meteor app, builds a Docker image, pushes it up to Google Container Registry, and then deploys to Kubernetes with a rolling update on production.

## Docker-specific Files

Note that I also setup a `.dockerignore` file in my main app directory with the following:

```plain
.meteor/local
node_modules
```

We don't want to push the .meteor/local or node_modules directories, as these will be automatically built on production.

Note that we can also run our image locally, but running:

```plain
docker run --env-file .dockerenv our-image-tag/1.0.0
```

This runs from a `.dockerenv` file, which contains all of my environment variables:

```plain
ROOT_URL=http://localhost
MONGO_URL=mongodb://123.456.789.123:27017,123.456.789.124:27017/flow?replicaSet=rs0&readPreference=primaryPreferred&w=majority
MONGO_OPLOG_URL=mongodb://oplogger:MYPASSWORD@123.456.789.123:27017,123.456.789.124:27017/local?authSource=admin
MAIL_URL=smtp://postmaster%40myname.mailgun.org:MYPASSWORD@smtp.mailgun.org:2525
```

## Final Notes

My final Docker image weighs in at a measly 274MB. While it is a fairly small app, it contains some larger libraries and dependencies, and actually weighed in on Meteor 1.2 with meteord at 1.2GB.

Feel free to use these thoughts & Docker build concepts however you wish for your own custom app. Don't be afraid to build your own custom images and deployment process to match your needs; I needed very-small Docker images and a streamlined process, so I can deploy very quickly with the least resistance possible. I also needed to know what is going on 100% with my deployment process so I can modify it as necessary.

Meteor 1.3 is a super great upgrade, as I'm noticing vast improvements with building and managing a project with the new NPM support. Combined with Docker and something like Kubernetes along with custom build scripts, leads to a very straight-forward deployment process. Best of luck!
