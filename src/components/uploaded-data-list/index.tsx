import React from 'react'
import { Card, Select, Row, Col, Switch } from 'antd'
import { GTFSFile } from 'typings'

interface UploadedDataListProps {
  onLoadedData?: GTFSFile,
}

interface UploadedDataListState {
  calendar?: any
  onSelectCalendarKey?: String,
  calInfoExpand?: boolean
}

const Option = Select.Option;

export default class UploadedDataList extends React.Component<UploadedDataListProps, UploadedDataListState> {

  state = {
    calendar: new Array(),
    onSelectCalendarKey: undefined,
    calInfoExpand: false,
  }

  componentDidMount() {
    // tslint:disable-next-line:no-console
    console.log('im in componentDidMount, this.props is', this.props)
    const { onLoadedData } = this.props
    if(onLoadedData) {
      const { calendar } = onLoadedData
      this.setState({
        calendar: onLoadedData.calendar,
      })
      if(calendar) {
        this.setState({
          onSelectCalendarKey: Object.keys(calendar)[0],
        })
      }
    }
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

  render() {
    // tslint:disable-next-line:no-console
    console.log('im in render of data-list, this.state is', this.state)
    const { calendar, onSelectCalendarKey } = this.state

    const calendarList = new Array()
    if(calendar) {
      for (let i = 0; i < Object.keys(calendar).length ; i++) {
        const cal = calendar[i]
        calendarList.push(<Option key={i.toString()}>{cal.service_id}</Option>);
      }
    }

    return (
      <Card>
        <Row
          gutter={{ md: 24, lg: 36, xl: 48 }}
          type="flex"
          align="middle"
          justify= 'center'
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
              //disabled={!calendar}
              value={onSelectCalendarKey}
            >
              {calendarList}
            </Select>
          </Col>
          <Col
            span={8}
            style={{ paddingLeft: 0, paddingRight: 0, justifyContent: 'center'}}
          >
            <Switch checkedChildren="Show" unCheckedChildren="Hide" onChange={this.toggle} />
          </Col>
        </Row>
      </Card>
    )
  }
}
