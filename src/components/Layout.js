import React from 'react'
import { Link } from 'gatsby'
import Avatar from '../components/Avatar'
import { rhythm, scale } from '../utils/typography'
import githubCat from '../../content/assets/github-cat.png';

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
          <h2 style={{
              fontFamily: `Montserrat, sans-serif`,
              marginTop: 0,
              fontWeight: 200,
              fontSize: rhythm(1.5),
            }}>{subtitle}</h2>
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
              <h3
                style={{
                  fontFamily: `Montserrat, sans-serif`,
                  marginTop: 0,
                  marginBottom: rhythm(0.25),
                }}
              >
                {title}
              </h3>
              <h4 
                style={{
                  fontFamily: `Montserrat, sans-serif`,
                  marginTop: 0,
                  fontWeight: 400,
                  textTransform: 'none',
                  letterSpacing: rhythm(0.05),
                }}>{subtitle}</h4>
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
      >
        {header}
        {children}
        <hr style={{ marginTop: rhythm(2), marginBottom: rhythm(1) }} />
        <footer style={{ display: 'flex' }}>
          <div style={{ flex: 2 }}>© 1985-{new Date().getFullYear()} Mark O. Shust</div>
          <div style={{ flex: 1, textAlign: 'right', display: 'flex' }}>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <a href="https://github.com/markoshust" target="_blank" style={{ boxShadow: 'none' }}><img src={githubCat} style={{ maxWidth: 50 }} /></a>
            </div>
            <a href="mailto:mark@shust.com" style={{ flex: 1, boxShadow: 'none' }}>mark@shust.com</a>
          </div>
        </footer>
      </div>
    )
  }
}

export default Layout
