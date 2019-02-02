import React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import MainContent from './MainContent'
import HomeHeader from './HomeHeader'
import TopBanner from './TopBanner'
import styled from 'styled-components'
import Line from './Line'
import { rhythm } from '../utils/typography'
import HeaderBio from './HeaderBio'
import Spacer from './Spacer'

const SignupLink = styled.a`
  color: #fff;
`

const Flex = styled.div`
  display: flex;
  width: 200px;
  margin: 0 auto;
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
  margin: ${rhythm(2)} 0;
  list-style: none;
  text-align: center;
`

class Layout extends React.Component {
  render() {
    const { location, subtitle, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <HomeHeader>
          <h1>{title}</h1>
          <h3 className="subtitle">{subtitle}</h3>
        </HomeHeader>
      )
    } else {
      header = (
        <>
          <Spacer />
          <HeaderBio />
        </>
      )
    }

    return (
      <MainContent>
        <TopBanner>
          Free online course!{' '}
          <strong>Setup a Magento Development Environment with Docker</strong>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Coming Soon &nbsp;&middot;&nbsp;{' '}
          <SignupLink href="https://learnm2.com" target="_blank">
            Signup Now
          </SignupLink>
        </TopBanner>
        {header}
        {children}
        <Line />
        <footer>
          <LinkList>
            <li>
              <Link to={`/`}>Home</Link>
            </li>
            <li>
              <Link to={`/about`}>About</Link>
            </li>
            <li>
              <a
                data-formkit-toggle="55e59119df"
                href="https://pages.convertkit.com/55e59119df/343250d763"
              >
                Newsletter
              </a>
            </li>
          </LinkList>
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
          <Copyright>
            <div>
              © 1985-{new Date().getFullYear()} Mark Shust &nbsp;&middot;&nbsp;{' '}
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
            </div>
            <div>
              <a href="mailto:mark@shust.com">mark@shust.com</a>
            </div>
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
