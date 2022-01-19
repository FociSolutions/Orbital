// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { ToolTipComponent } from 'src/app/shared/components/tooltip/tooltip.component';
import { SharedModule } from 'src/app/shared/shared.module';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
const meta: Meta = {
  title: 'Shared/ToolTip',
  component: ToolTipComponent,
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      declarations: [],
      imports: [SharedModule],
    }),
  ],
  // More on argTypes: https://storybook.js.org/docs/angular/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export default meta;

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<ToolTipComponent> = (args: ToolTipComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/angular/writing-stories/args
Primary.args = {
  message: 'Primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  message: 'Secondary',
};

export const Large = Template.bind({});
Large.args = {
  message: 'Large',
};

export const Small = Template.bind({});
Small.args = {
  message: 'Small',
};
