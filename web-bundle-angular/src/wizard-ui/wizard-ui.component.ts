import { Component } from '@angular/core';
import { CurrentSlide } from './current-slide/current-slide.component';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RECIPES, Recipe } from './wizard-ui.constants';
import { JsonPipe } from '@angular/common';
import { WizardState } from './wizard-state.service';

@Component({
  selector: 'wizard-wizard-ui',
  imports: [
    CurrentSlide,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './wizard-ui.component.html',
  styleUrl: './wizard-ui.component.scss',
})
export class WizardUi {
  constructor(public wizardState: WizardState) {}
  foods: Recipe[] = RECIPES;
  selectedFood = RECIPES[0];
}
