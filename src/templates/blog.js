import React from "react"
import { graphql } from "gatsby"

import Logo from "@components/logo"
import Layout from "@components/layout"
import SEO from "@components/seo"
import { rhythm } from "@utils/typography"
import shareOnTwitter from "@assets/share-on-twitter.png"
import styled from "styled-components"
import Newsletter from "@components/newsletter"
import MagentoNewsletter from "../components/magentonewsletter"

const Header = styled.header`
  @media only screen and (max-width: 768px) {
    padding-top: 1em;
  }
`

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
    const isMagentoPost = tags.filter(tag => tag === "magento").length > 0

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={postTitle}
          description={post.frontmatter.description || post.excerpt}
          keywords={tags}
          canonical={post.frontmatter.canonical}
        />
        <article>
          <Header>
            <Logo />
            <h1
              style={{
                marginTop: rhythm(1),
                marginBottom: 0,
              }}
            >
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
          </Header>
          <section dangerouslySetInnerHTML={{ __html: post.html }} />
          <footer>
            <section
              style={{
                textAlign: "center",
                margin: `0 0 ${rhythm(2)}`,
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
                    marginTop: rhythm(1),
                    marginBottom: 0,
                    width: 320,
                    maxWidth: "100%",
                  }}
                />
                <div>Let others know about this article</div>
              </a>
            </section>
            <section
              style={{
                textAlign: "center",
                margin: `0 -${rhythm(1)}`,
                backgroundImage:
                  "linear-gradient(to bottom right, rgba(84, 165, 224, 0.9), rgba(54, 115, 74, 0.9))",
                lineHeight: "1.25rem",
              }}
            >
              {isMagentoPost ? <MagentoNewsletter /> : <Newsletter />}
            </section>
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
