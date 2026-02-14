import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IUser } from '../../interfaces';

@Component({
  selector: 'app-users-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './users-card.html',
  styleUrl: './users-card.css',
})
export class UsersCardComponent {
  @Input() user!: IUser;
  @Output() onDelete = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<IUser>();

  showDeleteConfirm = signal(false);

  confirmDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }

  executeDelete(): void {
    this.onDelete.emit(this.user._id);
    this.showDeleteConfirm.set(false);
  }

  editUser(): void {
    this.onEdit.emit(this.user);
  }

  getRoleBadgeClass(): string {
    switch (this.user.rol) {
      case 'administrador': return 'badge-admin';
      case 'investigador': return 'badge-investigador';
      case 'colaborador': return 'badge-colaborador';
      default: return '';
    }
  }
}
