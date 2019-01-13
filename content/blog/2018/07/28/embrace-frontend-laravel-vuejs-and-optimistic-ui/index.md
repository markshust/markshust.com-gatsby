---
title: "Embrace the frontend with Laravel, VueJS and optimistic UI"
date: "2018-07-28T18:24:00.000Z"
tags: ["laravel", "vuejs"]
---

I just came back from an absolutely fantastic trip and conference of LaraCon in Chicago. Even though I no longer work daily with Laravel, I thought there were so many good sessions presented, and that going would benefit anyone having an interest in web development.

Caleb had a good session, <a href="https://speakerdeck.com/calebporzio/embrace-the-backend-laracon-2018" target="_blank">Embracing the Backend</a>, which used a sample twitter app to post a tweet and some tips and tricks around getting around complexity with VueJS. But I couldn't help be reminded of a past life of mine. About a decade ago I started developing a Point of Sales system for bars and nightclubs called Chanj POS. Here's our welcome video from quite a few years back, where you can see some of the user interface I created:

<iframe width="560" height="315" src="https://www.youtube.com/embed/oWe28o2y_eE" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

The POS system is no longer active, however we went through some pretty technological advancements at the time, one being that the entire POS system was developed as a single page application in JavaScript and jQuery (10 years ago!), the other being that we needed to deal with a high level of traffic and latency issues. This was a time long before React and Vue even existed.

The app wound up using a combination of Firebase & Websockets, LocalStorage, Redis caching and ....some JavaScript trickery. While testing our app in a very large-profile nightclub in Las Vegas, we noticed a big issue; the cloud wasn't working. We needed to post user interactions to a backend Django API (thanks Tastypie!), but this caused major lags to appear in our app while the Ajax/REST API request was being processed. I looked into various solutions involving some sort of Websocket solutions, and ultimately decided on Firebase as a quick solution we can get up and running within a couple weeks. It worked absolutely fantastic for certain items as we no longer had to poll API requests like open checks or user data, but certain things still required an Ajax request to be processed (such as opening and sending a new check object). I needed to think of another way.

This is when I came up with the idea of an optimistic user interface. I believe there was only one other framework at the time that was trying to do this called Meteor, however it was in early beta at the time and would require major tooling updates to get it integrated with our POS. I had the idea that if we can "fake it" and just say the request processed, without it actually being processed, we can achieve the "instant UI" we needed in order to make our app work in a high-traffic environment. We used an interesting combination of Ajax callback requests along with Local Storage in order to achieve what was a really great solution for the time.

Going back to Caleb's session, it was basically summarized that there is too much work happening with the frontend of the app in VueJS, that is leading to unnecessary complexity. A proposed solution to dealing with things happening on the frontend that were hard to debug was to not be afraid to use `window.location.reload` when processing an Ajax submission, and to let Laravel do standard processing on an Ajax post and just have the page reload. I foresee two big issues with this approach:

Number one being there is really no reason to use VueJS at this point. Since a VueJS action is just being passed to Axios to handle an Ajax POST/PATCH event, and on success is doing a page reload, why not just use a Blade template and post directly to the endpoint with a standard form submission? It's hard to come up with an argument to use VueJS at all in this scenario, as Blade is much simpler and doesn't require JavaScript at all. 

Number two, by using `window.location.reload` in the method on an Axios response, all of the potential benefits of using JavaScript are being thrown out of the window. By essentially doing a standard form post, you're requiring an HTTP round trip to process the submission. The argument is that we now have HTTP2, great browsing caching, fast internet speeds but, ....at the end of the day it would be better to just keep things in JavaScript and reap some of the benefits.

Keeping the form submission process in JavaScript allows us to do interesting things, like implementing "optimistic UI" into the process. The idea here is the same idea I had a long time ago with the POS -- fake the form submission process, say it's done, and eliminate the perceived round trip by throwing it to the backend process and not block the interface at all. Now, we do have to be mindful that if things load too fast, the user may "perceive" that things are going too quick and we aren't doing enough work (yes, things can actually be too fast). However, this also provides us with other opportunities to fix this situation, such as a complex animation morphing the tweet onto the screen, or some other great UI/UX addition.

Without further adieu, I loaded code up on GitHub which contains this dummy twitter app. You can check it out at <a href="https://github.com/markoshust/optimistic-ui-laravel-vue" target="_blank">https://github.com/markoshust/optimistic-ui-laravel-vue</a>. There are a lot of areas I fudged to get them loaded quicker as this isn't a real app, but you can rest assured that the concept provided therein absolutely relates to real-app usage.

Here's a video demonstrating the result:

<iframe width="560" height="315" src="https://www.youtube.com/embed/MofZ3LDhiSI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

The specific code to be referenced is <a href="https://github.com/markoshust/optimistic-ui-laravel-vue/blob/master/resources/assets/js/components/TweetComponent.vue" target="_blank">https://github.com/markoshust/optimistic-ui-laravel-vue/blob/master/resources/assets/js/components/TweetComponent.vue</a>

```javascript
<script>
    export default {
        data() {
            return {
                tweets: [],
                tweetInput: ''
            };
        },
        props: ['initialTweets'],
        mounted() {
            this.tweets = _.orderBy(this.initialTweets, 'created_at', 'desc');
        },
        methods: {
            handleSubmit() {
                const self = this;
                const newTweet = {
                    tweet: this.tweetInput,
                    username: 'markshust',
                };
                // optimistic UI
                self.tweets.unshift(newTweet);
                self.tweetInput = '';
                axios.post('/tweet', newTweet)
                    .then(function(response) {
                        console.log('posted to server, we do not have to do anything here as ui is already updated!');
                    })
                    .catch(function(error) {
                        console.log('an error occured, tell user and back out optimistic ui update');
                        alert(error);
                        self.tweets.shift();
                    });
            }
        }
    }
</script>
```

Notice the code around the line commented with "optimistic UI", and what we are doing to the Vue observable. When the form is posted, we are "assuming" the post happened successfully -- in terms of the visitor, it's done! No need to wait for the Ajax response. We can "fake it until we can't make it". Most (99%) of the time, the post goes through anyway, so why are we making the visitor wait for an Ajax response to tell them that it submitted correctly? Now, if you are dealing with transactions of any sort that require guaranteed writes such as eCommerce ordering, you really don't want to fake it. However, most interactions are not that important and we can totally assume the response has gone through correctly.

An error happens? Since this is an exception to a normal post (remember that most posts go through fine), we design for the 99%, not for the exception. However, if it does happen all we need to do is just tell the user, and "shift" off the last tweet. Now, this code is overly simplified, as it's possible you are streaming tweets in real-time and you'll have to determine the specific id that was posted to shift off, amongst other things. However, these are just implementation details; the methodology of how to handle this remains all the same. 

Think this is overly complex, or don't want to deal at all with JavaScript? There's nothing wrong with just using Blade and I'd be none the wiser =)
