import React from "react"
import Layout from '../components/Layout'
import kebabCase from "lodash/kebabCase"
import { Link, graphql } from "gatsby"

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title, description },
    },
  },
  location
}) => {
  return (
  <Layout location={location} subtitle={description} title={title}>
    <h1>Tags</h1>
    <ul>
      {group.map(tag => (
        <li key={tag.fieldValue} style={{ listStyle: 'none' }}>
          <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
            #{tag.fieldValue} ({tag.totalCount})
          </Link>
        </li>
      ))}
    </ul>
  </Layout>
)}

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
    allMarkdownRemark(
      limit: 2000
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
