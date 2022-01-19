// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { FormControl } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { SharedModule } from 'src/app/shared/shared.module';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
const meta: Meta = {
  title: 'Shared/User Input/Text Input',
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      declarations: [],
      imports: [SharedModule],
    }),
  ],
  component: TextInputComponent,
};

export default meta;

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<TextInputComponent> = (args: TextInputComponent) => ({
  props: args,
});

export const NoTitle = Template.bind({});
NoTitle.args = {
  maxLength: 10,
  multiLine: false,
  control: new FormControl(''),
};

export const SingleLine = Template.bind({});
SingleLine.args = {
  title: 'Single Line',
  maxLength: 10,
  multiLine: false,
  control: new FormControl(''),
};

export const SingleLineInvalid = Template.bind({});
SingleLineInvalid.args = {
  title: 'Single Line',
  maxLength: 10,
  multiLine: false,
  control: new FormControl('More then 10 characters'),
};

export const MultiLine = Template.bind({});
MultiLine.args = {
  title: 'Multi Line',
  maxLength: 10,
  multiLine: true,
  control: new FormControl(''),
};

export const MaxLength10 = Template.bind({});
// More on args: https://storybook.js.org/docs/angular/writing-stories/args
MaxLength10.args = {
  title: 'Max Length 10',
  maxLength: 10,
  multiLine: false,
  control: new FormControl(''),
};
