import React from "react"
import Layout from "@components/layout"
import { graphql } from "gatsby"

const SubscribedPage = ({ data, location }) => {
  const { title, description } = data.site.siteMetadata

  return (
    <Layout location={location} subtitle={description} title={title}>
        <h1 className="mb-8 py-8 text-3xl text-center font-extrabold tracking-tight text-gray-900 sm:text-5xl pb-4">Preferences confirmed</h1>
        <p className="text-gray-700 prose-lg mb-4">
            Thanks! I updated your newsletter preferences and saved them to your profile.
        </p>
      <div
        style={{
          width: "100%",
          height: 0,
          paddingBottom: "42%",
          position: "relative",
        }}
        className="mb-12"
      >
        <iframe
          src="https://giphy.com/embed/JDYE3DpqrW6mQ"
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
