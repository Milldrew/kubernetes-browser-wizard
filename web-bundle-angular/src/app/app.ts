import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WizardUi } from '../wizard-ui/wizard-ui';
import { Header } from '../header/header';
import { Terminal } from '../terminal/terminal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WizardUi, Header, Terminal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
