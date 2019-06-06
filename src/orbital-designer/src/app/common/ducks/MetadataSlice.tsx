import { PayloadAction, createSlice } from 'redux-starter-kit';
import {
  ImportMockDefinitionAction,
  ClearMockDefinitionAction
} from './actions/MockDefinitionActions';
import { MockDefinition } from '../models/mockDefinition/MockDefinition';
import { Metadata } from '../models/mockDefinition/Metadata';

/**
 * Populates the Metadata model from the component state
 * @param state Metadata
 * @param action input from component into the Metadata model
 */
function populateMetadata(_state: Metadata, action: PayloadAction<Metadata>) {
  return action.payload;
}

/**
 * Save provided mock definition to state
 * @param _state Metadata
 * @param action Input from the component
 */
function importExisting(
  _state: Metadata,
  action: PayloadAction<MockDefinition>
) {
  return action.payload.metadata;
}

/**
 * Clear all values inside the state
 */
function clear() {
  return {} as Metadata;
}

const metadataSlice = createSlice({
  slice: 'metadata',
  initialState: {} as Metadata,
  reducers: {
    setMetadata: populateMetadata
  },
  extraReducers: {
    [ImportMockDefinitionAction.type]: importExisting,
    [ClearMockDefinitionAction.type]: clear
  }
});
var MetadataReducer = metadataSlice.reducer;

// Extract and export each action creator by name
/**
 * Actions specific to metadata
 */
export const MetadataAction = metadataSlice.actions;

// Export the reducer, either as a default or named export
/**
 * Reduce for metadata
 */
export default MetadataReducer;
