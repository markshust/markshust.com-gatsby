import React from 'react'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'
import Spacer from '../components/Spacer'

const ConfirmedPage = ({ data, location }) => {
  const { title, description } = data.site.siteMetadata

  return (
    <Layout location={location} subtitle={description} title={title}>
      <h1>Preferences Confirmed</h1>
      <p>
        Thanks! I updated your newsletter preferences and saved them to your
        profile.
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
          src="https://giphy.com/embed/vgwdcBACc7FdRUfqDy"
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

export default ConfirmedPage

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
