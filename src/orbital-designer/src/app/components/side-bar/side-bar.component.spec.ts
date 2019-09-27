import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideBarComponent } from './side-bar.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { DesignerStore } from 'src/app/store/designer-store';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;
  let store: DesignerStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarComponent ],
      imports: [ MatSidenavModule, MatDividerModule, MatListModule, MatIconModule, LoggerTestingModule ],
      providers: [ DesignerStore ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(DesignerStore);
    store.mockDefinition = validMockDefinition as MockDefinition;
    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in h1 tag', async(() => {
    // tslint:disable-next-line: no-shadowed-variable
    const fixture = TestBed.createComponent(SideBarComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('MOCKDEFINITIONS');
  }));
});
