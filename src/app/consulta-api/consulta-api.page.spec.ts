import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaApiPage } from './consulta-api.page';
import { ColetaPontosService } from '../services/coleta-pontos.service';

describe('ConsultaApiPage', () => {
  let component: ConsultaApiPage;
  let fixture: ComponentFixture<ConsultaApiPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ColetaPontosService,
          useValue: { getPontosDaApi: () => Promise.resolve([]) }
        }
      ]
    });
    fixture = TestBed.createComponent(ConsultaApiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
