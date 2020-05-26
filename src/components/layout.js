import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"

import { rhythm } from "@utils/typography"
import Image from "gatsby-image"

import styled from "styled-components"
import markshustPhoto from "@assets/mark-640x960.jpg"

const MainHeader = styled.h1`
  margin-bottom: ${rhythm(0.5)};
  margin-top: 0;
  @media only screen and (min-width: 769px) {
    font-size: ${rhythm(2)};
  }
`

const SubHeader = styled.h1`
  margin-top: ${rhythm(0.5)};
  font-size: ${rhythm(1)};
  width: 100%;
  @media only screen and (min-width: 769px) {
    margin-top: 0;
    font-size: ${rhythm(1.25)};
  }
`

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 280px auto;
  @media only screen and (max-width: 768px) {
    grid-template-columns: auto;
  }
`

const Footer = styled.footer`
  padding: ${rhythm(2)} 0 ${rhythm(1)};
  display: grid;
  grid-template-columns: auto 200px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: auto;
    text-align: center;
    max-width: 200px;
    margin: 0 auto;
  }
`

const StyledImage = styled.img`
  float: left;
  margin-bottom: 0;
  @media only screen and (max-width: 768px) {
    max-width: 180px;
    max-height: 270px;
  }
`

const Flex = styled.div`
  display: flex;
  width: 200px;
  margin: 0;
  @media only screen and (max-width: 768px) {
    margin: ${rhythm(1)} auto 0;
  }
`

const Flex1 = styled.div`
  flex: 1;
  text-align: center;
`

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
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
            <MainHeader>
              <Link
                style={{
                  boxShadow: `none`,
                  textDecoration: `none`,
                  color: `inherit`,
                }}
                to={`/`}
              >
                {title}
              </Link>
            </MainHeader>
            <SubHeader>
              Certified Magento Developer, Architect &amp; Teacher in Cleveland,
              Ohio
            </SubHeader>
            <p>
              Hi there! My name is Mark, and this is my tiny little home on the
              internet.
            </p>
            <p
              style={{
                marginBottom: 0,
              }}
            >
              I've been a computer programmer for roughly 20 years, and love my
              home town of Cleveland, Ohio. The focus of my career has revolved
              around PHP and eCommerce, and more specifically the Magento
              eCommerce framework.
            </p>
          </div>
        </Wrapper>
      )
    } else if (location.pathname.match(/\//g).length === 5) {
      header = null
    } else {
      header = (
        <h3
          style={{
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h3>
      )
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(36),
          padding: `${rhythm(1.5)} ${rhythm(1)}`,
          background: `rgba(255, 255, 255, 1)`,
        }}
      >
        {header && <header>{header}</header>}
        <main>{children}</main>
        <Footer>
          <div>
            Mark Shust &copy; 1985-{new Date().getFullYear()}{" "}
            {location.pathname !== "/" && (
              <>
                <span className="hide-mobile"> &nbsp;&middot;&nbsp; </span>
                <a href="/">Home</a>{" "}
              </>
            )}
            {location.pathname !== "/about" && (
              <>
                <span> &nbsp;&middot;&nbsp; </span>
                <a href="/about">About</a>
              </>
            )}
            <span> &nbsp;&middot;&nbsp; </span>
            <a href="mailto:mark@shust.com">Email</a>
          </div>
          <StaticQuery
            query={layoutQuery}
            render={data => (
              <Flex>
                <Flex1>
                  <a
                    href="https://github.com/markshust"
                    target="_blank"
                    style={{ boxShadow: "none" }}
                    rel="noopener noreferrer"
                  >
                    <Image
                      fixed={data.githubIcon.childImageSharp.fixed}
                      alt="GitHub"
                    />
                  </a>
                </Flex1>
                <Flex1>
                  <a
                    href="https://twitter.com/markshust"
                    target="_blank"
                    style={{ boxShadow: "none" }}
                    rel="noopener noreferrer"
                  >
                    <Image
                      fixed={data.twitterIcon.childImageSharp.fixed}
                      alt="Twitter"
                    />
                  </a>
                </Flex1>
                <Flex1>
                  <a
                    href="/rss.xml"
                    target="_blank"
                    style={{ boxShadow: "none" }}
                    rel="noopener noreferrer"
                  >
                    <Image
                      fixed={data.rssIcon.childImageSharp.fixed}
                      alt="RSS"
                    />
                  </a>
                </Flex1>
              </Flex>
            )}
          />
        </Footer>
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
