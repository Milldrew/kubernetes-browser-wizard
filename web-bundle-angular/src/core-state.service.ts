import { Injectable } from '@angular/core';

// ip address table data

@Injectable({
  providedIn: 'root',
})
export class CoreStateService {
  showClusterIpInfo = false;
  showWizardAndTerminal = false;
  hasClusterIpInfo = false;
  showTerminal() {
    this.showWizardAndTerminal = true;
  }
  showClusterIpInfoNow() {
    this.showClusterIpInfo = true;
  }
}
