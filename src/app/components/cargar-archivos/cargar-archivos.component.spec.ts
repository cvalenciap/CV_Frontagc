import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarArchivosComponent } from './cargar-archivos.component';

describe('CargarArchivosComponent', () => {
  let component: CargarArchivosComponent;
  let fixture: ComponentFixture<CargarArchivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargarArchivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
