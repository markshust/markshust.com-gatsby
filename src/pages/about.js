import React from "react"
import { graphql } from "gatsby"

import Layout from "@components/layout"
import SEO from "@components/seo"
import styled from "styled-components"
import markshustPhoto from "@assets/markshust-photo-1-sm.jpg"

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 280px auto;
  @media only screen and (max-width: 768px) {
    grid-template-columns: auto;
  }
`

const StyledImage = styled.img`
  float: left;
  @media only screen and (max-width: 768px) {
    max-width: 180px;
    max-height: 270px;
  }
`

class AboutPage extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="About" />
        <h1>About</h1>
        <Wrapper>
          <div>
            <StyledImage
              src={markshustPhoto}
              alt="Mark Shust"
              width="250"
              height="375"
            />
          </div>
          <div>
            <p>
              I've been a Magento Developer for nearly a decade, and have 20
              years of web development experience in the eCommerce, real estate,
              business-to-business, and information technology industries. I
              have extended depth of PHP, JavaScript, React, Docker & Laravel,
              as well as a breadth of knowledge of other open source software.
            </p>
            <p>
              I'm married to my wonderful wife Juliann, and we are the proud
              parents of twin girls Lily and Brielle. I live in Northeast Ohio
              and love eating chipotle burritos, solving Rubik's cubes, driving
              my 240sx and watching Cleveland Browns games.
            </p>
          </div>
        </Wrapper>
        <h2>Certifications</h2>
        <p>
          I hold a few certifications revolving around my focus of PHP and
          Magento:
        </p>
        <ul>
          <li>
            <a
              href="https://www.zend-zce.com/en/yellow-pages/ZEND014633"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zend Certified Engineer (PHP5)
            </a>
            <br />
            <em>(July 2010)</em>
          </li>
          <li>
            <a
              href="https://u.magento.com/certification/directory/dev/883/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Magento 1 Certified Developer Plus
            </a>
            <br />
            <em>(March 2012)</em>
          </li>
          <li>
            <a
              href="https://u.magento.com/certification/directory/dev/883/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Magento 2 Certified Solution Specialist
            </a>
            <br />
            <em>(February 2019)</em>
          </li>
          <li>
            <a
              href="https://u.magento.com/certification/directory/dev/883/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Magento 2 Certified Associate Developer
            </a>
            <br />
            <em>(April 2019)</em>
          </li>
        </ul>
      </Layout>
    )
  }
}

export default AboutPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
