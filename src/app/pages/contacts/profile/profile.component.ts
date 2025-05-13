import { Component, OnInit } from '@angular/core';

import { revenueBarChart, statData } from './data';

import { ChartType } from './profile.model';
import { CommonModule } from '@angular/common';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { UtilisateurService } from '../../../core/services/utilisateur.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone:true,
  imports:[CommonModule,PagetitleComponent,NgApexchartsModule]
})

/**
 * Contacts-profile component
 */
export class ProfileComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
id:any;
currentUser:any;
  revenueBarChart: ChartType;
  statData:any;
  constructor(private authService:AuthenticationService,private utilisateurService:UtilisateurService) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Profile', active: true }];
    // decode token pour avoir id
    // 
this.id=this.authService.getIdFromToken();
console.log("current id:",this.id);
this.utilisateurService.findUtilisateurById(this.id);
//console.log("current user:",this.utilisateurService.utilisateur);

    // fetches the data
    this._fetchData();
  }

  /**
   * Fetches the data
   */
  private _fetchData() {
    this.revenueBarChart = revenueBarChart;
    this.statData = statData;
  }
}








