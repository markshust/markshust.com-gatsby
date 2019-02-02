import styled from 'styled-components'
import { rhythm } from '../utils/typography'

export default styled.div`
  background: #0967d2;
  padding: ${rhythm(0.25)};
  margin: 0 -${rhythm(0.75)};
  font-size: 0.9rem;
  text-align: center;
  color: #fff;
  font-family: Ubuntu, sans-serif;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  @media only screen and (max-width:980px) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`
