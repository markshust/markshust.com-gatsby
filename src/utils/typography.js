import Typography from 'typography'
import { MOBILE_MEDIA_QUERY } from 'typography-breakpoint-constants'

const typography = new Typography({
  baseFontSize: '16px',
  baseLineHeight: 1.7,
  bodyFontFamily: ['Merriweather', 'serif'],
  googleFonts: [
    {
      name: 'Ubuntu',
      styles: ['400', '700'],
    },
    {
      name: 'Merriweather',
      styles: ['400'],
    },
  ],
  headerWeight: 700,
  headerFontFamily: ['Ubuntu', 'sans-serif'],
  overrideStyles: ({ adjustFontSizeTo, scale, rhythm }, options) => ({
    body: {
      color: '#1F2933',
    },
    h1: {
      fontSize: '3rem',
    },
    h2: {
      fontSize: '2rem',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 400,
    },
    a: {
      color: '#0967D2',
    },
    'a:hover,a:active': {
      color: '#5CB70B',
    },
    [MOBILE_MEDIA_QUERY]: {
      html: {
        fontSize: `${(15 / 16) * 100}%`,
        lineHeight: 1.6,
      },
      h1: {
        fontSize: '2rem',
      },
      h2: {
        fontSize: '1.5rem',
      },
    },
  }),
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
