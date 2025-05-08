import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, exhaustMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthenticationService } from '../../core/services/auth.service';
import {
  login, loginSuccess, loginFailure,
  logout, logoutSuccess,
  Register, RegisterSuccess, RegisterFailure
} from './authentication.actions';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { UserProfileService } from 'src/app/core/services/user.service';

@Injectable()
export class AuthenticationEffects {

  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Register),
      exhaustMap(({ nom, prenom, email, motDePasse, age, telephone, adresse }) => {
        return this.AuthenticationService.register({
          nom, prenom, email, motDePasse, age, telephone, adresse
        }).pipe(
          map((user) => {
            this.router.navigate(['/auth/login']);
            return RegisterSuccess({ user });
          }),
          catchError((error) => of(RegisterFailure({ error: error.message || 'Erreur inscription' })))
        );
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, motDePasse }) => {
        return this.AuthenticationService.login(email, motDePasse).pipe(
          map((user) => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', user.token);
            this.router.navigate(['/']);
            return loginSuccess({ user });
          }),
          catchError((error) => of(loginFailure({ error })))
        );
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.router.navigate(['/auth/login']);
      }),
      map(() => logoutSuccess())
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    private AuthenticationService: AuthenticationService,
    private userService: UserProfileService,
    private router: Router
  ) { }
}
