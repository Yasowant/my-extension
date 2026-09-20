import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
})
export class UserComponent {
  @Input() name = 'Ada';
  active: boolean = true;
  select(): void {
    this.active = !this.active;
  }
}
