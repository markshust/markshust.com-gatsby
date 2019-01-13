import React from 'react'
import Layout from '../components/Layout'
import { Link, graphql } from 'gatsby'
import { rhythm } from '../utils/typography'

const TagsTemplate = ({ pageContext, data, location }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const siteSubtitle = data.site.siteMetadata.description
  const siteTitle = data.site.siteMetadata.title
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } tagged with "${tag}"`

  return (
    <Layout location={location} subtitle={siteSubtitle} title={siteTitle}>
      <h1>#{tag}</h1>
      <h2
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
          fontWeight: 200,
          fontSize: rhythm(1),
        }}
      >
        {tagHeader}
      </h2>
      <ul>
        {edges.map(({ node }) => {
          const path = node.fields.slug
          const { title } = node.frontmatter
          return (
            <li key={path} style={{ listStyle: 'none' }}>
              <Link to={path}>{title}</Link>
            </li>
          )
        })}
      </ul>
      <div style={{ marginTop: rhythm(3) }}>
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
