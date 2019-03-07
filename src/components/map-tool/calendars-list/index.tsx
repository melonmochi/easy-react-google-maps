import React, { FunctionComponent, useState, useContext, useEffect } from 'react';
import { Card, Select, Switch } from 'antd';
import { GlobalContext } from 'src/components/global-context';
import { CalendarInfo, Calendars, CalendarDates, SelectedCalInfo } from 'typings';
import { CalendarChart } from './utils';
const Option = Select.Option;

export const CalendarsList: FunctionComponent = () => {
  const { state } = useContext(GlobalContext);
  const { selectedGTFS } = state;

  const [calInfo, setCalInfo] = useState<CalendarInfo>({
    calendar: undefined,
    calendar_dates: undefined,
  });
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [selectedCalInfo, setSelectedCalInfo] = useState<SelectedCalInfo>({
    selectedCal: undefined,
    selectedCaldates: undefined,
  });
  const [calChartexpand, setCalChartExpand] = useState<boolean>(false);

  const toggle = () => {
    setCalChartExpand(!calChartexpand);
  };

  const setDefaultkey = () => {
    const { calendar, calendar_dates } = calInfo;
    const defaultKey =
      calendar && calendar.length > 0
        ? calendar[0].service_id
        : calendar_dates && calendar_dates.length > 0
        ? calendar_dates[0].service_id
        : '';
    setSelectedKey(defaultKey);
  };

  const handleChangeCalendar = (key: string) => {
    setSelectedKey(key);
  };

  useEffect(() => {
    if (selectedGTFS) {
      const { calendar, calendar_dates } = selectedGTFS;
      setCalInfo({ calendar, calendar_dates });
    }
  }, [selectedGTFS]);

  useEffect(() => {
    const { calendar, calendar_dates } = calInfo;
    if (calendar || calendar_dates) {
      setDefaultkey();
    }
  }, [calInfo]);

  useEffect(() => {
    setSelectedCalInfo(selectCalInfo(selectedKey));
  }, [selectedKey]);

  const calendarKeysList = (cal?: Calendars, calDates?: CalendarDates) => {
    const calKeys = cal ? cal.map(c => c.service_id) : [];
    const calDatesKeys = calDates ? calDates.map(cd => cd.service_id) : [];
    return [...new Set(calKeys.concat(calDatesKeys))];
  };

  const calendarsOptions = () => {
    const { calendar, calendar_dates } = calInfo;
    if (calendar || calendar_dates) {
      const calKeysList = calendarKeysList(calendar, calendar_dates);
      return calKeysList.map((k: string) => <Option key={k}>{k}</Option>);
    } else {
      return null;
    }
  };

  const selectCalInfo = (key: string) => {
    const { calendar, calendar_dates } = calInfo;
    const selectedCal = calendar ? calendar.filter(c => c.service_id === key)[0] : undefined;
    const selectedCalDates = calendar_dates
      ? calendar_dates.filter(cd => cd.service_id === key)
      : undefined;
    return {
      selectedCal: selectedCal,
      selectedCaldates: selectedCalDates,
    } as SelectedCalInfo;
  };

  return (
    <Card bordered={false} bodyStyle={{ padding: '10px' }}>
      <div style={{ display: 'flex' }}>
        <Select
          showSearch
          style={{ width: 214, marginRight: 6 }}
          onChange={handleChangeCalendar}
          disabled={!calInfo.calendar && !calInfo.calendar_dates}
          value={selectedKey}
        >
          {calendarsOptions()}
        </Select>
        <Switch
          style={{ alignSelf: 'center' }}
          checkedChildren="Off"
          unCheckedChildren="On"
          onChange={toggle}
        />
      </div>
      <div style={{ display: 'flex', marginTop: '6px' }}>
        {calChartexpand ? (
          <CalendarChart selectedCalInfo={selectedCalInfo} selectedKey={selectedKey} />
        ) : null}
      </div>
    </Card>
  );
};
