import React from 'react'
import Banner from './Banner'
import styled from 'styled-components'
import { StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import { rhythm } from '../utils/typography'

const Dev = styled.div`
  font-size: 1.5rem;
  color: #e6f6ff;
  margin-bottom: 10px;
  @media only screen and (max-width: 768px) {
    font-size: 1.4rem;
  }
`

const Flex = styled.div`
  display: flex;
  @media only screen and (max-width: 768px) {
    display: block;
  }
`

const LeftCol = styled.div`
  width: 240;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`

const RightCol = styled.div`
  flex: 1;
`

const Text = styled.div`
  line-height: auto;
  color: #e6f6ff;
  text-align: left;
  opacity: 0.8;
  padding: 10px 30px;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`

const DockerMagento = ({ data }) => (
  <StaticQuery
    query={dockerMagentoQuery}
    render={data => (
      <Banner>
        <Dev>Setup a Magento 2 Development Environment with Docker</Dev>
        <Flex>
          <LeftCol>
            <a
              href="https://learnm2.com/p/setup-magento-2-development-environment-docker"
              target="_blank"
            >
              <Image
                fixed={data.course.childImageSharp.fixed}
                alt="Setup a Magento 2 Development Environment with Docker"
              />
            </a>
          </LeftCol>
          <RightCol>
            <Text>
              Standardize development environments across your team with the
              easiest way to install and manage configuration for just about any
              Magento project.
            </Text>
            <a
              href="https://learnm2.com/p/setup-magento-2-development-environment-docker"
              target="_blank"
              className="button"
            >
              Free Course! Enroll Now
            </a>
          </RightCol>
        </Flex>
      </Banner>
    )}
  />
)

export default DockerMagento

const dockerMagentoQuery = graphql`
  query DockerMagentoQuery {
    course: file(
      absolutePath: {
        regex: "/setup-a-magento-2-development-environment-with-docker.png/"
      }
    ) {
      childImageSharp {
        fixed(width: 180, height: 128) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
