import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurulesDirectiveComponent } from './curules-directive.component';

describe('CurulesDirectiveComponent', () => {
  let component: CurulesDirectiveComponent;
  let fixture: ComponentFixture<CurulesDirectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurulesDirectiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurulesDirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
