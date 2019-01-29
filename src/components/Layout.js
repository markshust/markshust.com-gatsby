import React from 'react'
import { Link } from 'gatsby'
import Avatar from '../components/Avatar'
import { rhythm, scale } from '../utils/typography'
import githubIcon from '../../content/assets/github-icon.png'
import twitterIcon from '../../content/assets/twitter-icon.png'

class Layout extends React.Component {
  render() {
    const { location, subtitle, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <>
          <h1
            style={{
              ...scale(1.5),
              marginBottom: rhythm(0.5),
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
          </h1>
          <h2
            style={{
              fontFamily: `Montserrat, sans-serif`,
              marginTop: 0,
              fontWeight: 200,
              fontSize: rhythm(1.5),
            }}
            className="subtitle"
          >
            {subtitle}
          </h2>
        </>
      )
    } else {
      header = (
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          <div style={{ display: 'flex' }}>
            <div style={{ width: 'auto' }}>
              <Avatar />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: `Montserrat, sans-serif`,
                  fontWeight: 900,
                  fontSize: rhythm(0.825),
                  marginTop: 0,
                  marginBottom: rhythm(0.25),
                  lineHeight: 1.1,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontFamily: `Montserrat, sans-serif`,
                  marginTop: 0,
                  fontWeight: 400,
                  textTransform: 'none',
                  lineHeight: 1.1,
                }}
                className="subtitle"
              >
                {subtitle}
              </div>
            </div>
          </div>
        </Link>
      )
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(36),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
        className="main-content"
      >
        <div className="header">
          {header}
        </div>
        {children}
        <hr style={{ marginTop: rhythm(2), marginBottom: rhythm(1) }} />
        <footer style={{ display: 'flex' }}>
          <div style={{ flex: 2 }} className="left">
            <span>© 1985-{new Date().getFullYear()}</span> <span>Mark O. Shust</span> <span>&mdash;{' '}
            <Link to={`/about`}>About</Link>
            {' '}&mdash;{' '}
            <a data-formkit-toggle="55e59119df" href="https://pages.convertkit.com/55e59119df/343250d763">Newsletter</a>
            </span>
          </div>
          <div style={{ flex: 1, textAlign: 'right', display: 'flex' }} className="right">
            <div style={{ flex: 1, textAlign: 'right' }}>
              <a
                href="https://github.com/markoshust"
                target="_blank"
                style={{ boxShadow: 'none' }}
              >
                <img src={githubIcon} style={{ maxWidth: 50, maxHeight: 25 }} />
              </a>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <a
                href="https://twitter.com/markoshust"
                target="_blank"
                style={{ boxShadow: 'none' }}
              >
                <img
                  src={twitterIcon}
                  style={{ maxWidth: 50, maxHeight: 25 }}
                />
              </a>
            </div>
            <div style={{ flex: 3 }}>
              <a href="mailto:mark@shust.com">mark@shust.com</a>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}

export default Layout
