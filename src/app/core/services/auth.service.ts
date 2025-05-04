// // */ import { Injectable } from '@angular/core';

// import { getFirebaseBackend } from '../../authUtils';
// import { User } from 'src/app/store/Authentication/auth.models';
// import { from, map } from 'rxjs';


// @Injectable({ providedIn: 'root' })

// export class AuthenticationService {

//     user: User;

//     constructor() {
//     }

//     /**
//      * Returns the current user
//      */
//     public currentUser(): User {
//         return getFirebaseBackend().getAuthenticatedUser();
//     }


//     /**
//      * Performs the auth
//      * @param email email of user
//      * @param password password of user
//      */
//     login(email: string, password: string) {
//         return from(getFirebaseBackend().loginUser(email, password).pipe(map(user => {
//             return user;
//         }
//         )));
//     }

//     /**
//      * Performs the register
//      * @param email email
//      * @param password password
//      */
//     register(user: User) {
//         // return from(getFirebaseBackend().registerUser(user));

//         return from(getFirebaseBackend().registerUser(user).then((response: any) => {
//             const user = response;
//             return user;
//         }));
//     }

//     /**
//      * Reset password
//      * @param email email
//      */
//     resetPassword(email: string) {
//         return getFirebaseBackend().forgetPassword(email).then((response: any) => {
//             const message = response.data;
//             return message;
//         });
//     }

//     /**
//      * Logout the user
//      */
//     logout() {
//         // logout the user
//         getFirebaseBackend().logout();
//     }
// } //



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode'; 

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = "http://localhost:8081/api/v1/auth/login";

  constructor(private http: HttpClient, private router: Router) {}

  login(identifiants: { email: string, motDePasse: string }): Observable<any> {
    return this.http.post(this.apiUrl, identifiants);
  }

  saveToken(token: string): void {
    localStorage.setItem("jwtToken", token);
  }

  getToken(): string | null {
    return localStorage.getItem("jwtToken");
  }

  removeToken(): void {
    localStorage.removeItem("jwtToken");
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const decoded: any = jwt_decode(token); 
      return decoded.role || '';
    } catch (error) {
      console.error("Erreur de décodage du token :", error);
      return '';
    }
  }
  saveUserRoles(roles: string[]): void {
    localStorage.setItem('userRoles', JSON.stringify(roles));
  }

 
  

  logout(): void {
    localStorage.clear();
    this.router.navigate(["/auth"]);
  }
}



