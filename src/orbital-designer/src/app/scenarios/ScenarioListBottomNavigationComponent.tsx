import React from 'react';
import { Link } from 'react-router-dom';

class ScenarioListBottomNavigation extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="m-2">
          <button className="btn btn-light mr-2">
            <Link to="/endpointScenarioOverview">Go Back</Link>
          </button>
        </div>
        <div className="m-2">
          <button className="btn btn-primary btn-md" type="submit">
            Add Scenario
          </button>
        </div>
      </div>
    );
  }
}

export default ScenarioListBottomNavigation;
