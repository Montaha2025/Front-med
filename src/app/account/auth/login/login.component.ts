import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';  // Ajout de ActivatedRoute
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})

export class LoginComponent implements OnInit {
  
 
  loginForm: FormGroup<{
    email: FormControl<string>,
    motDePasse: FormControl<string>
  }>;

  submitted: boolean = false;
  error: string = '';
  returnUrl: string = '';
  fieldTextType: boolean = false;

  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,  // Injection d'ActivatedRoute ici
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    // Vérifie si l'utilisateur est déjà connecté
    if (localStorage.getItem('jwtToken')) {
      this.router.navigate(['/']);
    }
  
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required]]
    });
    
  
    // Retour de l'URL
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  

  // Récupération des contrôles de formulaire pour simplifier l'accès
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const email = this.f['email'].value;
    const motDePasse = this.f['motDePasse'].value;  

    // Appel à l'API pour la connexion
    this.authenticationService.login({ email, motDePasse }).subscribe({
      next: (response) => {
        if (response && response.token) {
          // Sauvegarde du token et des rôles dans localStorage
          this.authenticationService.saveToken(response.token);
          if (response.roles) {
            this.authenticationService.saveUserRoles(response.roles);
          }
          // Redirection vers la page d'accueil ou vers l'URL souhaitée
          this.router.navigate([this.returnUrl]);
        } else {
          this.error = 'Authentification échouée. Vérifiez vos identifiants.';
        }
      },
      error: (err) => {
        this.error = 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
      }
    });
  }

  // Fonction pour afficher/masquer le mot de passe
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}


