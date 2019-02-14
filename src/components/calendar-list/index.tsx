import React from 'react';
import { Card, Select, Row, Switch } from 'antd';
import { Calendar, CalendarDate } from 'typings';
import CalendarInfo from './calendar-info';
import moment from 'moment';
import { calculateDaysFromCalendar } from './calculateDaysFromCalendar';
import { calculateDaysFromCalendarDates } from './calculateDaysFromCalendarDates';

export type CalendarInfoType = {
  calendar?: Calendar[];
  calendar_dates?: CalendarDate[];
};

interface CalendarListProps {
  calendarInfo: CalendarInfoType;
}

interface CalendarListState {
  onSelectCalendarKey?: string;
  calInfoExpand?: boolean;
}

const Option = Select.Option;

const dateFormat = 'YYYYMMDD';

const setDefaultkey = (calendarInfo: CalendarInfoType) => {
  const { calendar, calendar_dates } = calendarInfo;

  return calendar
    ? calendar[0].service_id
    : calendar_dates
    ? calendar_dates[0].service_id
    : undefined;
};

export default class CalendarList extends React.Component<CalendarListProps, CalendarListState> {
  state = {
    onSelectCalendarKey: setDefaultkey(this.props.calendarInfo),
    calInfoExpand: false,
  };

  handleChangeCalendar = (value: string) => {
    this.setState({
      onSelectCalendarKey: value,
    });
  };

  onSelectCalendar = (key?: string) => {
    const { calendar } = this.props.calendarInfo;
    return calendar ? calendar.filter((c: Calendar) => c.service_id === key)[0] : undefined;
  };

  calendarList = (calendarInfo: CalendarInfoType) => {
    const { calendar, calendar_dates } = calendarInfo;

    const calKeysList = this.setCalendarKeysList(calendar, calendar_dates);
    return calKeysList.map((k: string) => <Option key={k}>{k}</Option>);
  };

  calendarData = (key?: string) => {
    const { calendarInfo } = this.props;
    const { calendar, calendar_dates } = calendarInfo;
    const cal = calendar ? calendar.filter(c => c.service_id === key)[0] : undefined;
    const filtered = calendar_dates
      ? calendar_dates.filter(cd => cd.service_id === key)
      : undefined;

    const daysFromCalendar = cal ? calculateDaysFromCalendar(cal).days : [];
    const daysFromCalendarDates = filtered ? calculateDaysFromCalendarDates(filtered).days : [];
    const disabledDaysFromCalendar = cal ? calculateDaysFromCalendar(cal).disabledDays : [];
    const disabledDaysFromCalendarDates = filtered
      ? calculateDaysFromCalendarDates(filtered).disabledDays
      : [];

    const days = [...new Set([...daysFromCalendar, ...daysFromCalendarDates])];
    const disabledDays = [
      ...new Set([
        ...disabledDaysFromCalendar.filter(
          (d: string) => !disabledDaysFromCalendarDates.includes(d)
        ),
        ...disabledDaysFromCalendarDates,
      ]),
    ];
    const enabledDays = days.filter((d: string) => !disabledDays.includes(d));

    const selectDates = enabledDays.map(d => moment(d, dateFormat));
    const firstDay = moment.min(selectDates).format('YYYYMMDD');
    const lastDay = moment.max(selectDates).format('YYYYMMDD');

    return {
      days: days,
      enabledDays: enabledDays,
      disabledDays: disabledDays,
      firstDay: firstDay,
      lastDay: lastDay,
    };
  };

  toggle = () => {
    const { calInfoExpand } = this.state;
    this.setState({ calInfoExpand: !calInfoExpand });
  };

  setCalendarKeysList = (cal?: Calendar[], calDates?: CalendarDate[]) => {
    const calKeys = cal ? cal.map(i => i.service_id) : [];
    const calDatesKeys = calDates ? calDates.map(j => j.service_id) : [];
    return [...new Set(calKeys.concat(calDatesKeys))];
  };

  render() {
    const { calendarInfo } = this.props;
    const { onSelectCalendarKey, calInfoExpand } = this.state;

    const key = onSelectCalendarKey ? onSelectCalendarKey : setDefaultkey(calendarInfo);

    const onSelectCalendar = this.onSelectCalendar(key);

    const calendarList = this.calendarList(calendarInfo);

    const calInfo = this.calendarData(key);

    return (
      <Card bordered={false} bodyStyle={{ margin: 6, padding: 0 }}>
        <Row
          gutter={{ md: 24, lg: 36, xl: 48 }}
          type="flex"
          align="middle"
          justify="start"
          style={{ marginLeft: 0, marginRight: 0 }}
        >
          <Select
            showSearch
            style={{ width: 214, marginRight: 6 }}
            placeholder="Calendar"
            optionFilterProp="children"
            onChange={this.handleChangeCalendar}
            filterOption={(input, option) =>
              option.props.children && typeof option.props.children === 'string'
                ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : null
            }
            disabled={!calendarList}
            value={key}
          >
            {calendarList}
          </Select>
          <Switch checkedChildren="Off" unCheckedChildren="On" onChange={this.toggle} />
        </Row>
        <Row
          gutter={{ md: 24, lg: 36, xl: 48 }}
          type="flex"
          align="middle"
          justify="center"
          style={{ marginLeft: 0, marginRight: 0 }}
        >
          {calInfoExpand && calInfo ? (
            <CalendarInfo
              onLoadedCalendar={onSelectCalendar}
              calInfo={calInfo}
              onSelectCalendarKey={onSelectCalendarKey}
            />
          ) : null}
        </Row>
      </Card>
    );
  }
}
