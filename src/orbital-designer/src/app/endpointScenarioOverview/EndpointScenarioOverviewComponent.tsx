import * as React from 'react';
import './EndpointScenarioOverview.scss';
import EndpointListView from './EndpointListViewComponent';
import ScenarioListView from './ScenarioListViewComponent';
import BottomNavigation from './BottomNavigationComponent';

class EndpointScenarioOverview extends React.Component {
  render() {
    return (
      <div className="overview">
        <div className="row">
          <EndpointListView />
          <ScenarioListView />
        </div>
        <BottomNavigation />
      </div>
    );
  }
}

export default EndpointScenarioOverview; 
