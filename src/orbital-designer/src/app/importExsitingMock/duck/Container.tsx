import { MockDefinition } from '../../common/models/mockDefinition/MockDefinition';
import { Props } from '../ImportExistingMockComponent';
import { Dispatch } from 'redux';
import { ImportMockDefinitionAction } from '../../common/ducks/actions/MockDefinitionActions';

/**
 * Map redux mock definition state to component's props
 * @param param0 Redux state, only care about the mock definition state
 * @param props Properties of import existing mock component
 */
export function mapStateToProps(
  { apiInfo, metadata, endpoint }: any,
  props: Props
) {
  return {
    ...props,
    mockDefinition: {
      metadata: metadata,
      host: apiInfo.host,
      basePath: apiInfo.basePath,
      endpoints: endpoint,
      openApi: apiInfo.openApi
    }
  };
}

/**
 * Map component's props function to action
 */
export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onImport: (mockDefinition: MockDefinition) =>
      dispatch(ImportMockDefinitionAction(mockDefinition))
  };
}
