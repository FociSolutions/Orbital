// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { SearchBarComponent } from 'src/app/shared/components/search-bar/search-bar.component';
import { SharedModule } from 'src/app/shared/shared.module';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
const meta: Meta = {
  title: 'Shared/User Input/Search Bar',
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      declarations: [],
      imports: [SharedModule],
    }),
  ],
  component: SearchBarComponent,
};

export default meta;

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<SearchBarComponent> = (args: SearchBarComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  list: ['This', 'is', 'a', 'test', 'story'],
};

export const Secondary = Template.bind({});
Secondary.args = {
  list: ['😄', '👍', '😍', '💯'],
};
