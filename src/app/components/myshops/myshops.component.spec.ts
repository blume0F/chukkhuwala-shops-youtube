import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyshopsComponent } from './myshops.component';

describe('MyshopsComponent', () => {
  let component: MyshopsComponent;
  let fixture: ComponentFixture<MyshopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyshopsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyshopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
