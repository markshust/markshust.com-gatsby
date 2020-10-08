import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "@components/layout"
import SEO from "@components/seo"
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
          <div className="relative py-8 bg-white overflow-hidden">
              <h1 className="mb-8 text-3xl text-center font-extrabold tracking-tight text-gray-900 sm:text-5xl">Blog posts</h1>
              {posts.map(({ node }) => {
                  const title = node.frontmatter.title || node.fields.slug
                  return (
                      <article key={node.fields.slug} className="py-6">
                          <header>
                              <h3 className="font-sans py-2 text-xl">
                                  <Link to={node.fields.slug}>
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
              <p className="py-8">
                  You may also browse all blog posts by tag:
              </p>
              <ul className="tags">
                  {tags.map(tag => (
                      <li key={tag.fieldValue}>
                          <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                              #{tag.fieldValue} ({tag.totalCount})
                          </Link>
                      </li>
                  ))}
              </ul>
          </div>
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
