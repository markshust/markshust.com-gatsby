import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'
import Bio from './Bio'

const AvatarText = styled.p`
  color: #7b8794;
`

const AvatarLink = styled.a`
  color: #7b8794;
`

function SummaryBio() {
  return (
    <StaticQuery
      query={summaryBioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <Bio>
            <AvatarText>
              Written by <strong>{author}</strong>, a Certified Magento
              Developer & Architect in Cleveland, Ohio.
              <br />
              <AvatarLink href={`https://twitter.com/${social.twitter}`}>
                Follow me @{social.twitter}
              </AvatarLink>
            </AvatarText>
          </Bio>
        )
      }}
    />
  )
}

const summaryBioQuery = graphql`
  query SummaryBioQuery {
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

export default SummaryBio
