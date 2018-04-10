import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InplenaryComponent } from './inplenary.component';

describe('InplenaryComponent', () => {
  let component: InplenaryComponent;
  let fixture: ComponentFixture<InplenaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InplenaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InplenaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
