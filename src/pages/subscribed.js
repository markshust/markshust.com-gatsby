import React from "react"
import Layout from "@components/layout"
import { Link, graphql } from "gatsby"
import kebabCase from "lodash/kebabCase"

const SubscribedPage = ({ data, location }) => {
  const { title, description } = data.site.siteMetadata
  const group = data.allMarkdownRemarkGroup.group

  return (
    <Layout location={location} subtitle={description} title={title}>
        <h1 className="mb-8 py-8 text-3xl text-center font-extrabold tracking-tight text-gray-900 sm:text-5xl pb-4">Thank you for subscribing</h1>
        <p className="text-gray-700 prose-lg mb-4">
            Your email is now confirmed! I'll keep you in the loop as I create new
            content.
        </p>
    <p className="text-gray-700 prose-lg mb-10">
        In the mean time... may I interest you in a blog post?
    </p>
      <ul className="tags mb-12">
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
