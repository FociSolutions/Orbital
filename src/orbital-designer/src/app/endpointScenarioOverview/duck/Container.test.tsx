import { mapStateToProps, mapDispatchToProps } from './Container';
import { Props } from '../BottomNavigationComponent';

describe('mapStateToProps', () => {
  it('passed props as is', () => {
    const input = {};
    var actual = mapStateToProps(input as Props);
    expect(actual).toEqual(input);
  });
});

describe('mapDispatchToProps', () => {
  it('has executed correct action for goBackToHome', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).goBackToHome();
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: 'mockDefinition/clear'
    });
  });
});
