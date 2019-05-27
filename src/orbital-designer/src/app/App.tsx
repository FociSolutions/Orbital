import React from 'react';
import Header from './common/header/HeaderComponent';
import Home from './home/HomeComponent';
import CreateNewMock from './createNewMock/CreateNewMockComponent';
import ComposeMock from './composeMock/ComposeMockComponent';
import ScenarioMock from './scenarios/ScenarioMockComponent';
import { Route, BrowserRouter } from 'react-router-dom';
import EndpointScenarioOverview from './endpointScenarioOverview/EndpointScenarioOverviewComponent';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div className="container">
            <Header />
            <Route path="/" exact component={Home} />
            <Route path="/CreateNewMock" component={CreateNewMock} />
            <Route path="/ComposeMock" component={ComposeMock} />
            <Route path="/Scenarios" component={ScenarioMock} />
            <Route path="/EndpointScenarioOverview" component={EndpointScenarioOverview}/>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
