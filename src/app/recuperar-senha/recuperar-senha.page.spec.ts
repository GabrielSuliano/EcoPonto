import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarSenhaPage } from './recuperar-senha.page';
import { UsuarioService } from '../services/usuario.service';

describe('RecuperarSenhaPage', () => {
  let component: RecuperarSenhaPage;
  let fixture: ComponentFixture<RecuperarSenhaPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UsuarioService,
          useValue: { enviarEmailRecuperacaoSenha: () => Promise.resolve() }
        }
      ]
    });
    fixture = TestBed.createComponent(RecuperarSenhaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
