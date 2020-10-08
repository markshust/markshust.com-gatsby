import React from "react"
import { graphql } from "gatsby"
import Layout from "@components/layout"
import SEO from "@components/seo"
import { rhythm } from "@utils/typography"
import shareOnTwitter from "@assets/share-on-twitter.png"
import styled from "styled-components"
import Newsletter from "@components/newsletter"

const DateWrapper = styled.p`
  display: block;
  margin-top: ${rhythm(0.75)};
  margin-bottom: ${rhythm(1.5)};
  color: hsla(0, 0%, 0%, 0.3);
`

const EditOnGitHubLink = styled.a`
  color: inherit;
  @media only screen and (max-width: 768px) {
    display: table;
  }
`

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const postTitle = post.frontmatter.title
    const tags = post.frontmatter.tags

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={postTitle}
          description={post.frontmatter.description || post.excerpt}
          keywords={tags}
          canonical={post.frontmatter.canonical}
        />
        <article>
            <h1 className="tracking-tight text-3xl lg:text-5xl font-extrabold text-gray-900 mt-8">
              {postTitle}
            </h1>
            <DateWrapper>
              {post.frontmatter.date} &nbsp; &middot; &nbsp;{` `}
              {post.fields.readingTime.text}
              <span className="hide-mobile">&nbsp; &middot; &nbsp;{` `}</span>
              <EditOnGitHubLink
                href={
                  "https://github.com/markshust/markshust.com/tree/master/content/blog" +
                  this.props.location.pathname +
                  "index.md"
                }
                target="_blank"
              >
                Edit on GitHub
              </EditOnGitHubLink>
            </DateWrapper>
              <section
                  className="prose text-gray-700 prose-lg"
                  dangerouslySetInnerHTML={{ __html: post.html }}
              />
              <a
                href={
                  "https://twitter.com/intent/tweet/?text=" +
                  postTitle +
                  "&url=https://markshust.com" +
                  post.fields.slug +
                  "&via=" +
                  this.props.data.site.siteMetadata.social.twitter
                }
              >
                <img
                  src={shareOnTwitter}
                  alt="Share On Twitter"
                  style={{
                    width: 320,
                  }}
                  className="max-w-full mt-20 mb-0 mx-auto"
                />
                <div className="text-center mb-6">Let others know about this article</div>
              </a>
            <Newsletter />
        </article>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        social {
          twitter
        }
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
        canonical
      }
      fields {
        readingTime {
          text
        }
        slug
      }
    }
  }
`
