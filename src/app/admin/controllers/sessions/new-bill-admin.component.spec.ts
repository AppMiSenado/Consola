import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBillAdminComponent } from './new-bill-admin.component';

describe('NewBillAdminComponent', () => {
  let component: NewBillAdminComponent;
  let fixture: ComponentFixture<NewBillAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBillAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBillAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
