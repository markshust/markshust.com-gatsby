---
title: "Migrating my personal blog from Drupal to Gatsby"
date: "2019-01-14T20:06:00.000Z"
tags: ["drupal", "gatsby", "reactjs"]
---

It's been almost ten years since [my first blog post](/2009/09/21/preventing-injection-attacks-and-securing-your-website/). I needed a simple platform to write blog posts, and was working with [Drupal](https://www.drupal.org/) at the time. Pretty much everyone was using [Wordpress](https://wordpress.com/), but I wasn't a fan. I wanted to use something I was familiar with that can be easily customized.

Fast-forward ten years, and the space has dramatically changed. I've always been a fan of the simplest solution to implement, so naturally static-site generators have been drawing me in lately, specifically [Gatsby](https://www.gatsbyjs.org/). For much of the same reasons I launched on Drupal are the same reasons I decided to make the switch to Gatsby.

## Drupal difficulties

For one, my Drupal site was running PHP 5.3, which reached end of life in August of 2014. I've been running on fumes for a while, but it's no biggie as this is just my personal blog. However, the bigger reasons for me to switch were constant Drupal security updates, packages getting out of date, difficulty updating frontend code for a new design, and me being disconnected from the Drupal space for a while and forgetting how to create custom modules (and the time involved in doing so).

## React & GraphQL

Gatsby seems to resolve almost all of these downsides. For one, static-site generators just publish files of static content -- no security updates needed! I'm a PHP guy, however I have experience in React and really love it for frontend interfaces, so using React was a huge boon to my productivity. The fact that is also does not use some weird, proprietary framework or templating system was a huge benefit. Also by running React, it made it very easy for me to write custom code quickly to fit my needs - it's just JavaScript!

I'm really not familiar with GraphQL, however I watched a <a href="https://egghead.io/courses/build-a-blog-with-react-and-markdown-using-gatsby" target="_blank">course on Gatsby on Egghead.io by Taylor Bell</a> and it started to make some sense. The ability to define static files as querable data is very powerful! I was able to figure out a few basics with GraphQL very easily, such as aliases and working with the <a href="https://github.com/graphql/graphiql" target="_blank">graphiql</a> browser.

## Code/syntax highlighting

Gatsby also has <a herf="https://www.gatsbyjs.org/docs/" target="_blank">unbelievable documentation</a>, and a few built-in plugins are very helpful, including <a href="https://prismjs.com/" target="_blank">Prism</a>. Since this is a tech-related blog, I show code examples in almost all my posts, and having something like Prism which is up-to-date and recent was a big benefit for me. I used <a href="http://qbnz.com/highlighter/" target="_blank">GeSHi</a> and the <a href="https://www.drupal.org/project/syntaxhighlighter" target="_blank">syntaxhighlighter module</a> with Drupal in the past, but they were very buggy and caused lots of formatting issues. Dealing with Prism is very straight-forward and easy to use. And everything is stylable with CSS!

## Editing

On to the editor, Drupal's WYSIWYG editor left a lot to be desired; and that's an understatement. There is no editor with Gatsby, as posts are driven purely by <a href="https://en.wikipedia.org/wiki/Markdown" target="_blank">markdown</a>. I used the <a href="https://www.drupal.org/project/markdown" target="_blank">markdown module</a> with Drupal for the last few years, however it was a bit hard to preview posts before submitting, and dealing with code/syntax highlighting within Drupal's WYSIWYG editor was painstaking. Since I can now just write markdown, things are just so much simpler, and there is very little that can go wrong when it comes to highlighting code and formatting my posts the way I want to.

I do sort of wish I had some sort of admin/GUI in which I can write markdown and it would save the new post as a markdown file on the filesystem, then have it committed & pushed up through version control. There's no reason we can't build something to do this, so perhaps we'll have that in the near future. Until then, writing and editing locally is really pretty nice, as real-time updates are here today on my Mac and it's very easy to see exactly how my post is going to look on production before it gets published.

I also love the idea of my website being open source. Notice a typo on my site? <a href="https://github.com/markoshust/markshust.com" target="_blank">Submit a PR!</a>

## Migrating the data

Migrating took a little bit of time, but was more of a slow & redundant process versus it being difficult. At first I was going to write a bash script that connected to MySQL to dump out posts -- then just figured it would be a good time to have a stroll through my blogging history, and manually clean up the posts while doing so. I'm glad I did, as some of the code examples in blog posts were thrown severely out of whack from the WYSIWYG editor, and some of the syntax highlighting was totally whacked on certain blog posts. Gatsby's <a href="https://www.gatsbyjs.org/packages/gatsby-remark-prismjs/" target="_blakn">built-in syntax highlighter for prism and related documentation</a> was wonderful, and I quickly found and added the <a href="https://www.gatsbyjs.org/packages/gatsby-remark-code-titles/" target="_blank">code titles plugin for prism</a>. The formatting of the code title plugin was a bit awkard, and it doesn't allow for integration with config options such as `numberLines`:

```
// recommended usage (no options...)
```js:title=this/is/my/file.js

// This isn't possible!
```js:{numberLines: true}title=this/is/my/file.js

// y no liek dis?
```js:{numberLines: true, title: "this/is/my/file.js"}
```

...however the ability to just define a `div` right above it is working for the time being:

```
<div class="gatsby-code-title">this/is/my/file.js</div>

```js{numberLines: true}
// code goes here...
```

## Theming & Styling

My goal was a very "quick to market" launch, so I went with the built-in fonts, and did some minor styling to make it unique. Mobile viewports are important to me, as I personally do 90% of my reading on my iPhone. Out of the box, mobile compatibility was really pretty great. I used the <a href="https://github.com/gatsbyjs/gatsby-starter-blog" target="_blank">gatsby-starter-blog</a> to bootstrap things, and just sort of went with it.

The frontend styling for my website isn't exactly where I want it to be, but I made some quick edits to get it close. In the future I'll be implementing <a href="https://www.styled-components.com/" target="_blank">styled components</a>, as I used it on some other projects and fell in love with it. I'd also like to replace the layout of the site with a CSS grid-based layout.

## Custom functionality

I really never had much custom on my personal website, however I did wind up doing something a bit different on my home page. My previous home page was just a mug of me and the title of my current position, but this time around I showed posts right on my home page. I also thought it would be nice if there was an easy way for someone to jump to any topic, so I put a list of tags, and made a sort-of tag cloud (note the font size):

```jsx:title=src/pages/tags.js
...
<Layout location={location} subtitle={description} title={title}>
    <h1>Tags</h1>
    <ul>
    {group.map(tag => (
        <li
        key={tag.fieldValue}
        style={{  }}
            listStyle: 'none',
            display: 'inline-block',
            padding: '1rem',
            fontWeight: tag.totalCount >= 5 && 'bold',
            fontSize:
            tag.totalCount >= 5 ? '2rem' : tag.totalCount >= 3 && '1.5rem',
        }}
        >
        <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
            #{tag.fieldValue} ({tag.totalCount})
        </Link>
        </li>
    ))}
    </ul>
</Layout>
...
```

Honestly, something that really won't survive long term, but code that can be easily removed with future code is good, eh? You can check out the [tags](/tags) endpoint for how this all looks -- pretty neat, considering it took hardly any code to implement. I'm excited about the ability to use React for custom implementations in the future.

## Time to market

How long did this all take me? Well, I woke up on a Saturday morning around 5:00am, and got the itch to do something on my personal time that was fun. I also wanted this update in place for future blog posts and ideas I have planned. Around 5:00pm the next day, I switched the root DNS to <a href="https://www.netlify.com/" target="_blank">Netlify</a> (great host by the way, all for free!). I did sleep a full 8 hours and take eating breaks 😅.

I had a few hiccups with GraphQL and Prism, but overall it was a really great experience. I'd recommend Taylor's Egghead.io screencast before attempting the migration -- I watched it twice; once about two months ago, and again about a month ago. Most of the ideas such as frontmatter and GraphQL querying stuck in my head, so it came fairly natural to me at the time of the migration. About 80% of my time was spent re-writing blog posts from the WYSIWYG editor into Gatsby's markdown format.

## Conclusion

Would I recommend Gatsby to anyone?

That's a resounding... **YES**. Gatsby is even more amazing when you actually start using it in production. I just cannot wait until I can use this on a commercial project, as I think there can be a lot of use-cases for it well beyond a personal blog. Until then, I'm looking to have a very prolific-blog-post-writing 2019!
