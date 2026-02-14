import { Component } from '@angular/core';
import { LayoutComponent } from './components/layout/layout';

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  template: '<app-layout />',
})
export class App {}
