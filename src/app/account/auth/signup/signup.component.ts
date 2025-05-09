import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Register } from 'src/app/store/Authentication/authentication.actions';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from 'src/app/core/services/utilisateur.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone:true,
  imports:[CommonModule,FormsModule,ReactiveFormsModule]
})
export class SignupComponent implements OnInit {

  signupForm: UntypedFormGroup;
  submitted: any = false;
  error: any = '';
  successmsg: any = false;
 

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private utilisateurService: UtilisateurService, public store: Store) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
      age: ['', Validators.required],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],

    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    console.log("Form submitted")
    this.submitted = true;

    // Stop if form is invalid
    if (this.signupForm.invalid) {
        return;
    }

    const nom = this.f['nom'].value; 
    const prenom = this.f['prenom'].value; 
    const email = this.f['email'].value;
    const motDePasse = this.f['motDePasse'].value;
    const age = this.f['age'].value;
    const telephone = this.f['telephone'].value;
    const adresse = this.f['adresse'].value;

    // Dispatch Action (sending to the backend)
    this.store.dispatch(Register({
        nom: nom,
        prenom: prenom,
        email: email,
        motDePasse: motDePasse,
        age: age,
        telephone: telephone,
        adresse: adresse
    }));
}

}
