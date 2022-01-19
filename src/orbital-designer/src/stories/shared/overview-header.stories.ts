import { TemplateRef } from '@angular/core';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { OverviewHeaderComponent } from 'src/app/shared/components/overview-header/overview-header.component';
import { SharedModule } from 'src/app/shared/shared.module';

const meta: Meta = {
  title: 'Shared/Titles/Overview Header',
  decorators: [
    moduleMetadata({
      declarations: [OverviewHeaderComponent],
      imports: [SharedModule],
    }),
  ],
  component: OverviewHeaderComponent,
};

export default meta;

const Template: Story<OverviewHeaderComponent> = (args: OverviewHeaderComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  metadata: {
    title: 'Title',
    description: 'Description',
  },
  header: TemplateRef,
};
