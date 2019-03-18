import React from 'react'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'
import Spacer from '../components/Spacer'
import Newsletter from '../components/Newsletter'
import SEO from '../components/seo'

const NewsletterPage = ({ data, location }) => {
  const { title, description } = data.site.siteMetadata

  return (
    <Layout location={location} subtitle={description} title={title}>
      <SEO
        title="Mark Shust's Magento Newsletter"
        overrideTitle
        description={description}
        keywords={[`magento`, `magento newsletter`, `mark shust`]}
      />
      <Spacer />
      <Newsletter />
      <Spacer />
      <Spacer />
    </Layout>
  )
}

export default NewsletterPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`
