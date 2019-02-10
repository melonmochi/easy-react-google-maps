import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EasyMapApp from './EasyMapApp';

ReactDOM.render(<EasyMapApp />, document.getElementById('root'));

if ((module as any).hot) {
  (module as any).hot.accept();
}
