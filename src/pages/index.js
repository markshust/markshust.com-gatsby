import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "@components/layout"
import SEO from "@components/seo"
import { rhythm } from "@utils/typography"
import kebabCase from "lodash/kebabCase"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description
    const posts = data.allMarkdownRemark.edges
    const tags = data.tags.group

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={siteDescription} />
        <h2>Courses</h2>
        <p>
          Whenever I have fully grasped a concept or idea, my first inclination
          is to share what I have learned with others. The approach which makes
          the most sense to me is an online screencast course. My teaching style
          aims to first and foremost explain the why, while secondly explaining
          it in the most short and concise way possible.
        </p>
        <p>
          All of the courses I have created can be viewed or purchased through
          my online school <a href="https://m.academy">M.academy</a>.
        </p>
        <h2>Blogs</h2>
        <p>
          Since 2009 I've written about various topics and concepts in internet
          programming, in hopes that what I've learned can be helpful to others.
        </p>
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <article key={node.fields.slug}>
              <header>
                <h3
                  style={{
                    marginBottom: rhythm(1 / 4),
                  }}
                >
                  <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                    {title}
                  </Link>
                </h3>
                <div>
                  {node.frontmatter.date} &nbsp; &middot; &nbsp;{` `}
                  {node.fields.readingTime.text}
                </div>
              </header>
            </article>
          )
        })}
        <p style={{ marginTop: rhythm(2) }}>
          You may also browse all blog posts by tag:
        </p>
        <ul className="tags">
          {tags.map(tag => (
            <li>
              <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                #{tag.fieldValue} ({tag.totalCount})
              </Link>
            </li>
          ))}
        </ul>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        description
        title
      }
    }
    allMarkdownRemark(
      limit: 500
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          fields {
            slug
            readingTime {
              text
            }
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
    tags: allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
