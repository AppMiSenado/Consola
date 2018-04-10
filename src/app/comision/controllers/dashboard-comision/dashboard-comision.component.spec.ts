import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComisionComponent } from './dashboard-comision.component';

describe('DashboardComisionComponent', () => {
  let component: DashboardComisionComponent;
  let fixture: ComponentFixture<DashboardComisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
