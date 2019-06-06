import React from 'react';
import Header from './common/header/HeaderComponent';
import Home from './home/HomeComponent';
import CreateNewMock from './createNewMock/CreateNewMockComponent';
import ScenarioMock from './scenarios/ScenarioMockComponent';
import { Route, Switch } from 'react-router-dom';
import EndpointScenarioOverview from './endpointScenarioOverview/EndpointScenarioOverviewComponent';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <div className="container">
            <Header />
            <Route path="/" exact component={Home} />
            <Route path="/CreateNewMock" exact component={CreateNewMock} />
            <Route path="/Scenarios" exact component={ScenarioMock} />
            <Route
              path="/EndpointScenarioOverview"
              exact
              component={EndpointScenarioOverview}
            />
          </div>
        </Switch>
      </div>
    );
  }
}

export default App;
