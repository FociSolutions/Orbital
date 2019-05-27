import React from 'react';
import { Link } from 'react-router-dom';

class BottomNavigation extends React.Component {
  render() {
    return (
      <div className="form-row">
        <button className="btn btn-light mr-2">
          <Link to="/">Go Back</Link>
        </button>
        <button className="btn btn-light ml-2`" type="submit">
          <Link to="/Scenarios"> Edit Scenario</Link>
        </button>
        <div className="col-md-8" />
        <button className="btn btn-light ml-2" type="submit">
          Export Mock File
        </button>
      </div>
    );
  }
}

export default BottomNavigation;
