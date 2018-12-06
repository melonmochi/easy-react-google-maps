import React from 'react'
import { Card, Select, Row, Switch } from 'antd'
import { GTFSFile, Calendar, CalendarDates } from 'typings'
import CalendarInfo from './calendar-info';

interface UploadedDataListProps {
  onLoadedData: GTFSFile,
}

interface UploadedDataListState {
  onSelectCalendarKey?: string,
  onSelectCalendar?: Calendar,
  onSelectCalendarDates?: CalendarDates
  calInfoExpand?: boolean
}

const Option = Select.Option;

export default class UploadedDataList extends React.PureComponent<UploadedDataListProps, UploadedDataListState> {
  constructor(props: UploadedDataListProps) {
    super(props)

    this.state = {
      onSelectCalendar: undefined,
      onSelectCalendarDates: undefined,
      onSelectCalendarKey: undefined,
      calInfoExpand: false,
    }
  }

  setCalendar = (key: string, cal: Calendar, caldates: any) => {
    const filtered = caldates ? Object.keys(caldates)
      .filter(k => caldates[k].service_id === cal.service_id)
      .reduce((obj: any, k) => {
        obj[k] = caldates[k];
        return obj
      }, {}) : undefined
    this.setState({
      onSelectCalendarKey: key,
      onSelectCalendar: cal,
      onSelectCalendarDates: filtered,
    })
  }

  handleChangeCalendar = (value: string) => {
    const { onLoadedData } = this.props
    const { calendar, calendar_dates } = onLoadedData
    if(calendar) {
      this.setCalendar(value, calendar[value], calendar_dates)
    }
  }

  toggle = () => {
    const { calInfoExpand } = this.state;
    this.setState({ calInfoExpand: !calInfoExpand });
  }

  componentDidUpdate() {
    const { calendar, calendar_dates } = this.props.onLoadedData
    const { onSelectCalendarKey, onSelectCalendarDates } = this.state
    if (
      (calendar && !onSelectCalendarKey) ||
      (calendar && calendar_dates && !onSelectCalendarDates)
      ) {
      const defaultKey = Object.keys(calendar)[0]
      const defaultCalendar = calendar[defaultKey]
      this.setCalendar(defaultKey, defaultCalendar, calendar_dates)
      }
  }

  render() {
    const { calendar, calendar_dates } = this.props.onLoadedData
    const { onSelectCalendarKey, onSelectCalendar, onSelectCalendarDates, calInfoExpand } = this.state

    const calendarList = new Array()
    if (calendar) {
      for (let i = 0; i < Object.keys(calendar).length; i++) {
        calendarList.push(<Option key={i.toString()}>{calendar[i].service_id}</Option>);
      }
    }

    if (calendar_dates) { }

    return (
      <Card
        bordered={false}
        bodyStyle={{ margin: 6, padding: 0 }}
      >
        <Row
          gutter={{ md: 24, lg: 36, xl: 48 }}
          type="flex"
          align="middle"
          justify='start'
          style={{ marginLeft: 0, marginRight: 0 }}
        >
          <Select
            showSearch
            style={{ width: 214, marginRight: 6 }}
            placeholder="Calendar"
            optionFilterProp="children"
            onChange={this.handleChangeCalendar}
            filterOption={(input, option) => option.props.children && typeof (option.props.children) === 'string' ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : null}
            disabled={!onSelectCalendarKey}
            value={onSelectCalendarKey}
          >
            {calendarList}
          </Select>
          <Switch checkedChildren="Off" unCheckedChildren="On" onChange={this.toggle} />
        </Row>
        <Row
          gutter={{ md: 24, lg: 36, xl: 48 }}
          type="flex"
          align="middle"
          justify='center'
          style={{ marginLeft: 0, marginRight: 0 }}
        >
          {onSelectCalendar && calInfoExpand ?
            <CalendarInfo
              onLoadedCalendar={onSelectCalendar}
              onLoadedCalendarDates={onSelectCalendarDates}
            /> : null}
        </Row>
      </Card>
    )
  }
}
