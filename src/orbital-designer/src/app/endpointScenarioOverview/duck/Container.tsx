import { Props } from '../BottomNavigationComponent';
import { Dispatch } from 'redux';
import { ClearMockDefinitionAction } from '../../common/ducks/actions/MockDefinitionActions';

/**
 * Map redux mock definition state to component's props
 * @param param0 Redux state, only care about the mock definition state
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
    goBackToHome: () => dispatch(ClearMockDefinitionAction())
  };
}
