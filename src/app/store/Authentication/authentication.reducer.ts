import { createReducer, on } from '@ngrx/store';
import {
  Register,
  RegisterFailure,
  RegisterSuccess,
  login,
  loginFailure,
  loginSuccess,
  logout
} from './authentication.actions';
import { User } from './auth.models';

export interface AuthenticationState {
  isLoggedIn: boolean;
  user: User | null;
  error: string | null;
  successMessage: string | null;
}

const initialState: AuthenticationState = {
  isLoggedIn: false,
  user: null,
  error: null,
  successMessage: null
};

export const authenticationReducer = createReducer(
  initialState,

  // 🔁 REGISTER
  on(Register, (state) => ({
    ...state,
    error: null,
    successMessage: null
  })),

  on(RegisterSuccess, (state, { user }) => ({
    ...state,
    isLoggedIn: true,
    user,
    error: null,
    successMessage: 'Inscription réussie !'
  })),

  on(RegisterFailure, (state, { error }) => ({
    ...state,
    error,
    successMessage: null
  })),

  // 🔁 LOGIN
  on(login, (state) => ({
    ...state,
    error: null,
    successMessage: null
  })),

  on(loginSuccess, (state, { user }) => ({
    ...state,
    isLoggedIn: true,
    user,
    error: null,
    successMessage: 'Connexion réussie !'
  })),

  on(loginFailure, (state, { error }) => ({
    ...state,
    error,
    successMessage: null
  })),

  // 🔁 LOGOUT
  on(logout, (state) => ({
    ...state,
    user: null,
    isLoggedIn: false,
    successMessage: null,
    error: null
  }))
);

