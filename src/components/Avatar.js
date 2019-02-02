import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import styled from 'styled-components'

const RoundedImage = styled(Image)`
  border-radius: 25px;
`

function Avatar() {
  return (
    <StaticQuery
      query={avatarQuery}
      render={data => {
        const { author } = data.site.siteMetadata
        return (
          <RoundedImage
            fixed={data.avatar.childImageSharp.fixed}
            alt={author}
          />
        )
      }}
    />
  )
}

const avatarQuery = graphql`
  query AvatarQuery {
    avatar: file(absolutePath: { regex: "/avatar.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
      }
    }
  }
`

export default Avatar
