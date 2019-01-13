import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Avatar from './Avatar'

import { rhythm } from '../utils/typography'

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <div
            style={{
              display: `flex`,
              marginBottom: rhythm(2.5),
              lineHeight: rhythm(0.9),
            }}
          >
            <Avatar />
            <p>
              Written by <strong>{author}</strong>, a Magento Certified
              Developer & Architect in Cleveland, Ohio.
              <br />
              <a href={`https://twitter.com/${social.twitter}`}>
                Follow me on Twitter @{social.twitter}
              </a>
            </p>
          </div>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

export default Bio
