import * as React from 'react'
import uuidv4 from 'uuid'

export const childrenMarkerToObject = (n: React.ReactNode) => React.Children
  .toArray(n)
  .filter( (com: JSX.Element) => com.type.name === 'AllInOneMarker')
  .map( (mCom: JSX.Element) => { return {id: uuidv4(), props: mCom.props} } )
