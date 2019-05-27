import React from 'react';

class EndpointListView extends React.Component {
  render() {
    return (
      <div className="leftside">
        <div className="col">
          <h3>Endpoints</h3>

          <ul className="list-group">
            <a
              href="#list-1"
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              <div className="flex-column">
                Example Endpoint 1
                <p>
                  <small>Example Description</small>
                </p>
                <span className="badge badge-success badge-pill">POST</span>
              </div>
              <div className="image-parent" />
            </a>
            <a
              href="#list-2"
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              <div className="flex-column">
                Example Endpoint 2
                <p>
                  <small>Example Description</small>
                </p>
                <span className="badge badge-warning badge-pill">GET</span>
              </div>
              <div className="image-parent" />
            </a>
            <a
              href="#list-3"
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              <div className="flex-column">
                Example Endpoint 3
                <p>
                  <small>Example Description</small>
                </p>
                <span className="badge badge-danger badge-pill">DELETE</span>
              </div>
              <div className="image-parent" />
            </a>
          </ul>
        </div>
      </div>
    );
  }
}

export default EndpointListView;
