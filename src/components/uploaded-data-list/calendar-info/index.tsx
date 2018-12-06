import React, { CSSProperties } from 'react'
import { Card, DatePicker, Tag, Form } from 'antd'
import { Calendar, CalendarDates } from 'typings'
import moment from 'moment';

interface CalendarInfoProps {
  onLoadedCalendar: Calendar,
  onLoadedCalendarDates?: CalendarDates
}

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

const dateFormat = 'YYYYMMDD';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export default class CalendarInfo extends React.PureComponent<CalendarInfoProps, any> {

  disabledDate = (current: moment.Moment) => {
    const { onLoadedCalendar } = this.props
    const start = moment(onLoadedCalendar.start_date, dateFormat)
    const end = moment(onLoadedCalendar.end_date, dateFormat)
    // Setting can not select days
    return current < start || current > end;
  }

  disabledDateTime = () => {
    return {
      disabledHours: () => range(0, 24).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }

  dateRender = (current: moment.Moment) => {
    const { onLoadedCalendar, onLoadedCalendarDates} = this.props
    const style: CSSProperties = {};
    const weekDay = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const isValidDate = (date: moment.Moment, calendar: Calendar, calendarDates?: any ) => {
      const weekday = date.isoWeekday()
      const calendarInNumber =
        Object.keys(calendar)
          .filter(k => weekDay.includes(k))
          .reduce((obj: any, d) => {
            switch (d) {
              case 'monday': {
                obj['1'] = calendar[d]
                break;
              }
              case 'tuesday': {
                obj['2'] = calendar[d]
                break;
              }
              case 'wednesday': {
                obj['3'] = calendar[d]
                break;
              }
              case 'thursday': {
                obj['4'] = calendar[d]
                break;
              }
              case 'friday': {
                obj['5'] = calendar[d]
                break;
              }
              case 'saturday': {
                obj['6'] = calendar[d]
                break;
              }
              case 'sunday': {
                obj['7'] = calendar[d]
                break;
              }
              default: {
                break;
              }
            }
            return obj
          }, {})
      const isAdded = calendarDates?
        Object.keys(calendarDates)
          .filter( k => calendarDates[k].date === date.format('YYYYMMDD'))
          .map( k => {
            // tslint:disable-next-line:no-console
            console.log('im in isAdded .map, dates are:', moment(calendarDates[k].date, dateFormat), date)
            return calendarDates[k].exception_type === '1'
          })
        : undefined
      if(isAdded && isAdded.length>0) {
        return isAdded[0]
      } else {
        return calendarInNumber[weekday] === '1'
      }
    }

    if(onLoadedCalendar && this.disabledDate(current)===false) {
      const isValid = onLoadedCalendarDates?
        isValidDate(current, onLoadedCalendar, onLoadedCalendarDates):
        isValidDate(current, onLoadedCalendar)
      if(isValid) {
        style.border = '1px solid #1890ff';
        style.borderRadius = '50%';
      } else {
        style.border = '1px solid #f50';
        style.borderRadius = '50%';
      }
    }
    return (
      <div className="ant-calendar-date" style={style}>
        {current.date()}
      </div>
    );
  }

  render() {
    const { onLoadedCalendar } = this.props
    // tslint:disable-next-line:no-console
    console.log(this.props)
    return (
      <Card
        bordered={false}
        bodyStyle={{ padding: 0 }}
      >
        <Form>
          <FormItem
            label="From"
            {...formItemLayout}
            style={{ marginBottom: 0, marginTop: 4 }}
          >
            <DatePicker
              dateRender={this.dateRender}
              allowClear={false}
              style={{ width: 'auto' }}
              format="YYYY-MM-DD"
              disabledDate={this.disabledDate}
              disabledTime={this.disabledDateTime}
              defaultValue={moment(onLoadedCalendar.start_date, dateFormat)}
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            />
          </FormItem>
          <FormItem
            label="To"
            {...formItemLayout}
            style={{ marginBottom: 4, marginTop: 4 }}
          >
            <DatePicker
              dateRender={this.dateRender}
              allowClear={false}
              style={{ width: 'auto' }}
              format="YYYY-MM-DD"
              disabledDate={this.disabledDate}
              disabledTime={this.disabledDateTime}
              defaultValue={moment(onLoadedCalendar.end_date, dateFormat)}
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            />
          </FormItem>
        </Form>
        <Tag style={{ marginRight: 4 }} color={onLoadedCalendar.monday === "1" ? "blue" : "red"}>Mon</Tag>
        <Tag style={{ marginRight: 4 }} color={onLoadedCalendar.tuesday === "1" ? "blue" : "red"}>Tue</Tag>
        <Tag style={{ marginRight: 4 }} color={onLoadedCalendar.wednesday === "1" ? "blue" : "red"}>Wed</Tag>
        <Tag style={{ marginRight: 4 }} color={onLoadedCalendar.thursday === "1" ? "blue" : "red"}>Thu</Tag>
        <Tag style={{ marginRight: 4 }} color={onLoadedCalendar.friday === "1" ? "blue" : "red"}>Fri</Tag>
        <Tag style={{ marginRight: 4 }} color={onLoadedCalendar.saturday === "1" ? "blue" : "red"}>Sat</Tag>
        <Tag style={{ marginRight: 4 }} color={onLoadedCalendar.sunday === "1" ? "blue" : "red"}>Sun</Tag>
      </Card>
    )
  }
}
