import React from 'react'
import Banner from './Banner'
import styled from 'styled-components'
import { rhythm } from '../utils/typography'

const SignupLink = styled.a`
  background: #5cb70b;
  border: 0;
  border-radius: 25px;
  padding: ${rhythm(0.35)} ${rhythm(0.75)};
  color: #fff;
  font-weight: bold;
  text-decoration: none;
  &:hover {
    color: #0967d2;
  }
  cursor: pointer;
  display: inline-block;
  margin-top: 6px;
  @media only screen and (max-width: 768px) {
    display: block;
    max-width: 300px;
    margin: 6px auto 0;
  }
`

const Dev = styled.div`
  font-size: 1.5rem;
`

const DockerMagento = () => (
  <Banner>
    <Dev>Are you a Magento developer?</Dev>
    Free online course!{' '}
    <strong>Setup a Magento 2 Development Environment with Docker</strong>{' '}
    &nbsp;&nbsp;&nbsp;&nbsp;
    <SignupLink href="https://learnm2.com" target="_blank">
      Learn More
    </SignupLink>
  </Banner>
)

export default DockerMagento
