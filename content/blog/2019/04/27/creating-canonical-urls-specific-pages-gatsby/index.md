---
title: "Creating canonical URLs for specific pages with Gatsby"
date: "2019-04-27T12:00:00.000Z"
tags: ["gatsby", "seo"]
---

Gatsby has a simple plugin named `gatsby-plugin-canonical-urls` which sets the base URL used for canonical URLs for your website. Canonical URLs are important, as they tell search engines what the "original" URL was for a specific page or blog post. This helps prevent your website from being penalized for duplicate content.

The problem with this module is that it doesn't give you the ability to override a canonical URL for a specific page on your Gatsby site. The situation applies when you'd like to take the original blog post made on an external website, and cross-post it into your personal website. Luckily, there's a really simple solution to this problem.

First, remove the `gatsby-plugin-canonical-urls` Gatsby plugin (if you previously installed it) by running:

```bash
yarn remove gatsby-plugin-canonical-urls
```

...and replace it with the `gatsby-plugin-react-helmet-canonical-urls` plugin. You'll also want to install the Helmet plugin if you haven't already to provide this ability:

```bash
yarn add gatsby-plugin-react-helmet gatsby-plugin-react-helmet-canonical-urls
```

Next, add the plugin configuration to your `gatsby-config.js` file and change the `siteUrl` value to the base canonical URL you want to use for your site.

```js
  ...
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-react-helmet-canonical-urls`,
      options: {
        siteUrl: `https://www.example.com`,
      },
    },
  ]
  ...
```

At this point, this new plugin will act exactly the same way as the `gatsby-plugin-canonical-urls` plugin. However, it will give you the ability to extend it even further.

By default, this plugin will add a new canonical tag to your HTML's head with the following contents:

```html
<link rel="canonical" key="http://www.example.com/about-us/" href="http://www.example.com/about-us/" data-react-helmet="true" />
```

Let's make it so that we can use a different canonical URL for a specific blog post.

Open up your seo component located at `src/components/seo.js`. This is the component that injects SEO tags into your site with React Helmet.

Add the prop:

```diff
 function SEO({
+  canonical,
   description,
   lang,
   meta,
   ...
```

Then, add the `link` attribute to the `Helmet` component within this file. We'll only inject this attribute value if the `canonical` prop has been passed in, and then we'll set the `rel`, `key`, and `href` properties:

```diff
           <Helmet
             htmlAttributes={{ lang }}
             title={title}
             titleTemplate={overrideTitle ? `%s` : `%s | ${siteTitle}`}
+            link={
+              canonical
+                ? [{ rel: 'canonical', key: canonical, href: canonical }]
+                : []
+            }
             meta={[
               {
                 name: `description`,
```

Finally, we'll add that prop as a prop type:

```diff
 SEO.propTypes = {
+  canonical: PropTypes.string,
   description: PropTypes.string,
   lang: PropTypes.string,
   meta: PropTypes.array,
```

Next, we'll open up the blog template at `src/templates/blogs.js`, and pass the `canonical` prop to the `SEO` component:

```diff
         <SEO
           title={post.frontmatter.title}
           description={post.excerpt}
           keywords={post.frontmatter.tags}
+          canonical={post.frontmatter.canonical}
         />
```

Note that we are passing the value from our blog post frontmatter. We'll use the name `canonical` to keep things consistent.

Then, we need to make sure to add that `canoncial` value coming from our frontmatter into our GraphQL query:

```diff
 export const pageQuery = graphql`
   query BlogBySlug($slug: String!) {
     site {
       siteMetadata {
         title
         description
         author
       }
     }
     markdownRemark(fields: { slug: { eq: $slug } }) {
       id
       excerpt(pruneLength: 160)
       html
       frontmatter {
         title
         date(formatString: "MMMM DD, YYYY")
         tags
+        canonical
       }
     }
   }
  ```

Finally, we have one last step. Add the value of `canonical` to your blog post frontmatter:

```diff 
---
 title: "Post goes here"
 date: "2019-04-27T12:00:00.000Z"
+canonical: "https://your-original-blog.com/post-goes-here"
---
```

Note that anytime you add a field to frontmatter, you need to restart the gatsby server in order for updates to take affect. Now, when you visit `https://www.example.com/post-goes-here` (or whatever URL the above post resolves to), the following canonical URL will now be your new value, derived from frontmatter:

```html
<link rel="canonical" key="https://your-original-blog.com/post-goes-here" href="https://your-original-blog.com/post-goes-here" data-react-helmet="true" />
```

Hopefully this sheds some light on how easy it is to do some things in Gatsby. Happy cross-posting!
