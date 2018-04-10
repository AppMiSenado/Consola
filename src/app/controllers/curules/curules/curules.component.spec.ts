import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurulesComponent } from './curules.component';

describe('CurulesComponent', () => {
  let component: CurulesComponent;
  let fixture: ComponentFixture<CurulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
