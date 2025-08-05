import { WizardState } from '../wizard-state';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'wizard-current-slide',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './current-slide.html',
  styleUrl: './current-slide.scss',
})
export class CurrentSlide {
  constructor(public wizardState: WizardState) {}
}
