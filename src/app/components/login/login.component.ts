import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Params, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public page_title: string;
  public user: User;
  public status: string;
  public token;
  public identity;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = 'Identifícate';
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
  }

  ngOnInit(): void {
    // Se ejecuta siempre pero sólo cierra la sesión cuando le llega el parámetro 'sure' por la URL
    this.logout();
  }

  onSubmit(form) {
    this._userService.signup(this.user).subscribe(
      response => {
        // TOKEN
        if (response.status != 'error') {
          this.status = 'success';
          this.token = response;

          // OBJETO USUARIO IDENTIFICADO
          this._userService.signup(this.user, true).subscribe(
            response => {
              this.identity = response;

              // Persistir datos usuario identificado
              console.log(this.token);
              console.log(this.identity);
              localStorage.setItem('token', this.token);
              localStorage.setItem('identity', JSON.stringify(this.identity));

              // Redireccionar a Inicio
              this._router.navigate(['inicio']);
            },
            error => {
              this.status = 'error';
              console.log(<any>error);
            }
          )
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    )
  }

  logout() {
    this._route.params.subscribe(params => {
      let logout = Number(params['sure']);

      if (logout == 1) {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity = null;
        this.token = null;

        // Redireccionar a Inicio
        this._router.navigate(['inicio']);
      }
    });
  }

}
