import { createAction } from 'redux-starter-kit';

/**
 * Action to populate state from a provided mock definition
 */
export const ImportMockDefinitionAction = createAction('mockDefinition/import');

/**
 * Action to clear mock definition values
 */
export const ClearMockDefinitionAction = createAction('mockDefinition/clear');
