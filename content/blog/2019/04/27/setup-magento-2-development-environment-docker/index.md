---
title: "Setup a Magento 2 Development Environment with Docker"
date: "2019-04-27T13:00:00.000Z"
tags: ["docker", "magento", "magento2"]
---

It can be very difficult to get a Magento 2 development environment setup quickly & easily. Back in the middle of 2015, I was trying to getting a jump-start on Magento 2 module development, but had a horribly hard time just getting Magento installed (these were the pre-2.0 GM days). I was passively watching a project that was new at the time called Docker, but I really wasn't familiar with it. It didn't matter though; I loved the concepts around containerization, and decided this was the path I was moving forward on.

I seriously locked myself in my office for almost a couple months (I was a freelancer working from home at the time, so I was able to do this). I came out to eat, drink and sleep, but that is about it. A few weeks in, I managed to see the home page of Magento 2 (albeit with a ton of JavaScript errors). A week later, I managed to make all of the errors go away, but had some workflow issues with volumes. After a total of six weeks... I was able to develop on Magento 2!

I did take the next day off to play some video games and eat some Chipotle.

Fast-forward almost four years, and <a href="https://github.com/markshust/docker-magento/" target="_blank">my Docker configuration for Magento</a> has almost 500 stars on GitHub (the most of any Magento + Docker repo on GitHub). I'm actually more impressed that it's been forked more than 200 times -- forking typically shows real actual use! The original old images were under the "Mage Inferno" name and were <a href="https://hub.docker.com/u/mageinferno/" target="_blank">downloaded over 100,000 times</a>. I'm very happy and impressed with these numbers. If it seems as though I'm bragging, it's because I am. Creating and maintaining a completely free open-source library, one which I am not compensated for or hardly ever receive praise for, is extremely difficult. I've given up plenty of family outings and free time to maintain this library, and it's become a labor of love at this point.

I managed to do a complete rebuild of the filesystem approach this last December, and finally got it to the point where I am truly happy with the result. That said, this approach can be a bit difficult to pickup and implement across all of your team's projects. I kept hearing the same questions: "How do I use this with my existing project?", "How can I configure PHP with my own config files?", or "How do I get started?". So, I decided to make a completely free screencast course:

This course came out to 20 lessons, all about setting up a development environment for Magento using Docker. It's a very easy watch at just over 30 minutes of total content.

After posting the link to it on twitter, it immediately got over 50 retweets and 100 likes!

<div style="margin: 1rem auto 2rem; max-width: 100%; width: 500px;">
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">the course is here 🥳 -- learn to Magento + Docker today with 20 free lessons. 100% free for the Magento community <a href="https://twitter.com/hashtag/magento?src=hash&amp;ref_src=twsrc%5Etfw">#magento</a> <a href="https://twitter.com/hashtag/magento2?src=hash&amp;ref_src=twsrc%5Etfw">#magento2</a> <a href="https://twitter.com/hashtag/docker?src=hash&amp;ref_src=twsrc%5Etfw">#docker</a> <a href="https://twitter.com/hashtag/php?src=hash&amp;ref_src=twsrc%5Etfw">#php</a> <a href="https://twitter.com/hashtag/xdebug?src=hash&amp;ref_src=twsrc%5Etfw">#xdebug</a> <a href="https://twitter.com/hashtag/phpstorm?src=hash&amp;ref_src=twsrc%5Etfw">#phpstorm</a> <a href="https://t.co/Y9POQpalgQ">https://t.co/Y9POQpalgQ</a> <a href="https://t.co/AWBsMfFoM4">pic.twitter.com/AWBsMfFoM4</a></p>&mdash; Mark Shust ☕️🚀 (@markshust) <a href="https://twitter.com/markshust/status/1113857371938357253?ref_src=twsrc%5Etfw">April 4, 2019</a></blockquote>
</div>

I hope this is just the start of many screencast courses I can make over time. You can signup for the course by clicking the Enroll button below:


<div style="text-align: center; margin-bottom: 2rem;">
<h3 style="margin: 0.5rem;">Setup a Magento 2 Development Environment with Docker</h3>
<a href="https://learnm2.com/p/setup-magento-2-development-environment-docker" target="_blank" class="DockerMagento__SignupLink-hYVKxh ddjNtF">Free Course! Enroll Now</a>
</a>
</div>

If you were just interested in the Docker configuration, feel free to visit the repo on GitHub at <a href="https://github.com/markshust/docker-magento/" target="_blank">https://github.com/markshust/docker-magento/</a>. All GitHub stars️ ⭐️ are appreciated!
