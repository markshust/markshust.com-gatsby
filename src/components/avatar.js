import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { rhythm } from "@utils/typography"

const Avatar = () => {
  const data = useStaticQuery(graphql`
    query AvatarQuery {
      avatar: file(absolutePath: { regex: "/profile-400x400.jpg/" }) {
        childImageSharp {
          fixed(width: 100, height: 100) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  return (
    <Image
      fixed={data.avatar.childImageSharp.fixed}
      alt="Mark Shust"
      style={{
        marginRight: rhythm(1 / 2),
        marginBottom: 0,
        minWidth: 100,
        borderRadius: `100%`,
      }}
      imgStyle={{
        borderRadius: `50%`,
      }}
    />
  )
}

export default Avatar
