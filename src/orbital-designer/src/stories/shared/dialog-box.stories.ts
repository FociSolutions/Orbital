import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogBoxComponent } from 'src/app/shared/components/dialog-box/dialog-box.component';

const meta: Meta = {
  title: 'Shared/DialogBox',
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [SharedModule],
    }),
  ],
  component: DialogBoxComponent,
};

export default meta;

const Template: Story<DialogBoxComponent> = (args: DialogBoxComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  title: 'Dialog Box',
  bodyText: 'Girl stop relying on that body ody ody',
};
