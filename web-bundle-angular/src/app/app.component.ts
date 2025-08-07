import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WizardUi } from '../wizard-ui/wizard-ui.component';
import { Header } from '../header/header.component';
import { Terminal } from '../terminal/terminal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WizardUi, Terminal],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {}
