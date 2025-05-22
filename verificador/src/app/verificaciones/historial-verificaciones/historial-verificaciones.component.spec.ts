import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialVerificacionesComponent } from './historial-verificaciones.component';

describe('HistorialVerificacionesComponent', () => {
  let component: HistorialVerificacionesComponent;
  let fixture: ComponentFixture<HistorialVerificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialVerificacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialVerificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
