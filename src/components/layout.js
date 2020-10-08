import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import markshustAvatar from "@assets/markshust-avatar.jpg"

class Layout extends React.Component {
  render() {
    const { children } = this.props
    let header = (
      <div className="flex py-8">
          <Link to="/" className="flex justify-center items-center">
              <img
                  className="rounded-full h-16 w-16 mb-0 ml-8 lg:ml-0"
                  src={markshustAvatar}
                  alt="Mark Shust"
              />
              <div className="p-4 text-lg flex justify-center items-center tracking-tight font-extrabold text-gray-900">Mark Shust</div>
          </Link>
          <nav className="ml-6 justify-left items-center grid lg:flex">
              <Link className="px-2 py-1 mx-4" to="/blog">Blog</Link>
              <Link className="px-2 py-1 mx-4" to="/about">About</Link>
              <a className="px-2 py-1 mx-4" href="https://m.academy" target="_blank" rel="noreferrer">Courses</a>
              <a className="px-2 py-1 mx-4" href="mailto:mark@shust.com">Contact</a>
          </nav>
      </div>
  )

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
            <header>{header}</header>
            <main>{children}</main>
            <footer className="grid grid-cols-1 lg:grid-cols-2 py-8 text-center lg:text-left">
              <div className="py-4 lg:py-0">
                Mark Shust &copy; 1985-{new Date().getFullYear()}{" "}
              </div>
              <StaticQuery
                query={layoutQuery}
                render={data => (
                    <div className="grid grid-cols-3">
                      <a
                        href="https://github.com/markshust"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 mx-4 text-center"
                      >
                        <Image
                          fixed={data.githubIcon.childImageSharp.fixed}
                          alt="GitHub"
                        />
                      </a>
                      <a
                        href="https://twitter.com/markshust"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 mx-4 text-center"
                      >
                        <Image
                          fixed={data.twitterIcon.childImageSharp.fixed}
                          alt="Twitter"
                        />
                      </a>
                      <Link
                        to="/rss.xml"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 mx-4 text-center"
                      >
                        <Image
                          fixed={data.rssIcon.childImageSharp.fixed}
                          alt="RSS"
                        />
                      </Link>
                    </div>
                )}
              />
            </footer>
        </div>
    )
  }
}

export default Layout

const layoutQuery = graphql`
  query LayoutQuery {
    githubIcon: file(absolutePath: { regex: "/github-icon.png/" }) {
      childImageSharp {
        fixed(width: 25, height: 25) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    twitterIcon: file(absolutePath: { regex: "/twitter-icon.png/" }) {
      childImageSharp {
        fixed(width: 25, height: 25) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    rssIcon: file(absolutePath: { regex: "/rss-icon.png/" }) {
      childImageSharp {
        fixed(width: 22, height: 22) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
