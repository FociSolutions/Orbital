import { Dispatch } from 'redux';
import { Props } from '../NewMockFormComponent';
import { Metadata } from '../../common/models/mockDefinition/Metadata';
import { ApiInformationAction } from '../../common/ducks/ApiInformationSlice';
import { MetadataAction } from '../../common/ducks/MetadataSlice';

/**
 * Map redux mock definition state to component's props
 * @param props Properties of import existing mock component
 */
export function mapStateToProps(props: Props) {
  return props;
}

/**
 * Map component's props function to action
 */
export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onMetadata: (m: Metadata) => dispatch(MetadataAction.setMetadata(m)),
    onOpenApi: (m: string) => dispatch(ApiInformationAction.setOpenApiSpec(m)),
    onHost: (m: string) => dispatch(ApiInformationAction.setHost(m)),
    onBasePath: (m: string) => dispatch(ApiInformationAction.setBasePath(m))
  };
}
