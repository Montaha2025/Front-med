import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, effect } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup<{
    email: FormControl<string>;
    motDePasse: FormControl<string>;
  }>;

  submitted = false;
  error = '';
  returnUrl = '';
  fieldTextType = false;

  year = new Date().getFullYear();


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    // Rediriger si déjà connecté
    if (this.authenticationService.token()) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required]],
    });
   

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Réagir à une erreur éventuelle
    effect(() => {
      const error = this.authenticationService.error();
      if (error) {
        this.error = error;
      }
    }); }

   
     


  get f() {
    return this.loginForm.controls;
  }



onSubmit() {
  this.submitted = true;

  if (this.loginForm.invalid) {
    return;
  }

  const email = this.f['email'].value;
  const motDePasse = this.f['motDePasse'].value;

  this.authenticationService.login(email, motDePasse).subscribe({
    next: (res) => {
      if (res.token) {
        localStorage.setItem('jwtToken', res.token);
        this.router.navigate([this.returnUrl]);
      }
    },
    error: (err) => {
      console.error('Erreur lors de la connexion', err);
      this.error = 'Erreur lors de la connexion';
    }
  });
}


  

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}




