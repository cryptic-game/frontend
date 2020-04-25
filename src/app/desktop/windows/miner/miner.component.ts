import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';
import { WebsocketService } from '../../../websocket.service';
import { FormControl, Validators } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { debounce, map } from 'rxjs/operators';

@Component({
  selector: 'app-miner',
  templateUrl: './miner.component.html',
  styleUrls: ['./miner.component.scss']
})
export class MinerComponent extends WindowComponent implements OnInit, OnDestroy {

  active = false;
  power = 0.0;
  miningRate = 0.0;
  started;

  walletControl: FormControl = new FormControl('', [
    Validators.required, Validators.pattern(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/)
  ]);
  wallet: string;
  errorMessage: string;

  minerPower: FormControl = new FormControl(0, [
    Validators.required, Validators.min(0), Validators.max(100)
  ]);

  activeDevice: string;
  miner;

  constructor(private websocketService: WebsocketService) {
    super();
  }

  ngOnInit() {
    this.walletControl.valueChanges.pipe(
      map(data => {
        this.setWallet(undefined);
        return data;
      }),
      debounce(() => timer(300))
    ).subscribe(data => {
      if (this.walletControl.valid) {
        this.updateMinerWallet(data);
      }
    });

    this.minerPower.valueChanges.pipe(debounce(() => timer(300))).subscribe(data => {
      if (this.minerPower.valid) {
        this.update(data);
      } else {
        this.update(0);
      }
    });

    this.activeDevice = JSON.parse(sessionStorage.getItem('activeDevice'))['uuid'];
    this.websocketService.ms('service', ['list'], {
      'device_uuid': this.activeDevice,
    }).subscribe((listData) => {
      listData.services.forEach((service) => {
        if (service.name === 'miner') {
          this.miner = service;
          this.miningRate = service.speed;
          this.get();
        }
      });
    });
  }

  ngOnDestroy() {
  }

  get() {
    if (this.miner) {
      this.websocketService.ms('service', ['miner', 'get'], {
        'service_uuid': this.miner.uuid,
      }).subscribe(data => {
        this.setWallet(data['wallet']);
        this.started = data['started'];
        this.setPower(Math.round(data['power'] * 100));
        this.active = this.power > 0 && this.started != null;
      });
    }
  }

  private createMiner(wallet: string): Observable<void> {
    if (!this.miner) {
      return this.websocketService.ms('service', ['create'], {
        'device_uuid': this.activeDevice,
        'name': 'miner',
        'wallet_uuid': wallet,
      }).pipe(map(createData => {
        if (!('error' in createData)) {
          this.errorMessage = null;

          this.miner = createData;
          this.miningRate = createData.speed;
          this.setWallet(wallet);
          this.get();
        } else {
          this.setError('Invalid wallet');
        }
      }));
    }
    return undefined;
  }

  private updateMinerWallet(wallet: string): void {
    if (!this.miner) {
      this.createMiner(wallet).subscribe(() => this.updateMinerWallet);
    } else {
      this.websocketService.ms('service', ['miner', 'wallet'], {
        'service_uuid': this.miner.uuid,
        'wallet_uuid': wallet,
      }).subscribe((walletData) => {
        if (!('error' in walletData)) {
          this.errorMessage = undefined;
          this.setWallet(wallet, false);
          this.setPower(walletData.power);
          this.get();
        } else {
          this.setError('Invalid wallet');
        }
      });
    }
  }

  private update(power: number): void {
    if (this.miner) {
      this.websocketService.ms('service', ['miner', 'power'], {
        'service_uuid': this.miner.uuid,
        'power': power / 100,
      }).subscribe((data: { power: number }) => {
        this.setPower(Math.round(data.power * 100));
        this.websocketService.ms('service', ['private_info'], {
          'device_uuid': this.miner.device,
          'service_uuid': this.miner.uuid
        }).subscribe(service => {
          this.miner = service;
          this.miningRate = service.speed;
        });
      });
    }
  }

  private setError(error: string): void {
    this.errorMessage = error;
    this.wallet = undefined;
    setTimeout(() => this.errorMessage = undefined, 5000);
  }

  private setWallet(uuid: string, slider?: boolean): void {
    this.wallet = uuid;
    if (uuid && !slider) {
      this.walletControl.setValue(uuid, { emitEvent: false });
    }
  }

  private setPower(power: number): void {
    this.power = power;
    this.minerPower.setValue(power, { emitEvent: false });
  }
}

export class MinerWindowDelegate extends WindowDelegate {
  public title = 'Miner';
  public icon = 'assets/desktop/img/morphcoin_dark.svg';
  public type: Type<any> = MinerComponent;

  public constraints = new WindowConstraints({ singleInstance: true, resizable: false, maximizable: false });

  constructor() {
    super();
    this.position.width = 450;
    this.position.height = 320;
  }
}
