import * as React from 'react';
import { Button, Tooltip, Collapse } from 'antd';
import { GoogleMapsControlPosition } from 'typings';

// tslint:disable-next-line:interface-name
export interface MapToolProps {
  google?: typeof google;
  map?: google.maps.Map;
  bounds?: google.maps.LatLngBounds;
  position?: GoogleMapsControlPosition;
}

const Panel = Collapse.Panel;

export default class MapTool extends React.Component<MapToolProps, any> {
  private mapToolRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.renderMapTool();
  }

  mapToolControl(controlDiv: HTMLDivElement) {
    const { map } = this.props;
    if (map) {
      const controlUI = document.createElement('div');
      controlUI.appendChild(controlDiv);
      // controlUI.addEventListener('click', () => null);
      return controlUI;
    } else {
      return;
    }
  }

  renderMapTool() {
    const { map } = this.props;
    const mtButton = this.mapToolRef.current;
    const mtControl = this.mapToolControl(mtButton as HTMLDivElement);
    const position = this.props.position ? this.props.position : 'RIGHT_TOP';
    if (map && mtControl) {
      map.controls[google.maps.ControlPosition[position]].push(mtControl);
    }
  }

  render() {
    return (
      <div ref={this.mapToolRef}>
        <Collapse >
          <Panel header="Basic tools" key="1">
            <Tooltip title="Map Tool">
              <Button icon="tool" />
            </Tooltip>
          </Panel>
          <Panel header="Drawer" key="2">
            <p>Funtionality no implemented yet</p>
          </Panel>
        </Collapse>
      </div>
    );
  }
}
