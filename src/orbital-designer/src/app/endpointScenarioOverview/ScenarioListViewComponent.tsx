import React from 'react';

class ScenarioListView extends React.Component {
  render() {
    return (
      <div className="rightside">
        <div className="col">
          <h3>Scenarios</h3>
          <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane active"
              id="list-1"
              role="tabpanel"
              aria-labelledby="list-prince-list"
            >
              Example Description 1
            </div>
            <div
              className="tab-pane"
              id="list-2"
              role="tabpanel"
              aria-labelledby="list-wild-list"
            >
              Example Description 2
            </div>
            <div
              className="tab-pane"
              id="list-3"
              role="tabpanel"
              aria-labelledby="list-solitude-list"
            >
              Example Description 3
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ScenarioListView;
