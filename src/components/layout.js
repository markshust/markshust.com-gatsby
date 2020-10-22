import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import markshustAvatar from "@assets/markshust-avatar.jpg"

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.pathname = null
  }
  componentDidMount() {
    this.pathname = window.location.pathname ?? ""
    this.forceUpdate()
  }
  render() {
    const { children } = this.props
    let header = (
      <div className="flex py-4 lg:py-8">
        {this.pathname !== "/" && (
          <Link to="/" className="flex justify-center items-center">
            <img
              className="rounded-full h-24 w-24 lg:h-16 lg:w-16 mb-0 ml-8 lg:ml-0"
              src={markshustAvatar}
              alt="Mark Shust"
            />
            <div className="p-4 text-2xl lg:text-lg flex justify-center items-center tracking-tight font-extrabold text-gray-900">
              Mark Shust
            </div>
          </Link>
        )}
        <nav
          className={
            this.pathname === "/"
              ? "items-center grid lg:flex mx-auto text-center"
              : "items-center grid lg:flex ml-6 justify-left"
          }
        >
          <Link className="px-2 py-1 mx-2" to="/blog">
            Blog
          </Link>
          <a
            className="px-2 py-1 mx-2"
            href="https://m.academy"
            target="_blank"
            rel="noreferrer"
          >
            Courses
          </a>
          <a
            className="px-2 py-1 mx-2"
            href="https://github.com/markshust"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="px-2 py-1 mx-2"
            href="https://www.youtube.com/channel/UC3MdXXeF48RN-mqMkJlGn0Q"
            target="_blank"
            rel="noreferrer"
          >
            YouTube
          </a>
          <Link className="px-2 py-1 mx-2" to="/about">
            About
          </Link>
          <a className="px-2 py-1 mx-2" href="mailto:mark@shust.com">
            Contact
          </a>
        </nav>
      </div>
    )

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <header>{header}</header>
        <main>{children}</main>
        <footer className="grid grid-cols-1 lg:grid-cols-2 py-8 text-center lg:text-left">
          <div className="pb-4 lg:pb-0">
            Mark Shust &copy; 1985-{new Date().getFullYear()}{" "}
          </div>
          <StaticQuery
            query={layoutQuery}
            render={data => (
              <div className="grid grid-cols-3">
                <a
                  href="https://twitter.com/MarkShust"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 mx-4 text-center"
                >
                  <Image
                    fixed={data.twitterIcon.childImageSharp.fixed}
                    alt="Twitter"
                  />
                </a>
                <a
                  href="https://www.linkedin.com/in/MarkShust/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 mx-4 text-center"
                >
                  <Image
                    fixed={data.linkedinIcon.childImageSharp.fixed}
                    alt="LinkedIn"
                  />
                </a>
                <Link
                  to="/rss.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 mx-4 text-center"
                >
                  <Image fixed={data.rssIcon.childImageSharp.fixed} alt="RSS" />
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
    linkedinIcon: file(absolutePath: { regex: "/linkedin-icon.png/" }) {
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
