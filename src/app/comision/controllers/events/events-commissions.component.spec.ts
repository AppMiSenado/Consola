import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsCommissionsComponent } from './events-commissions.component';

describe('EventsCommissionsComponent', () => {
  let component: EventsCommissionsComponent;
  let fixture: ComponentFixture<EventsCommissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsCommissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsCommissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
