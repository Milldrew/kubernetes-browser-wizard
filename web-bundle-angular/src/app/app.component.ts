import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WizardUi } from '../wizard-ui/wizard-ui.component';
import { Header } from '../header/header.component';
import { Terminal } from '../terminal/terminal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CoreStateService } from '../core-state.service';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    WizardUi,
    Terminal,
    MatButtonModule,
    MatIconModule,
    Header,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  constructor(public coreState: CoreStateService) {}
}
