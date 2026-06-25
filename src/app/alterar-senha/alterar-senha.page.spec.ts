import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlterarSenhaPage } from './alterar-senha.page';
import { UsuarioService } from '../services/usuario.service';

describe('AlterarSenhaPage', () => {
  let component: AlterarSenhaPage;
  let fixture: ComponentFixture<AlterarSenhaPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UsuarioService,
          useValue: { alterarSenhaUsuarioLogado: () => Promise.resolve() }
        }
      ]
    });
    fixture = TestBed.createComponent(AlterarSenhaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
