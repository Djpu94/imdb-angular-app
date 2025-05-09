import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'IMDb Movies CRUD';

  constructor(private router: Router) { }

  navigateToList(): void {
    this.router.navigate(['/']);
  }

  navigateToAdd(): void {
    this.router.navigate(['/movies/add']);
  }
}