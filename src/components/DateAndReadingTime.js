import React from 'react'
import Time from '../components/Time'
import ReadingTime from '../components/ReadingTime'

export default function({ date, readingTime }) {
  return (
    <Time dateTime={date}>
      {date} &nbsp;&nbsp;&middot;&nbsp;&nbsp;{' '}
      <ReadingTime>{readingTime}</ReadingTime>
    </Time>
  )
}
