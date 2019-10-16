import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"

const SubscribedPage = ({ data, location }) => {
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
          width: "100%",
          height: 0,
          paddingBottom: "42%",
          position: "relative",
        }}
      >
        <iframe
          src="https://giphy.com/embed/vgwdcBACc7FdRUfqDy"
          width="100%"
          height="100%"
          style={{ position: "absolute" }}
          frameBorder="0"
          className="giphy-embed"
          allowFullScreen
          title="Giphy"
        />
      </div>
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
