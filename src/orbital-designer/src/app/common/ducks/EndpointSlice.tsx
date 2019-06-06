import { PayloadAction, createSlice } from 'redux-starter-kit';
import {
  ImportMockDefinitionAction,
  ClearMockDefinitionAction
} from './actions/MockDefinitionActions';
import { MockDefinition } from '../models/mockDefinition/MockDefinition';
import { Endpoint } from '../models/mockDefinition/Endpoint';

/**
 * Save provided mock definition to state
 * @param _state Metadata
 * @param action Input from the component
 */
function importExisting(
  _state: Endpoint,
  action: PayloadAction<MockDefinition>
) {
  return action.payload.endpoints;
}

/**
 * Clear all values inside the state
 */
function clear() {
  return {} as Endpoint;
}

const endpointSlice = createSlice({
  slice: 'endpoint',
  initialState: {} as Endpoint,
  reducers: {},
  extraReducers: {
    [ImportMockDefinitionAction.type]: importExisting,
    [ClearMockDefinitionAction.type]: clear
  }
});
var EndpointReducer = endpointSlice.reducer;

// Extract and export each action creator by name
/**
 * Actions specific to endpoint
 */
export const EndpointAction = endpointSlice.actions;

// Export the reducer, either as a default or named export
/**
 * Reduce for endpoint
 */
export default EndpointReducer;
