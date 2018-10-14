import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowConfirmDeleteComponent } from './show-confirm-delete.component';

describe('ShowConfirmDeleteComponent', () => {
  let component: ShowConfirmDeleteComponent;
  let fixture: ComponentFixture<ShowConfirmDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowConfirmDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowConfirmDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
