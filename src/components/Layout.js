import React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import MainContent from './MainContent'
import HomeHeader from './HomeHeader'
import styled from 'styled-components'
import Line from './Line'
import { rhythm } from '../utils/typography'
import HeaderBio from './HeaderBio'
import Spacer from './Spacer'

const Flex = styled.div`
  display: flex;
  width: 200px;
  margin: ${rhythm(1)} auto 0;
`

const Flex1 = styled.div`
  flex: 1;
  text-align: center;
`

const Copyright = styled.div`
  text-align: center;
  padding: ${rhythm(2)} 0;
  font-size: 0.9rem;
  color: #616e7c;
`

const LinkList = styled.ul`
  margin: ${rhythm(2)} auto 0;
  text-align: center;
`

const LinkListItem = styled.li`
  display: inline;
  padding-left: ${rhythm(1)};
`

const Middot = styled.span`
  padding: 0 0.5rem;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`

const Certifications = styled.span`
  @media only screen and (max-width: 768px) {
    display: block;
  }
`

const Email = styled.div`
  margin-top: 1rem;
`

class Layout extends React.Component {
  render() {
    const { location, subtitle, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <HomeHeader>
          <h1>Mark Shust</h1>
          <h3 className="subtitle">{subtitle}</h3>
        </HomeHeader>
      )
    } else {
      header = (
        <>
          <HeaderBio />
          <Spacer />
        </>
      )
    }

    return (
      <MainContent>
        {header}
        {children}
        <Line />
        <footer>
          <LinkList>
            <LinkListItem>
              <Link to={`/`}>Home</Link>
            </LinkListItem>
            <LinkListItem>
              <Link to={`/tags`}>Tags</Link>
            </LinkListItem>
            <LinkListItem>
              <Link to={`/about`}>About</Link>
            </LinkListItem>
            <LinkListItem>
              <Link to={`/newsletter`}>Newsletter</Link>
            </LinkListItem>
          </LinkList>
          <Copyright>
            <div>
              © 1985-{new Date().getFullYear()} Mark Shust
              <Middot>&middot;</Middot>
              <Certifications>
                <a
                  href="http://www.zend.com/en/yellow-pages/ZEND014633"
                  target="_blank"
                >
                  ZCE
                </a>
                ,{' '}
                <a
                  href="https://u.magento.com/certification/directory/dev/883/"
                  target="_blank"
                >
                  MCD+
                </a>
                ,{' '}
                <a
                  href="https://u.magento.com/certification/directory/dev/883/"
                  target="_blank"
                >
                  M2CSS
                </a>
                ,{' '}
                <a
                  href="https://u.magento.com/certification/directory/dev/883/"
                  target="_blank"
                >
                  M2CAD
                </a>
              </Certifications>
            </div>
            <StaticQuery
              query={layoutQuery}
              render={data => (
                <Flex>
                  <Flex1>
                    <a href="https://github.com/markshust" target="_blank">
                      <Image
                        fixed={data.githubIcon.childImageSharp.fixed}
                        alt="GitHub"
                      />
                    </a>
                  </Flex1>
                  <Flex1>
                    <a href="https://twitter.com/markshust" target="_blank">
                      <Image
                        fixed={data.twitterIcon.childImageSharp.fixed}
                        alt="Twitter"
                      />
                    </a>
                  </Flex1>
                  <Flex1>
                    <a href="/rss.xml" target="_blank">
                      <Image
                        fixed={data.rssIcon.childImageSharp.fixed}
                        alt="RSS"
                      />
                    </a>
                  </Flex1>
                </Flex>
              )}
            />
            <Email>
              <a href="mailto:mark@shust.com">mark@shust.com</a>
            </Email>
          </Copyright>
        </footer>
      </MainContent>
    )
  }
}

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

export default Layout
