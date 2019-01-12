import React from 'react'
import { Link, graphql } from 'gatsby'
import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'

class BlogsTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteSubtitle = this.props.data.site.siteMetadata.description
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} subtitle={siteSubtitle} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.excerpt} keywords={post.frontmatter.tags} />
        <h1>{post.frontmatter.title}</h1>
        <time
          style={{
            ...scale(1 / 5),
            display: `block`,
            marginBottom: rhythm(1.5),
            marginTop: rhythm(-0.5),
            color: '#aaa'
          }}
          dateTime={post.frontmatter.date}
        >
          {post.frontmatter.date}
        </time>
        <div className="main-content" dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr style={{ marginBottom: rhythm(1) }} />
        <ul>
        {post.frontmatter.tags.map(tag => (
          <li style={{ listStyle: 'none', display: 'inline', margin: rhythm(1) }} key={tag}>
            <Link to={`/tags/${tag}/`}>#{tag}</Link>
          </li>
        ))}
        </ul>
        <hr style={{ marginBottom: rhythm(1) }} />
        <Bio />
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li style={{ flex: 1, paddingRight: '1em' }}>
            {previous && (
              <>
                <strong>Previous Post:</strong><br />
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              </>
            )}
          </li>
          <li style={{ flex: 1, paddingLeft: '1em', textAlign: 'right' }}>
            {next && (
              <>
                <strong>Next Post:</strong><br />
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              </>
            )}
          </li>
        </ul>
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
    }
  }
`
