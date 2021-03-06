import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbeComponent } from './probe.component';

describe('ProbeComponent', () => {
  let component: ProbeComponent;
  let fixture: ComponentFixture<ProbeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProbeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
