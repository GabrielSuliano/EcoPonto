import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home.page';
import { ColetaPontosService } from '../services/coleta-pontos.service';
import { UsuarioService } from '../services/usuario.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ColetaPontosService,
          useValue: { getPontos: () => Promise.resolve([]) }
        },
        {
          provide: UsuarioService,
          useValue: { getUsuarioLogado: () => null }
        }
      ]
    });
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
