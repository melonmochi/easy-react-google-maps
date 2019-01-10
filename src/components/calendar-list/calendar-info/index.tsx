import React, { CSSProperties } from 'react';
import { Card, DatePicker, Tag, Form } from 'antd';
import { Calendar } from 'typings';
import moment from 'moment';
import { camelCase } from 'utils';

interface CalendarInfoProps {
  onLoadedCalendar?: Calendar;
  calInfo: {
    days: string[];
    enabledDays: string[];
    disabledDays: string[];
    firstDay: string;
    lastDay: string;
  };
}

const weekDay = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dateFormat = 'YYYYMMDD';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const isSelectDate = (date: moment.Moment, disableDays: string[]) => {
  const dateString = date.format('YYYYMMDD');
  return !disableDays.includes(dateString);
};

export default class CalendarInfo extends React.Component<CalendarInfoProps> {
  disabledDate = (current: moment.Moment) => {
    const { calInfo } = this.props;
    const { days } = calInfo;
    return days ? !days.includes(current.format('YYYYMMDD')) : false;
  };

  dateRender = (current: moment.Moment) => {
    const { calInfo } = this.props;
    const { disabledDays } = calInfo;
    const style: CSSProperties = {};

    const isSelect = disabledDays ? isSelectDate(current, disabledDays) : true;

    if (this.disabledDate(current) === false) {
      if (isSelect) {
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
  };

  render() {
    const { calInfo, onLoadedCalendar } = this.props;
    const { days, firstDay, lastDay } = calInfo;

    return (
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Form>
          <FormItem label="From" {...formItemLayout} style={{ marginBottom: 0, marginTop: 4 }}>
            <DatePicker
              dateRender={this.dateRender}
              allowClear={false}
              style={{ width: 'auto' }}
              format="YYYY-MM-DD"
              disabled={!days}
              disabledDate={this.disabledDate}
              defaultValue={moment(firstDay, dateFormat)}
            />
          </FormItem>
          <FormItem label="To" {...formItemLayout} style={{ marginBottom: 4, marginTop: 4 }}>
            <DatePicker
              dateRender={this.dateRender}
              allowClear={false}
              style={{ width: 'auto' }}
              format="YYYY-MM-DD"
              disabled={!days}
              disabledDate={this.disabledDate}
              defaultValue={moment(lastDay, dateFormat)}
            />
          </FormItem>
        </Form>
        {onLoadedCalendar ? (
          <div>
            {Object.keys(onLoadedCalendar)
              .filter((key: keyof Calendar) => weekDay.includes(key))
              .map((wd: keyof Calendar) => (
                <Tag
                  key={wd}
                  style={{ marginRight: 4 }}
                  color={onLoadedCalendar[wd] === '1' ? 'blue' : 'red'}
                >
                  {camelCase(wd.substring(0, 3))}
                </Tag>
              ))}
          </div>
        ) : null}
      </Card>
    );
  }
}
