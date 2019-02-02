import styled from 'styled-components'
import { rhythm } from '../utils/typography'

export default styled.div`
  background: ${props => props.odd && '#E6F6FF'};
  padding: ${rhythm(0.75)} ${rhythm(0.75)} ${rhythm(0.25)};
  margin: 0 -${rhythm(0.75)};
`
