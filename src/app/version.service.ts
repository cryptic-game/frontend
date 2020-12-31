import { Injectable } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  CURRENT_VERSION = 'Pre-Alpha 2.0';

  availableUpdate: UpdateAvailableEvent;

  previousVersion: string;
  justUpdated = false;

  constructor(private updates: SwUpdate) {
    if (this.CURRENT_VERSION !== localStorage.getItem('app_version')) {
      this.previousVersion = localStorage.getItem('app_version');
      this.justUpdated = true;
      localStorage.setItem('app_version', this.CURRENT_VERSION);
    }

    if (updates.isEnabled) {
      updates.available.subscribe(update => {
        this.availableUpdate = update;
      });
      updates.activated.subscribe(update => {
        console.log(`Update to ${update.current.appData['version']} successful.`);
        localStorage.setItem('app_hash', update.current.hash);
        this.justUpdated = true;
      });
    }
  }

  cancelUpdate() {
    this.availableUpdate = null;
  }

  updateAndReload() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }

  updateRead() {
    this.justUpdated = false;
  }

}
