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
  width: 250px;
  height: 375px;
  @media only screen and (max-width: 768px) {
    width: 180px;
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
            <StyledImage src={markshustPhoto} alt="Mark Shust" />
          </div>
          <div>
            <p>
              Mark Shust is a Certified Magento Developer & Architect with
              extended knowledge of PHP, JavaScript, Laravel, React, Docker, and
              user interface design. He has nearly 20 years of web development
              experience in the eCommerce, real estate, business-to-business,
              and information technology industries. Mark is a Zend Certified
              Engineer, a Magento Certified Developer Plus, a Magento 2
              Certified Solution Specialist, and a Magento 2 Certified Associate
              Developer, and has a wide knowledge range of other open source
              software and tech stacks.
            </p>
            <p>
              Mark is married to his wonderful wife Juliann, and they are the
              proud parents of twin girls Lily Ann and Brielle. Mark lives in
              Northest Ohio, and is a devout Cleveland Browns fan, loves eating
              Chipotle burritos, playing scrabble and solving Rubix cubes. Mark
              loves geek-inspired technology, and enjoys living a simplistic
              lifestyle.
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
