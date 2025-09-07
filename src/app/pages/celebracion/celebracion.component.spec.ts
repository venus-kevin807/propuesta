import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebracionComponent } from './celebracion.component';

describe('CelebracionComponent', () => {
  let component: CelebracionComponent;
  let fixture: ComponentFixture<CelebracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CelebracionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CelebracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
