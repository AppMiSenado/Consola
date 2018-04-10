import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUrlStreamingComponent } from './new-url-streaming.component';

describe('NewUrlStreamingComponent', () => {
  let component: NewUrlStreamingComponent;
  let fixture: ComponentFixture<NewUrlStreamingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUrlStreamingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUrlStreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
