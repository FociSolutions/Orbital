import React from 'react';
import './SideMenu.scss';
import ScenarioListComponent from './ScenarioListComponent';
import EditScenarioComponent from './EditScenarioComponent';
import ScenarioListBottomNavigationComponent from './ScenarioListBottomNavigationComponent';

class ScenarioMockComponent extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col border-right border-bottom">
            <div className="row">
              <div className="col">
                <ScenarioListComponent />
              </div>
            </div>
            <ScenarioListBottomNavigationComponent />
          </div>
          <EditScenarioComponent />
        </div>
      </div>
    );
  }
}

export default ScenarioMockComponent;
