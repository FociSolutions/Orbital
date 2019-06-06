import { PayloadAction, createSlice } from 'redux-starter-kit';
import { ApiInformation } from '../models/ApiInformation';
import {
  ImportMockDefinitionAction,
  ClearMockDefinitionAction
} from './actions/MockDefinitionActions';
import { MockDefinition } from '../models/mockDefinition/MockDefinition';

/**
 * Populates the OpenApi model from the component state
 * @param state ApiInformation
 * @param action input from the component into the openAPI spec state
 */
function populateOpenApiSpec(
  state: ApiInformation,
  action: PayloadAction<string>
) {
  return { ...state, openApi: action.payload };
}

/**
 * Populates the host model from the component state
 * @param state ApiInformation
 * @param action input from the component into the host state
 */
function populateHost(state: ApiInformation, action: PayloadAction<string>) {
  return { ...state, host: action.payload };
}
/**
 * Populates the base path from the component state
 * @param state ApiInformation
 * @param action input from the component into the base path state
 */
function populateBasePath(
  state: ApiInformation,
  action: PayloadAction<string>
) {
  return { ...state, basePath: action.payload };
}

/**
 * Save provided mock definition to state
 * @param _state ApiInformation
 * @param action Input from the component
 */
function importExisting(
  _state: ApiInformation,
  action: PayloadAction<MockDefinition>
) {
  return {
    host: action.payload.host,
    basePath: action.payload.basePath,
    openApi: action.payload.openApi
  } as ApiInformation;
}

/**
 * Clear all values inside the state
 */
function clear() {
  return {} as ApiInformation;
}

const apiInfoSlice = createSlice({
  slice: 'apiInfo',
  initialState: {} as ApiInformation,
  reducers: {
    setOpenApiSpec: populateOpenApiSpec,
    setHost: populateHost,
    setBasePath: populateBasePath
  },
  extraReducers: {
    [ImportMockDefinitionAction.type]: importExisting,
    [ClearMockDefinitionAction.type]: clear
  }
});
var ApiInformationReducer = apiInfoSlice.reducer;

// Extract and export each action creator by name
/**
 * Actions specific to API information
 */
export const ApiInformationAction = apiInfoSlice.actions;

// Export the reducer, either as a default or named export
/**
 * Reduce for API information
 */
export default ApiInformationReducer;
