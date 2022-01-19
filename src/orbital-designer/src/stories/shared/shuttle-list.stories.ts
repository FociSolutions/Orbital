import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { ShuttleListComponent } from 'src/app/shared/components/shuttle-list/shuttle-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

const meta: Meta = {
  title: 'Shared/ShuttleList',
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [SharedModule],
    }),
  ],
  component: ShuttleListComponent,
};

export default meta;

const Template: Story<ShuttleListComponent> = (args: ShuttleListComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  leftTitle: 'Left Title',
  rightTitle: 'Right Title',
};
