import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaMasivaTramaComponent } from './carga-masiva-trama.component';

describe('CargaMasivaTramaComponent', () => {
  let component: CargaMasivaTramaComponent;
  let fixture: ComponentFixture<CargaMasivaTramaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargaMasivaTramaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaMasivaTramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
