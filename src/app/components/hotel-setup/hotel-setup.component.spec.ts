import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSetupComponent } from './hotel-setup.component';

describe('HotelSetupComponent', () => {
  let component: HotelSetupComponent;
  let fixture: ComponentFixture<HotelSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
