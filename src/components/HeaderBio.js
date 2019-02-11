import React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'
import Bio from './Bio'
import { rhythm } from '../utils/typography'

const Title = styled.div`
  color: #1f2933;
  font-family: Ubuntu, sans-serif;
  font-size: 1.5rem;
  margin: ${rhythm(0.25)} 0 0;
`

const Subtitle = styled.div`
  color: #1f2933;
  font-family: Ubuntu, sans-serif;
  font-size: 1.1rem;
  margin-top: -${rhythm(0.25)};
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

function HeaderBio() {
  return (
    <StaticQuery
      query={headerBioQuery}
      render={data => {
        const { title, description } = data.site.siteMetadata
        return (
          <StyledLink to={`/`}>
            <Bio style={{ paddingTop: rhythm(0.5) }}>
              <div>
                <Title>{title}</Title>
                <Subtitle>{description}</Subtitle>
              </div>
            </Bio>
          </StyledLink>
        )
      }}
    />
  )
}

const headerBioQuery = graphql`
  query HeaderBioQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`

export default HeaderBio
