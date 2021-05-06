import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaBandejaComponent } from './busqueda-bandeja.component';

describe('BusquedaBandejaComponent', () => {
  let component: BusquedaBandejaComponent;
  let fixture: ComponentFixture<BusquedaBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
