import React, { CSSProperties } from 'react';
import { Card, DatePicker, Tag, Tooltip } from 'antd';
import { Calendar } from 'typings';
import moment from 'moment';
import { camelCase } from 'utils';
import './style';

interface CalendarInfoProps {
  onLoadedCalendar?: Calendar;
  onSelectCalendarKey?: string;
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
const { RangePicker } = DatePicker;

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
        // style.borderRadius = '50%';
      } else {
        style.border = '1px solid #f50';
        // style.borderRadius = '50%';
      }
    }

    return (
      <div className="ant-calendar-date" style={style}>
        {current.date()}
      </div>
    );
  };

  render() {
    const { calInfo, onLoadedCalendar, onSelectCalendarKey } = this.props;
    const { days, firstDay, lastDay } = calInfo;

    return (
      <Card bordered={false} bodyStyle={{ marginTop: 6, padding: 0 }}>
        <Tooltip title={`Range of dates`}>
          <RangePicker
            value={[moment(firstDay, dateFormat), moment(lastDay, dateFormat)]}
            dateRender={this.dateRender}
            allowClear={false}
            style={{ width: 'auto' }}
            format="YYYY-MM-DD"
            disabled={!days}
            disabledDate={this.disabledDate}
            // ranges={{"defaultRange": [moment(firstDay, dateFormat), moment(lastDay, dateFormat)]}}
            renderExtraFooter={() => (onSelectCalendarKey ? onSelectCalendarKey : null)}
          />
        </Tooltip>
        {onLoadedCalendar ? (
          <Card bordered={false} bodyStyle={{ marginTop: 6, padding: 0 }}>
            {Object.keys(onLoadedCalendar)
              .filter((key: keyof Calendar) => weekDay.includes(key))
              .map((wd: keyof Calendar) => {
                const ifAvailable = onLoadedCalendar[wd] === '1' ? true : false;
                const ifAvailableMessage = ifAvailable ? 'available' : 'not available';
                return (
                  <Tooltip
                    title={
                      wd.charAt(0).toUpperCase() +
                      wd.substr(1) +
                      `s is ${ifAvailableMessage} for this calendar`
                    }
                    key={wd}
                  >
                    <Tag style={{ marginRight: 4 }} color={ifAvailable ? 'blue' : 'red'}>
                      {camelCase(wd.substring(0, 3))}
                    </Tag>
                  </Tooltip>
                );
              })}
          </Card>
        ) : null}
      </Card>
    );
  }
}
