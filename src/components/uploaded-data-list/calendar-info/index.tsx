import React from 'react'
import { Carousel, Card } from 'antd'
// import { Calendar } from 'typings'

interface CalendarInfoProps {
  onLoadedCalendar?: any,
}

export default class CalendarInfo extends React.PureComponent<CalendarInfoProps, any> {
  render() {
    const { onLoadedCalendar } = this.props
    return (
      <Carousel>
        <Card style={{ width: 300 }}>
          <p>service_id: {onLoadedCalendar? onLoadedCalendar.service_id: null}</p>
        </Card>,
      </Carousel>
    )
  }
}
