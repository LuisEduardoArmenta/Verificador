import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosAsignadosComponent } from './horarios-asignados.component';

describe('HorariosAsignadosComponent', () => {
  let component: HorariosAsignadosComponent;
  let fixture: ComponentFixture<HorariosAsignadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorariosAsignadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorariosAsignadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
