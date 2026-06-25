import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenciarAdministradoresPage } from './gerenciar-administradores.page';
import { UsuarioService } from '../services/usuario.service';

describe('GerenciarAdministradoresPage', () => {
  let component: GerenciarAdministradoresPage;
  let fixture: ComponentFixture<GerenciarAdministradoresPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            listarUsuarios: () => Promise.resolve([]),
            alterarTipoUsuario: () => Promise.resolve()
          }
        }
      ]
    });
    fixture = TestBed.createComponent(GerenciarAdministradoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
