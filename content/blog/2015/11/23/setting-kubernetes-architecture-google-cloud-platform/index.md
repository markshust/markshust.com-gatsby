---
title: "Setting Up Kubernetes Architecture on Google Cloud Platform"
date: "2015-11-23T21:31:00.000Z"
tags: ["gcp", "kubernetes"]
---

I needed a quick way to kick off some Docker containers, and wanted some experience working with Kubernetes. I've been playing around with Docker for some time now, and wanted to test out a real deployment to Google Cloud Platform. 

## Architecture Overview

Here's a quick architecture diagram of the different pieces of the Kubernetes architecture.

- **Container Cluster**: A container cluster is the top level of a Kubernetes architecture, and manages your compute engine instances and the Kubernetes API.
- **Replication Controller**: A complex name for something that just manages your container runtime. This just ensures any number of pods are running at one time.
- **Pod**: A pod is a group of containers on a specific compute engine. They control how containers are scaled, and to what extend. You can think of a pod at a high-level as a piece that manages a set of containers on one machine.
- **Service**: A service just maps container ports to a pod (or many pods). This allows you to access your container publicly. External requests get passed through from Cluster to Pod to Service.

## Setup Overview

I'm going to keep things very consistent throughout these steps, and since you can run everything through command line, I'll avoid the web interface completely. You can use the web interface to confirm certain actions if you wish (even though you can still do that through CLI), but I think things are easier to follow if everything is run from the command line.

I'll also assume you already have the <a href="https://cloud.google.com/sdk/" target="_blank">Google Cloud SDK</a> already setup, which gives you access to the `gcloud` command line tool. We'll use the `nginx` Docker image to test everything out because, well, it's the most popular Docker container out there and makes it easy to confirm everything is running correctly. I'll also use YAML everyplace, because even though I'm really into JavaScript everywhere, it is just easier to read and work with the YAML config.

I am also taking the cheapest route possible, as I'm sure everyone reading this post wants to experiment with Kubernetes cheaply. This keeps everyone happy.

## Setup a Container Cluster

If you haven't done so already, authenticate your gcloud CLI with:

```meta
gcloud auth login
```

All Kubernetes setups need a container cluster. So let's set one up:

```meta
gcloud container clusters create cluster-1 --zone us-central1-a --machine-type f1-micro`
```

This will create a container cluster with 3 nodes. Clusters are typically ran in an odd number of nodes, with a minimum of 3.

It will take a minute or two for Google to complete setting up your cluster. But after it is, you'll be presented with a status for your nearly generated cluster:

```meta
NAME       ZONE           MASTER_VERSION  MASTER_IP      MACHINE_TYPE  NUM_NODES  STATUS
cluster-1  us-central1-a  1.1.2           104.197.59.43  f1-micro      3          RUNNING
```

This will essentially generate 3 new compute engines, which will in turn talk to the Kubernetes API and manage your cluster.

## Setup a Pod

Pods manage the containers within our infrastructure. This process is very similar to setting up a replication controller, but with a bit simpler YAML file.

<div class="gatsby-code-title">pod.yml</div>

```yaml
apiVersion: v1
kind: Pod 
metadata:
  name: pod-1
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
```

There are some important things to note in this file. `apiVersion` always starts at `v1`, and `kind` here is `ReplicationController`. `metadata` defines some meta we can use to reference this "kind", such as the name of this kind, and labels/tags which we can use to reference the kind. `spec` are all the specifications for this kind. Under `spec` > `containers`, we specify the name of the Docker image we want to run, the name to tag it under, and the ports we want to expose.

This is always how we start a Kubernetes of any "kind", just replacing the `rc.yml` with the YAML file we want to execute. Everything that will start up and run is generated from our YAML file. Kick off the pod:

```meta
kubectl create -f pod.yml
```

We can see the running pods by executing:

```meta
kubectl get pod
```

## Setup a Replication Controller

Let's create a replication cluster next. A replication control is just a fancy name for keeping a specific number of pods running at any given time. It's actually optional to setup a replication controller, but it's a key piece in running a Kubernetes architecture.

Create a new local file with the following contents:

<div class="gatsby-code-title">pc.yml</div>

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: rc-1
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
```

Then start it up:

```meta
kubectl create -f rc.yml
```

We are already familiar with `apiVersion`, `kind` and `meta`. Under `spec`, we'll define the number of replicas, and more meta and spec for this kind. `selector` is used to define the tags the replication controller will use to look up your pod. We'll also define the same tags under `spec` > `template` > `metadata` > `labels`, so everything matches and we can reference this replication controller by a label as well.

In `spec` > `template`, we define the containers that we want to run, along with the name of the image, and ports to expose to our pod. These pods will automatically get scaled up or down when we start the replication controller. Note that this format matches exactly the setup for just setting up a pod.

Just like pods, we can later see which replication controllers are running by executing:

```meta
kubectl get rc
```

## Setup a Service

Getting a service running is the last step in completing our Kubernetes architecture. A service maps a port from our cluster container to the port on a pod. The container ports we expose are in turn available to the pod, completing the cycle.

<div class="gatsby-code-title">service.yml</div>

```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-1
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: nginx
  type: LoadBalancer
```

`apiVersion`, `kind`, `metadata`.... yea, we are masters at those now. For `spec`, we define the `port` we want to expose to our cluster, with `targetPort` being the port on our pod we want to map it to. `selector` must match our replication controller and/or pods, so the service can correctly select the correct pods to use. `type` set to `LoadBalancer` is what we want to expose this service to the public, and make it accessible from the web.

```meta
kubectl create -f service.yml
```

## Verify Publication of Services

Get the info for services:

```meta
kubectl get service
```

and you'll get a response like:

```meta
NAME         CLUSTER_IP     EXTERNAL_IP      PORT(S)   SELECTOR    AGE
kubernetes   10.167.240.1   <none>                 443/TCP   <none>            9m
service-1    10.167.243.6   104.197.47.139   80/TCP    app=nginx   1m
```

Note the "External IP" address; this is how we find the service from the web. If you don't see anything there, issue a "describe" like below to see the specifics about what is going on:

```meta
kubectl describe service service-1
```

This gives us additional info:

```meta
Name:			service-1
Namespace:		default
Labels:			app=nginx
Selector:		app=nginx
Type:			LoadBalancer
IP:			    10.167.243.6
LoadBalancer Ingress:	104.197.47.139
Port:			80/TCP
NodePort:		31866/TCP
Endpoints:		10.164.1.5:80
Session Affinity:	    None
Events:
  FirstSeen	LastSeen	Count		From					SubobjectPath	Reason					Message
  ─────────	────────	─────		────					─────────────	──────					───────
  1m		1m			1			{service-controller }					CreatingLoadBalancer	Creating load balancer
  47s		47s			1			{service-controller }					CreatedLoadBalancer		Created load balancer
```

If you don't see anything under "Events", give things a minute or two to get going.

Note the "LoadBalancer Ingress" IP Address (the same as our "External IP" address form before). Let's go ahead and bring that up in our browser, in this case http://104.197.47.139/

You should now see a "Welcome to nginx!" message.

## Conclusion

You now know how to setup a complete Kubernetes architecture, full with a container cluster, replication controller, a pod setup and service publication. Welcome to the future of containerization!
