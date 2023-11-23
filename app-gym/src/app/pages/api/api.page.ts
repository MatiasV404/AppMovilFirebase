// api.page.ts
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-api',
  templateUrl: './api.page.html',
  styleUrls: ['./api.page.scss'],
})
export class ApiPage implements OnInit {
  users: any[];

  apiService = inject(ApiService);

  constructor(private router: Router) {}

  navigateToAuth() {
    this.router.navigate(['/auth']);
  }

  ngOnInit() {
    this.apiService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
}
