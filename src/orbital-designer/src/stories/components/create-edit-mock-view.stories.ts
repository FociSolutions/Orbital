// MyComponent.stories.ts
import { FormControl, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Meta, Story, moduleMetadata } from '@storybook/angular';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { CreateEditMockViewComponent } from 'src/app/components/create-edit-mock-view/create-edit-mock-view.component';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';
import { OpenApiSpecService } from 'src/app/services/openapispecservice/open-api-spec.service';
import { ReadFileService } from 'src/app/services/read-file/read-file.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignerStore } from 'src/app/store/designer-store';

const meta: Meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/angular/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/CreateEditMockView',
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      declarations: [CreateEditMockViewComponent],
      imports: [
        SharedModule,
        MatCardModule,
        MatTooltipModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        LoggerTestingModule,
      ],
      providers: [Location, DesignerStore, OpenApiSpecService, ReadFileService, MockDefinitionService],
    }),
  ],
  component: CreateEditMockViewComponent,
};

export default meta;

export const EditMock: Story = () => ({
  props: {
    editMode: true,
    formGroup: new FormGroup({
      title: new FormControl('Test Mock'),
      description: new FormControl('Storybook test mock!'),
      validateToken: new FormControl(true),
    }),
  },
});

export const CreateMock: Story = () => ({});
