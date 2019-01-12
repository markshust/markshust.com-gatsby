import React from "react"
import Layout from '../components/Layout'
import PropTypes from "prop-types"
import kebabCase from "lodash/kebabCase"
import { Helmet } from "react-helmet"
import { Link, graphql } from "gatsby"
import { rhythm } from '../utils/typography'

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title, description },
    },
  },
}) => {
  return (
  <Layout location={location} subtitle={description} title={title}>
    <h1>Tags</h1>
    <Helmet title={title} />
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

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}

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
