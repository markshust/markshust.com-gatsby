import React from 'react'
import { StaticQuery } from 'gatsby'
import Avatar from './Avatar'
import { rhythm } from '../utils/typography'
import image from '../../content/assets/12factor-nodejs-app-docker.png'

function Egghead() {
  return (
    <div
      style={{
        padding: `${rhythm(2.5)} ${rhythm(0.5)} ${rhythm(1.5)}`,
        background: '#BAE3FF',
        margin: `-${rhythm(1.5)} -${rhythm(3 / 4)} ${rhythm(1.5)}`,
        textAlign: 'center',
      }}
    >
      <a
        href="https://egghead.io/courses/build-a-twelve-factor-node-js-app-with-docker"
        target="_blank"
      >
        <img src={image} style={{ maxWidth: '30%' }} />
        <div>Watch my latest screencast course now:</div>
        <div style={{ fontSize: rhythm(1) }}>
          Build a Twelve-Factor Node.js App with Docker
        </div>
      </a>
    </div>
  )
}

export default Egghead
