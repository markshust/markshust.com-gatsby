import React from 'react'
import Layout from '../components/Layout'
import kebabCase from 'lodash/kebabCase'
import SEO from '../components/seo'
import { Link, graphql } from 'gatsby'

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title, description },
    },
  },
  location,
}) => {
  return (
    <Layout location={location} subtitle={description} title={title}>
      <SEO
        title="Magento 2 PHP JavaScript Laravel React Docker Tags - Mark Shust"
        overrideTitle
        description={description}
        keywords={[
          `magento`,
          `magento 2`,
          `php`,
          `javascript`,
          `laravel`,
          `react`,
          `reactjs`,
          `docker`,
          `mark shust`,
        ]}
      />
      <h1>Tags</h1>
      <ul>
        {group.map(tag => (
          <li key={tag.fieldValue}>
            <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
              #{tag.fieldValue} ({tag.totalCount})
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
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
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
