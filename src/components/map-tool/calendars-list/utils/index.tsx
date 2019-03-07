import React, { FunctionComponent, CSSProperties } from 'react';
import { Card, Tooltip, DatePicker, Tag } from 'antd';
import moment from 'moment';
import { dateFormat, weekDay, camelCase } from 'utils';
import { Calendar, CalendarDate, SelectedCalInfo } from 'typings';
const { RangePicker } = DatePicker;
import { extendMoment } from 'moment-range';
import '../style';

type CalentarChartProps = {
  selectedKey: string;
  selectedCalInfo: SelectedCalInfo;
};

const isSelectedDate = (date: moment.Moment, disableDays: string[]) => {
  const dateString = date.format('YYYYMMDD');
  return !disableDays.includes(dateString);
};

export const CalendarChart: FunctionComponent<CalentarChartProps> = props => {
  const { selectedKey, selectedCalInfo } = props;
  const { selectedCal } = selectedCalInfo;
  const dates = calculateDates(selectedCalInfo);
  const { firstDay, lastDay, days, disabledDays } = dates;

  const disabledDate = (current: moment.Moment) => {
    return days ? !days.includes(current.format('YYYYMMDD')) : false;
  };

  const dateRender = (current: moment.Moment) => {
    const style: CSSProperties = {};
    const isSelect = disabledDays ? isSelectedDate(current, disabledDays) : true;
    if (disabledDate(current) === false) {
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

  return (
    <Card bordered={false} bodyStyle={{ marginTop: 6, padding: 0 }}>
      <Tooltip title={`Range of dates`}>
        <RangePicker
          value={[moment(firstDay, dateFormat), moment(lastDay, dateFormat)]}
          dateRender={dateRender}
          allowClear={false}
          style={{ width: 'auto' }}
          format="YYYY-MM-DD"
          disabled={!days}
          disabledDate={disabledDate}
          // ranges={{"defaultRange": [moment(firstDay, dateFormat), moment(lastDay, dateFormat)]}}
          renderExtraFooter={() => selectedKey}
        />
      </Tooltip>
      {selectedCal ? (
        <Card bordered={false} bodyStyle={{ marginTop: 6, padding: 0 }}>
          {Object.keys(selectedCal)
            .filter((key: keyof Calendar) => weekDay.includes(key))
            .map((wd: keyof Calendar) => {
              const ifAvailable = selectedCal[wd] === '1' ? true : false;
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
                  <Tag style={{ marginRight: 3 }} color={ifAvailable ? 'blue' : 'red'}>
                    {camelCase(wd.substring(0, 3))}
                  </Tag>
                </Tooltip>
              );
            })}
        </Card>
      ) : null}
    </Card>
  );
};

const calculateDates = (calInfo: SelectedCalInfo) => {
  const days = calculateDays(calInfo);
  const disabledDays = calculateDisabledDays(calInfo);
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

const calculateDays = (calInfo: SelectedCalInfo) => {
  const { selectedCal, selectedCaldates } = calInfo;
  const daysFromCalendar = selectedCal ? calculateDaysFromCalendar(selectedCal).days : [];
  const daysFromCalendarDates = selectedCaldates
    ? calculateDaysFromCalendarDates(selectedCaldates).days
    : [];
  const days = [...new Set([...daysFromCalendar, ...daysFromCalendarDates])];
  return days;
};

const calculateDisabledDays = (calInfo: SelectedCalInfo) => {
  const { selectedCal, selectedCaldates } = calInfo;
  const disabledDaysFromCalendar = selectedCal
    ? calculateDaysFromCalendar(selectedCal).disabledDays
    : [];
  const disabledDaysFromCalendarDates = selectedCaldates
    ? calculateDaysFromCalendarDates(selectedCaldates).disabledDays
    : [];
  const disabledDays = [
    ...new Set([
      ...disabledDaysFromCalendar.filter((d: string) => !disabledDaysFromCalendarDates.includes(d)),
      ...disabledDaysFromCalendarDates,
    ]),
  ];
  return disabledDays;
};

const Moment = extendMoment(moment as any);

const calculateDaysFromCalendar = (calendar: Calendar) => {
  const calNumber = calendarInNumber(calendar);
  const startDate = moment(calendar.start_date, dateFormat);
  const endDate = moment(calendar.end_date, dateFormat);
  const daysArray = Array.from(Moment.range(startDate, endDate).by('days'));
  const disabledDays = [] as string[];
  const days = daysArray.map((d: moment.Moment) => {
    const isDisabled = calNumber[d.isoWeekday()] === '0';
    if (isDisabled) {
      disabledDays.push(d.format('YYYYMMDD'));
    }
    return d.format('YYYYMMDD');
  });
  return { days: days, disabledDays: disabledDays };
};

const calendarInNumber = (calendar: Calendar) => {
  return Object.keys(calendar)
    .filter(k => weekDay.includes(k))
    .reduce((obj: any, d) => {
      switch (d) {
        case 'monday': {
          obj['1'] = calendar[d];
          break;
        }
        case 'tuesday': {
          obj['2'] = calendar[d];
          break;
        }
        case 'wednesday': {
          obj['3'] = calendar[d];
          break;
        }
        case 'thursday': {
          obj['4'] = calendar[d];
          break;
        }
        case 'friday': {
          obj['5'] = calendar[d];
          break;
        }
        case 'saturday': {
          obj['6'] = calendar[d];
          break;
        }
        case 'sunday': {
          obj['7'] = calendar[d];
          break;
        }
        default: {
          break;
        }
      }
      return obj;
    }, {});
};

const calculateDaysFromCalendarDates = (calendarDates: CalendarDate[]) => {
  const disabledDays = [] as string[];
  const days = calendarDates.map((cd: CalendarDate) => {
    const isDisabled = cd.exception_type === '2';
    if (isDisabled) {
      disabledDays.push(cd.date);
    }
    return cd.date;
  });
  return { days: days, disabledDays: disabledDays };
};
