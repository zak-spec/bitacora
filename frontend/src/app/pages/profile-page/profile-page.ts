import { Component } from '@angular/core';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePageComponent {
  constructor(public authStore: AuthStore) {}
}
