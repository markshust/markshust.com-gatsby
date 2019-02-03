import React from 'react'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'
import Spacer from '../components/Spacer'

const SubscribedPage = ({ data, location }) => {
  const { title, description } = data.site.siteMetadata

  return (
    <Layout location={location} subtitle={description} title={title}>
      <h1>Check your email</h1>
      <p>
        Thank you for signing up! Please confirm your email address to continue.
      </p>
      <div
        style={{
          width: '100%',
          height: 0,
          paddingBottom: '42%',
          position: 'relative',
        }}
      >
        <iframe
          src="https://giphy.com/embed/Qh6NZWsFx1G1O"
          width="100%"
          height="100%"
          style={{ position: 'absolute' }}
          frameBorder="0"
          className="giphy-embed"
          allowFullScreen
        />
      </div>
      <Spacer />
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
  }
`
