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
          datetime={post.frontmatter.date}
        >
          {post.frontmatter.date}
        </time>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr style={{ marginBottom: rhythm(1) }} />
        <ul>
        {post.frontmatter.tags.map(tag => (
          <li style={{ listStyle: 'none', display: 'inline', margin: rhythm(1) }}>
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
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
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
