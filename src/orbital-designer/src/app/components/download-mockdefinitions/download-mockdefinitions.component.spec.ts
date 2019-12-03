import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadMockdefinitionsComponent } from './download-mockdefinitions.component';
import { SearchableSelectionListComponent } from '../orbital-common/searchable-selection-list/searchable-selection-list.component';
import {
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatCheckboxModule,
  MatDividerModule,
  MatListModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import * as faker from 'faker';
import { DesignerStore } from 'src/app/store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('DownloadMockdefinitionsComponent', () => {
  let component: DownloadMockdefinitionsComponent;
  let fixture: ComponentFixture<DownloadMockdefinitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadMockdefinitionsComponent,
        SearchableSelectionListComponent
      ],
      imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatDividerModule,
        MatListModule,
        LoggerTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadMockdefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('emptyListMessage defaults to: List is empty', () => {
    expect(component.emptyListMessage).toEqual('List is empty');
  });

  it('noSearchResultsMessage defaults to: No search results found', () => {
    expect(component.noSearchResultsMessage).toEqual('No search results found');
  });

  it('leftList defaults to: []', () => {
    expect(component.list).toEqual([]);
  });

  it('leftSelected defaults to: []', () => {
    expect(component.selected).toEqual([]);
  });

  it('isMockSelected defaults to: false', () => {
    expect(component.isMockSelected).toEqual(false);
  });

  it('onSelectLeft sets the array when setting', () => {
    const leftArray = [faker.random.word()];
    component.onSelect(leftArray);
    expect(component.selected).toEqual(leftArray);
  });

  it('should disable the select button when no items are selected', () => {
    component.onSelect([]);
    expect(component.isMockSelected).toBe(false);
  });

  it('should enable the select button when no items are selected', () => {
    component.onSelect([faker.random.word()]);
    expect(component.isMockSelected).toBe(true);
  });
});
