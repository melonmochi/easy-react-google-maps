import React from 'react'
import { Card, DatePicker } from 'antd'
import { Calendar } from 'typings'
import moment from 'moment';

interface CalendarInfoProps {
  onLoadedCalendar: Calendar,
}

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

const disabledDate = (current: moment.Moment) => {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

const disabledDateTime = () => {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  };
}

export default class CalendarInfo extends React.PureComponent<CalendarInfoProps, any> {
  render() {
    // const { onLoadedCalendar } = this.props
    return (
      <Card
        bordered={false}
      >
        <div>
          <DatePicker
            style={{width:150}}
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          />
          <DatePicker
          style={{width:150}}
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          />
        </div>
      </Card>
    )
  }
}
