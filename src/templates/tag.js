import React from "react"
import Layout from "../components/layout"
import { Link, graphql } from "gatsby"
import SEO from "../components/seo"

const TagsTemplate = ({ pageContext, data, location }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const siteSubtitle = data.site.siteMetadata.description
  const siteTitle = data.site.siteMetadata.title
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`
  const title = `${tag} - Mark Shust`

  return (
    <Layout location={location} subtitle={siteSubtitle} title={siteTitle}>
      <SEO
        title={title}
        overrideTitle
        description={tagHeader}
        keywords={[tag, `mark shust`]}
      />
      <h1>#{tag}</h1>
      <h2>{tagHeader}</h2>
      <ul>
        {edges.map(({ node }) => {
          const path = node.fields.slug
          const { title } = node.frontmatter
          return (
            <li key={path}>
              <Link to={path}>{title}</Link>
            </li>
          )
        })}
      </ul>
      <div>
        Looking for something else? <Link to="/tags">Browse all tags</Link>
      </div>
    </Layout>
  )
}

export default TagsTemplate

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            tags
            title
          }
        }
      }
    }
  }
`
