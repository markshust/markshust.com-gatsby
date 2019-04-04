import React from 'react'
import { Link, graphql } from 'gatsby'
import Image from 'gatsby-image'
import SummaryBio from '../components/SummaryBio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import kebabCase from 'lodash/kebabCase'
import Line from '../components/Line'
import BlogTitle from '../components/BlogTitle'
import BlogWrapper from '../components/BlogWrapper'
import styled from 'styled-components'
import { rhythm } from '../utils/typography'
import Spacer from '../components/Spacer'
import DateAndReadingTime from '../components/DateAndReadingTime'

const MostRecent = styled.div`
  margin: ${rhythm(0.75)} 0;
  font-size: 1.5rem;
`

const UnorderedList = styled.ul`
  margin: 0 -${rhythm(0.5)};
`

const ListItem = styled.li`
  display: inline-block;
  padding: 0 ${rhythm(0.5)};
`

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteSubtitle = data.site.siteMetadata.description
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemarkEdges.edges
    const group = data.allMarkdownRemarkGroup.group
    let postCount = 0

    return (
      <Layout
        location={this.props.location}
        subtitle={siteSubtitle}
        title={siteTitle}
      >
        <SEO
          title="Mark Shust - Certified Magento Developer &amp; Architect in Cleveland, OH"
          overrideTitle
          description={siteSubtitle}
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
        <Line />
        <SummaryBio />
        <MostRecent>Most recent course:</MostRecent>
        <BlogWrapper odd={true}>
          <BlogTitle>
            <a
              href="https://courses.markshust.com/p/setup-magento-2-development-environment-docker"
              target="_blank"
            >
              <Image
                fixed={data.course.childImageSharp.fixed}
                alt="Setup a Magento 2 Development Environment with Docker"
              />
              <br />
              Setup a Magento 2 Development Environment with Docker
            </a>
          </BlogTitle>
        </BlogWrapper>
        <Spacer />
        <Spacer />
        <MostRecent>Most recent blog posts:</MostRecent>
        {posts.map(({ node }) => {
          postCount++
          const title = node.frontmatter.title || node.fields.slug
          return (
            <BlogWrapper key={node.fields.slug} odd={postCount % 2}>
              <BlogTitle>
                <Link to={node.fields.slug}>{title}</Link>
              </BlogTitle>
              <DateAndReadingTime
                date={node.frontmatter.date}
                readingTime={node.fields.readingTime.text}
              />
              <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
            </BlogWrapper>
          )
        })}
        <Spacer />
        <MostRecent>Browse all blog posts by tag:</MostRecent>
        <UnorderedList>
          {group.map(tag => (
            <ListItem
              key={tag.fieldValue}
              style={{
                fontSize:
                  tag.totalCount > 7
                    ? '2em'
                    : tag.totalCount > 2
                    ? '1.5em'
                    : '1em',
              }}
            >
              <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                #{tag.fieldValue} ({tag.totalCount})
              </Link>
            </ListItem>
          ))}
        </UnorderedList>
        <Spacer />
        <Spacer />
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemarkEdges: allMarkdownRemark(
      limit: 10
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
            readingTime {
              text
            }
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            tags
          }
        }
      }
    }
    allMarkdownRemarkGroup: allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
    course: file(
      absolutePath: {
        regex: "/setup-a-magento-2-development-environment-with-docker.png/"
      }
    ) {
      childImageSharp {
        fixed(width: 360, height: 256) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
