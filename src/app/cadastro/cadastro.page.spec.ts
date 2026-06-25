import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroPage } from './cadastro.page';
import { UsuarioService } from '../services/usuario.service';

describe('CadastroPage', () => {
  let component: CadastroPage;
  let fixture: ComponentFixture<CadastroPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UsuarioService,
          useValue: { getUsuarioLogado: () => null }
        }
      ]
    });
    fixture = TestBed.createComponent(CadastroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
