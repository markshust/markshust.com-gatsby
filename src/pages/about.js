import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import markshustPhoto from '../../content/assets/markshust-photo-1.jpg'
import SEO from '../components/seo'
import styled from 'styled-components'

const Wrapper = styled.div`
display: grid;
grid-template-columns: 280px auto;
@media only screen and (max-width: 768px) {
  grid-template-columns: auto;
}
`;

const StyledImage = styled.img`
  float: left;
  max-width: 250px;
  max-height: 375px;
`;

const AboutPage = ({
  data: {
    site: {
      siteMetadata: { title, description },
    },
  },
  location,
}) => {
  return (
    <Layout location={location} subtitle={description} title={title}>
      <SEO
        title="About Mark Shust"
        overrideTitle
        description={description}
        keywords={[
          `magento`,
          `magento 2`,
          `php`,
          `javascript`,
          `laravel`,
          `react`,
          `reactjs`,
          `docker`,
          `mark shust`,
        ]}
      />
      <h1>About</h1>
      <Wrapper>
        <div>
          <StyledImage src={markshustPhoto} alt="Mark Shust" />
        </div>
        <div>
          <p>
            Mark Shust is a Certified Magento Developer & Architect with extended
            knowledge of PHP, JavaScript, Laravel, React, Docker, and user interface
            design. He has nearly 20 years of web development experience in the
            eCommerce, real estate, business-to-business, and information technology
            industries. Mark is a Zend Certified Engineer, a Magento Certified
            Developer Plus, a Magento 2 Certified Solution Specialist, and a Magento
            2 Certified Associate Developer, and has a wide knowledge range of other
            open source software and tech stacks.
          </p>
          <p>
            Mark is married to his wonderful wife Juliann, and they are the proud
            parents of twin girls Lily Ann and Brielle. Mark lives in Northest Ohio,
            and is a devout Cleveland Browns fan, loves eating Chipotle burritos,
            playing scrabble and solving Rubix cubes. Mark loves geek-inspired
            technology, and enjoys living a simplistic lifestyle.
          </p>
        </div>
      </Wrapper>
    </Layout>
  )
}

export default AboutPage

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
