import React from "react"
import { graphql } from "gatsby"

import Bio from "@components/bio"
import Layout from "@components/layout"
import SEO from "@components/seo"
import { rhythm } from "@utils/typography"
import shareOnTwitter from "@assets/share-on-twitter.png"
import styled from "styled-components"
import Newsletter from "@components/newsletter"

const Wrapper = styled.div`
  margin-top: ${rhythm(3)}
  display: grid;
  grid-template-columns: 2fr 3fr;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    grid-template-columns: auto;
  }
`

const EditOnGitHubLink = styled.a`
  @media only screen and (max-width: 768px) {
    display: table;
  }
`

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const postTitle = post.frontmatter.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={postTitle}
          description={post.frontmatter.description || post.excerpt}
          keywords={post.frontmatter.tags}
          canonical={post.frontmatter.canonical}
        />
        <article>
          <header>
            <Bio />
            <h1
              style={{
                marginTop: rhythm(1),
                marginBottom: 0,
              }}
            >
              {postTitle}
            </h1>
            <p
              style={{
                display: `block`,
                marginBottom: rhythm(1),
              }}
            >
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
            </p>
          </header>
          <section dangerouslySetInnerHTML={{ __html: post.html }} />
          <footer>
            <Wrapper>
              <section
                style={{
                  textAlign: "center",
                  margin: `0 0 ${rhythm(3)}`,
                }}
              >
                <a
                  href={
                    "https://twitter.com/intent/tweet/?text=" +
                    postTitle +
                    "&url=https://markshust.com" +
                    post.fields.slug +
                    "&via=" +
                    this.props.data.site.siteMetadata.social.twitter
                  }
                  style={{ boxShadow: "none" }}
                >
                  <img
                    src={shareOnTwitter}
                    alt="Share On Twitter"
                    style={{
                      marginTop: rhythm(0.5),
                      width: 320,
                      maxWidth: "100%",
                    }}
                  />
                  <div>Let others know about this article</div>
                </a>
              </section>
              <section
                style={{ margin: `0 ${rhythm(1)} 0 auto`, textAlign: "center" }}
              >
                <Newsletter />
              </section>
            </Wrapper>
          </footer>
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
