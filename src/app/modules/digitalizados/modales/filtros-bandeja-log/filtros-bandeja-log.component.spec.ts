import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosBandejaLogComponent } from './filtros-bandeja-log.component';

describe('FiltrosBandejaLogComponent', () => {
  let component: FiltrosBandejaLogComponent;
  let fixture: ComponentFixture<FiltrosBandejaLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosBandejaLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosBandejaLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
