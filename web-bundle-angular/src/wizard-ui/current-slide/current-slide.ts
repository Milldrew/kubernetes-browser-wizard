import { WizardState } from '../wizard-state';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SlideInstructions } from './slide-instructions/slide-instructions';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'wizard-current-slide',
  imports: [MatButtonModule, MatIconModule, SlideInstructions, JsonPipe],
  templateUrl: './current-slide.html',
  styleUrl: './current-slide.scss',
})
export class CurrentSlide {
  constructor(public wizardState: WizardState) {}
}
