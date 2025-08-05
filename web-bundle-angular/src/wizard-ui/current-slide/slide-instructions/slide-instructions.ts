import { Component } from '@angular/core';
import { WizardState } from '../../wizard-state';
import { Slide } from '../../wizard-ui.constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'wizard-slide-instructions',
  imports: [CommonModule],
  templateUrl: './slide-instructions.html',
  styleUrl: './slide-instructions.scss',
})
export class SlideInstructions {
  constructor(public wizardState: WizardState) {}
  copyButtonText = 'Copy';

  ngOnInit() {}

  async copyCommand() {
    try {
      await navigator.clipboard.writeText(
        this.wizardState.currentSlide.command,
      );
      this.copyButtonText = 'Copied!';
      setTimeout(() => {
        this.copyButtonText = 'Copy';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
      this.copyButtonText = 'Failed';
      setTimeout(() => {
        this.copyButtonText = 'Copy';
      }, 2000);
    }
  }
}
