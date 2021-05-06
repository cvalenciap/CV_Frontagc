import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleBandejaComponent } from './detalle-bandeja.component';

describe('DetalleBandejaComponent', () => {
  let component: DetalleBandejaComponent;
  let fixture: ComponentFixture<DetalleBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
