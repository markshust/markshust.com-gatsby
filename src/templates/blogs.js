import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import Egghead from '../components/Egghead'
import Newsletter from '../components/Newsletter'
import SummaryBio from '../components/SummaryBio'
import Spacer from '../components/Spacer'
import styled from 'styled-components'
import { rhythm } from '../utils/typography'
import DateAndReadingTime from '../components/DateAndReadingTime'
import DockerMagento from '../components/DockerMagento'

const TagList = styled.ul`
  list-style: none;
  margin: 0 -${rhythm(0.75)} ${rhythm(0.75)};
  padding: ${rhythm(1)};
  background: #f5f7fa;
`

const TagListItem = styled.li`
  display: inline-block;
  padding: ${rhythm(0.5)} ${rhythm(0.5)} 0;
`

const UnorderedList = styled.ul`
  display: flex;
  list-style: none;
  margin-left: 0;
  gap: ${rhythm(1)};
  margin: ${rhythm(0.75)} 0;
`

const ListItem = styled.li`
  padding: ${rhythm(0.25)} 0;
  margin-bottom: 0;
  flex: 1;
`

class BlogsTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteSubtitle = this.props.data.site.siteMetadata.description
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext
    let isDocker = false
    let isMagento = false
    let isNodejs = false

    post.frontmatter.tags.map(tag => {
      if (tag === 'docker') {
        isDocker = true
      }
      if (tag === 'nodejs') {
        isNodejs = true
      }
      if (tag === 'magento' || tag === 'magento1' || tag === 'magento2') {
        isMagento = true
      }
    })

    return (
      <Layout
        location={this.props.location}
        subtitle={siteSubtitle}
        title={siteTitle}
      >
        <SEO
          title={post.frontmatter.title}
          description={post.excerpt}
          keywords={post.frontmatter.tags}
        />
        {isMagento && <DockerMagento />}
        <h1>{post.frontmatter.title}</h1>
        <DateAndReadingTime
          date={post.frontmatter.date}
          readingTime={post.fields.readingTime.text}
        />
        <Spacer />
        <div
          className="main-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <TagList>
          {post.frontmatter.tags.map(tag => (
            <TagListItem key={tag}>
              <Link to={`/tags/${tag}/`}>#{tag}</Link>
            </TagListItem>
          ))}
        </TagList>
        <SummaryBio />
        <Spacer />
        {isDocker || isNodejs ? <Egghead /> : <Newsletter />}
        <Spacer />
        <UnorderedList>
          <ListItem>
            {previous && (
              <>
                <strong>Previous Post:</strong>
                <br />
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              </>
            )}
          </ListItem>
          <ListItem style={{ textAlign: 'right' }}>
            {next && (
              <>
                <strong>Next Post:</strong>
                <br />
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              </>
            )}
          </ListItem>
        </UnorderedList>
      </Layout>
    )
  }
}

export default BlogsTemplate

export const pageQuery = graphql`
  query BlogBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
      }
      fields {
        readingTime {
          text
        }
      }
    }
  }
`
