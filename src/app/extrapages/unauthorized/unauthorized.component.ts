import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
  standalone: true,
  imports: [],
})
export class UnauthorizedComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Par exemple, tu peux enlever une classe sur le body si besoin
    document.body.classList.remove('auth-body-bg');
  }

  goToLogin() {
    this.router.navigate(['/auth']);
  }
}


