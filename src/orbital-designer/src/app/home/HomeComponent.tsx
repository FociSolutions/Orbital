import React from 'react';
import { Link } from 'react-router-dom';
import ImportExistingMockComponent from '../importExsitingMock/ImportExistingMockComponent';

class Home extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="mx-auto mb-3">
            <Link className="btn btn-light" to="/CreateNewMock">
              Create New Mock Definition
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="mx-auto">
            <ImportExistingMockComponent />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
