import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCargaTrabajoComponent } from './detalle-carga-trabajo.component';

describe('DetalleCargaTrabajoComponent', () => {
  let component: DetalleCargaTrabajoComponent;
  let fixture: ComponentFixture<DetalleCargaTrabajoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleCargaTrabajoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCargaTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
