import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import Layout from '../components/Layout'

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
      <h1>About</h1>
      <StaticQuery
        query={pageQuery}
        render={data1 => (
          <Image
            fixed={data1.markshustPhoto.childImageSharp.fixed}
            alt="Mark Shust"
            style={{ float: 'left' }}
          />
        )}
      />
      <p>
        Mark Shust is a certified Magento developer & architect with extended
        knowledge of PHP, JavaScript, Laravel, React, Docker, and user interface
        design. He has over 15 years of web development experience in the
        eCommerce, real estate, business-to-business, and information technology
        industries. Mark is Magento Certified Developer Plus and a Zend
        Certified Engineer, and has a wide knowledge range of LAMP server
        management and open source software.
      </p>
      <p>
        Mark is married to his wonderful wife Juliann, and they are the proud
        parents of twin girls Lily Ann and Brielle. Mark lives in Northest Ohio,
        and is a devout Cleveland Browns fan, loves eating Chipotle burritos,
        playing scrabble and solving Rubix cubes. Mark loves geek-inspired
        technology, and enjoys living a simplistic lifestyle.
      </p>
    </Layout>
  )
}

export default AboutPage

export const pageQuery = graphql`
  query PageQuery {
    markshustPhoto: file(absolutePath: { regex: "/markshust-photo-1.png/" }) {
      childImageSharp {
        fixed(width: 350, height: 350) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`
