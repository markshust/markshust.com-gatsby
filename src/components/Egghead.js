import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import styled from 'styled-components'
import { rhythm } from '../utils/typography'

const Wrapper = styled.div`
  padding: ${rhythm(2.5)} ${rhythm(0.5)} ${rhythm(1.5)};
  background: #bae3ff;
  margin: -${rhythm(0.5)} -${rhythm(3 / 4)} 0;
  text-align: center;
`

const Title = styled.div`
  font-size: 2em;
  font-family: Ubuntu, sans-serif;
`

function Egghead() {
  return (
    <Wrapper>
      <a
        href="https://egghead.io/courses/build-a-twelve-factor-node-js-app-with-docker"
        target="_blank"
      >
        <StaticQuery
          query={eggheadQuery}
          render={data => {
            return (
              <Image
                fixed={data.egghead.childImageSharp.fixed}
                alt="Build a 12-Factor Node.js App with Docker"
              />
            )
          }}
        />
        <div>Watch my latest screencast course now:</div>
        <Title>Build a Twelve-Factor Node.js App with Docker</Title>
      </a>
    </Wrapper>
  )
}

const eggheadQuery = graphql`
  query EggheadQuery {
    egghead: file(absolutePath: { regex: "/12factor-nodejs-app-docker.png/" }) {
      childImageSharp {
        fixed(width: 280, height: 280) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

export default Egghead
