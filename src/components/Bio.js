import React from 'react'
import Avatar from './Avatar'
import styled from 'styled-components'
import { rhythm } from '../utils/typography'

const BioWrapper = styled.div`
  display: flex;
  padding-top: ${rhythm(1)};
`

const AvatarWrapper = styled.div`
  padding-right: ${rhythm(0.5)};
`

function Bio({ style = {}, children }) {
  return (
    <BioWrapper>
      <AvatarWrapper style={style}>
        <Avatar />
      </AvatarWrapper>
      {children}
    </BioWrapper>
  )
}

export default Bio
