import React from 'react'
import Avatar from './Avatar'
import styled from 'styled-components'
import { rhythm } from '../utils/typography'

const BioWrapper = styled.div`
  display: flex;
  padding-bottom: ${rhythm(1)};
  gap: ${rhythm(0.5)};
`

const AvatarWrapper = styled.div`
  width: 50px;
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
