import React from 'react'
import { Card, Select, Row, Col, Switch } from 'antd'
import { GTFSFile, Calendar } from 'typings'
import CalendarInfo from './calendar-info';

interface UploadedDataListProps {
  onLoadedData: GTFSFile,
}

interface UploadedDataListState {
  onSelectCalendarKey?: String,
  onSelectCalendar?: Calendar,
  calInfoExpand?: boolean
}

const Option = Select.Option;

export default class UploadedDataList extends React.PureComponent<UploadedDataListProps, UploadedDataListState> {
  constructor(props: UploadedDataListProps) {
    super(props)

    this.state = {
    onSelectCalendar: undefined,
    onSelectCalendarKey: undefined,
    calInfoExpand: false,
    }
  }

  setDefault = (key: string, cal: Calendar) => {
    this.setState({
      onSelectCalendarKey: key,
      onSelectCalendar: cal,
    })
  }

  handleChangeCalendar = (value: string) => {
    this.setState({
      onSelectCalendarKey: value,
    })
  }

  toggle = () => {
    const { calInfoExpand } = this.state;
    this.setState({ calInfoExpand: !calInfoExpand });
  }

  componentDidUpdate() {
    const { calendar } = this.props.onLoadedData
    const { onSelectCalendarKey } = this.state
    if (calendar) {
      if(!onSelectCalendarKey) {
        const key = Object.keys(calendar)[0]
        this.setDefault( key, calendar[key] )
      }
    }
  }

  render() {
    const { calendar } = this.props.onLoadedData
    const { onSelectCalendarKey, onSelectCalendar, calInfoExpand} = this.state

    const calendarList = new Array()
    if (calendar) {
      for (let i = 0; i < Object.keys(calendar).length; i++) {
        calendarList.push(<Option key={i.toString()}>{calendar[i].service_id}</Option>);
      }
    }

    return (
      <Card>
        <Row
          gutter={{ md: 24, lg: 36, xl: 48 }}
          type="flex"
          align="middle"
          justify='center'
        >
          <Col
            span={16}
            style={{ paddingLeft: 0, paddingRight: 4 }}
          >
            <Select
              showSearch
              style={{ display: 'inline' }}
              placeholder="Calendar"
              optionFilterProp="children"
              onChange={this.handleChangeCalendar}
              filterOption={(input, option) => option.props.children && typeof (option.props.children) === 'string' ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : null}
              disabled={!onSelectCalendarKey}
              value={onSelectCalendarKey}
            >
              {calendarList}
            </Select>
          </Col>
          <Col
            span={8}
            style={{ paddingLeft: 0, paddingRight: 0, justifyContent: 'center' }}
          >
            <Switch checkedChildren="Show" unCheckedChildren="Hide" onChange={this.toggle} />
          </Col>
        </Row>
        <Row
          gutter={{ md: 24, lg: 36, xl: 48 }}
          type="flex"
          align="middle"
          justify='center'
        >
          {onSelectCalendar && calInfoExpand? <CalendarInfo onLoadedCalendar={onSelectCalendar} />: null}
        </Row>
      </Card>
    )
  }
}
