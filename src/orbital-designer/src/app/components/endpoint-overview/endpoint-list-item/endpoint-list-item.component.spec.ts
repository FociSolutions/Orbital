import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointListItemComponent } from './endpoint-list-item.component';
import { Endpoint } from 'src/app/models/endpoint.model';
import { VerbType } from 'src/app/models/verb.type';
import { By } from '@angular/platform-browser';
import { GetVerbColorPipe } from 'src/app/pipes/get-verb-color.pipe';
import { AppStore } from 'src/app/store/app-store';

describe('EndpointListItemComponent', () => {
  let component: EndpointListItemComponent;
  let fixture: ComponentFixture<EndpointListItemComponent>;

  let endpoint: Endpoint;

  beforeEach(async(() => {
    endpoint = {
      path: '/examplepath',
      verb: VerbType.POST,
      spec: {
        responses: null,
        description: 'test'
      }
    };
  }));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EndpointListItemComponent, GetVerbColorPipe],
      providers: [AppStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in a h6 tag', async(() => {
    component.endpoint = endpoint;

    fixture.detectChanges();
    const compiled = fixture.debugElement;

    const expected = endpoint.path;
    const actual = compiled.query(By.css('h6')).nativeElement.innerText;
    expect(actual).toEqual(expected);
  }));

  it('should render description in a small tag', async(() => {
    component.endpoint = endpoint;

    fixture.detectChanges();
    const compiled = fixture.debugElement;

    const expected = endpoint.spec.description;
    const actual = compiled.query(By.css('small')).nativeElement.innerText;
    expect(actual).toEqual(expected);
  }));

  it('should render description in a small tag', async(() => {
    component.endpoint = endpoint;

    fixture.detectChanges();
    const compiled = fixture.debugElement;

    const expected = endpoint.spec.description;
    const actual = compiled.query(By.css('small')).nativeElement.innerText;
    expect(actual).toEqual(expected);
  }));

  it('should render pill in red for DELETE in badge class', async(() => {
    component.endpoint = { ...endpoint, verb: VerbType.DELETE };

    fixture.detectChanges();
    const compiled = fixture.debugElement;

    const expected = VerbType.DELETE;
    const actual = compiled.query(By.css('.badge')).nativeElement.innerText;
    expect(actual).toEqual(expected);
    expect(compiled.query(By.css('.badge-danger'))).toBeTruthy();
  }));

  it('should render pill in green for POST in badge class', async(() => {
    component.endpoint = { ...endpoint, verb: VerbType.POST };

    fixture.detectChanges();
    const compiled = fixture.debugElement;

    const expected = VerbType.POST;
    const actual = compiled.query(By.css('.badge')).nativeElement.innerText;
    expect(actual).toEqual(expected);
    expect(compiled.query(By.css('.badge-success'))).toBeTruthy();
  }));

  it('should render pill in blue for GET in badge class', async(() => {
    component.endpoint = { ...endpoint, verb: VerbType.GET };

    fixture.detectChanges();
    const compiled = fixture.debugElement;

    const expected = VerbType.GET;
    const actual = compiled.query(By.css('.badge')).nativeElement.innerText;
    expect(actual).toEqual(expected);
    expect(compiled.query(By.css('.badge-info'))).toBeTruthy();
  }));

  it('should render pill in yellow for PUT in badge class', async(() => {
    component.endpoint = { ...endpoint, verb: VerbType.PUT };

    fixture.detectChanges();
    const compiled = fixture.debugElement;

    const expected = VerbType.PUT;
    const actual = compiled.query(By.css('.badge')).nativeElement.innerText;
    expect(actual).toEqual(expected);
    expect(compiled.query(By.css('.badge-warning'))).toBeTruthy();
  }));
});
