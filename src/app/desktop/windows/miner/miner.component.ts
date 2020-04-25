import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { WindowComponent, WindowDelegate } from '../../window/window-delegate';
import { WebsocketService } from '../../../websocket.service';
import { FormControl, Validators } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { debounce, map } from 'rxjs/operators';

// noinspection AngularMissingOrInvalidDeclarationInModule
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
          this.errorMessage = 'Invalid wallet';
          this.wallet = undefined;
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
          this.minerPower = walletData.speed;

          // this.miner = walletData;
          this.setWallet(wallet);
        } else {
          this.errorMessage = 'Invalid wallet';
          this.wallet = undefined;
        }
        this.get();
      });
    }
  }

  get() {
    if (this.miner) {
      this.websocketService.ms('service', ['miner', 'get'], {
        'service_uuid': this.miner.uuid,
      }).subscribe(data => {
        this.setWallet(data['wallet']);
        this.started = data['started'];
        this.power = Math.round(data['power'] * 100);
        this.active = this.power > 0 && this.started != null;
      });
    }
  }

  private update(power: number): void {
    if (this.miner) {
      this.websocketService.ms('service', ['miner', 'power'], {
        'service_uuid': this.miner.uuid,
        'power': power / 100,
      }).subscribe((data: { power: number }) => {
        console.log(data.power);
        this.websocketService.ms('service', ['private_info'], {
          'device_uuid': this.miner.device,
          'service_uuid': this.miner.uuid
        }).subscribe(service => {
          this.miner = service;
          this.miningRate = service.speed;
          console.log(service);
        });
      });
    }
  }

  private setWallet(uuid: string): void {
    this.wallet = uuid;
    this.walletControl.setValue(uuid, { emitEvent: false });
  }
}

export class MinerWindowDelegate extends WindowDelegate {
  title = 'Miner';
  icon = 'assets/desktop/img/morphcoin_dark.svg';
  type: Type<any> = MinerComponent;
}
