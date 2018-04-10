import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InplenaryLiveComponent } from './inplenary-live.component';

describe('InplenaryLiveComponent', () => {
  let component: InplenaryLiveComponent;
  let fixture: ComponentFixture<InplenaryLiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InplenaryLiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InplenaryLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
