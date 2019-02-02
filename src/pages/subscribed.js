import React from 'react'
import Layout from '../components/Layout'
import { Link, graphql } from 'gatsby'
import kebabCase from 'lodash/kebabCase'
import { rhythm } from '../utils/typography'

const SubscribedPage = ({ data, location }) => {
  const { title, description } = data.site.siteMetadata
  const group = data.allMarkdownRemarkGroup.group

  return (
    <Layout location={location} subtitle={description} title={title}>
      <h1>Thank you for subscribing</h1>
      <p>
        Your email is now confirmed! I'll keep you in the loop as I create new
        content.
      </p>
      <p>In the mean time... may I interest you in a blog post by tag?</p>
      <ul className="tags">
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

export default SubscribedPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
    allMarkdownRemarkGroup: allMarkdownRemark(
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
