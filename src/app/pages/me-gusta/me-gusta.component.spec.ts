import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGustaComponent } from './me-gusta.component';

describe('MeGustaComponent', () => {
  let component: MeGustaComponent;
  let fixture: ComponentFixture<MeGustaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeGustaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeGustaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
