import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Tree, Input, Card } from 'antd';
import { GlobalContext } from '../global-context';
import { Routes, Agencies, Agency, Route } from 'typings';
const { TreeNode } = Tree;
const { Search } = Input;
import './style';

export const RoutesTree: FunctionComponent = () => {
  const { state } = useContext(GlobalContext);
  const { selectedGTFS } = state;

  const [routes, setRoutes] = useState<Routes>([]);
  const [agencies, setAgencies] = useState<Agencies>([]);

  const renderAgencyTree = (agency: Agency) => {
    const { agency_id, agency_name } = agency;
    const agencyKey = agency_id !== undefined ? agency_id : agency_name;
    console.log(routes[0].agency_id, agencyKey, routes[0].agency_id === agencyKey);
    const agencyRoutes = routes.filter(route => route.agency_id === agencyKey);
    return (
      <TreeNode title={agencyKey} key={`agency-${agencyKey}`}>
        {agencyRoutes.map(route => renderRouteTree(route))}
      </TreeNode>
    );
  };

  const renderRouteTree = (route: Route) => {
    return <TreeNode title={route.route_id} key={`route-${route.route_id}`} />;
  };

  // const handleOnSearch = (value: string) => {
  //   const currentRoutes = routes.filter(route => {
  //     const { route_long_name, route_short_name } = route
  //     let includeLong = false
  //     let includeShort = false
  //     if(route_long_name) {
  //       includeLong = route_long_name.toLowerCase().includes(value.toLowerCase())
  //     }
  //     if(route_short_name) {
  //       includeShort = route_short_name.toLowerCase().includes(value.toLowerCase())
  //     }
  //     return includeLong || includeShort
  //   });
  //   setRoutes(currentRoutes);
  // };

  useEffect(() => {
    if (selectedGTFS) {
      const { routes: rts, agency: ags } = selectedGTFS;
      if (rts) {
        setRoutes(rts);
      }
      if (ags) {
        setAgencies(ags);
      }
    }
  }, [selectedGTFS]);

  const SearchBar = (
    <Search
      placeholder="Search by route name"
      enterButton
      // onSearch={handleOnSearch}
      prefix={<span />}
      suffix={<span />}
    />
  );

  const RouteTree = (
    <Tree
      checkable
      // onExpand
      // expandedKeys
      // autoExpandParent
      // onCheck
      // checkedKeys
      // onSelect
      // selectedKeys
    >
      {agencies.map(agency => renderAgencyTree(agency))}
    </Tree>
  );

  return (
    <Card
      bordered={false}
      title={SearchBar}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
      bodyStyle={{ position: 'relative', padding: 0, flex: 1 }}
    >
      {RouteTree}
    </Card>
  );
};
