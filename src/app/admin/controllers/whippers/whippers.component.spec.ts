import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhippersComponent } from './whippers.component';

describe('WhippersComponent', () => {
  let component: WhippersComponent;
  let fixture: ComponentFixture<WhippersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhippersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhippersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
