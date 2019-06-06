import React from 'react';
import { mount } from 'enzyme';

it('renders the html correctly', () => { const wrapper = mount(
        <div className="row mb-3">
            <h3>Create New Mock</h3>
        </div>
    );
    expect(wrapper.find('div').prop('className')).toEqual('row mb-3');
})