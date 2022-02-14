import {Component, OnInit, Type} from '@angular/core';
import {WindowComponent, WindowConstraints, WindowDelegate} from '../../window/window-delegate';
import {WebsocketService} from '../../../websocket.service';
import {FormControl, Validators} from '@angular/forms';
import {Observable, of, timer} from 'rxjs';
import {catchError, debounce, map} from 'rxjs/operators';

@Component({
  selector: 'app-miner',
  templateUrl: './miner.component.html',
  styleUrls: ['./miner.component.scss']
})
export class MinerComponent extends WindowComponent implements OnInit {

  active = false;
  power = 0.0;
  miningRate = 0.0;
  started: number;

  walletControl: FormControl = new FormControl('', [
    Validators.required, Validators.pattern(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/)
  ]);
  wallet: string | undefined;
  errorMessage: string;

  minerPower: FormControl = new FormControl(0, [
    Validators.required, Validators.min(0), Validators.max(100)
  ]);

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

    this.minerPower.valueChanges.pipe(debounce(() => timer(500))).subscribe(data => {
      if (this.minerPower.valid) {
        this.update(data);
      } else {
        this.update(0);
      }
    });

    this.websocketService.ms('service', ['list'], {
      'device_uuid': this.delegate.device.uuid,
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

  get() {
    if (this.miner) {
      this.websocketService.ms('service', ['miner', 'get'], {
        'service_uuid': this.miner.uuid,
      }).subscribe(data => {
        this.setWallet(data['wallet']);
        this.started = data['started'];
        this.setPower(Math.round(data['power'] * 100));
      });
    }
  }

  private createMiner(wallet: string): Observable<void> {
    if (!this.miner) {
      return this.websocketService.ms('service', ['create'], {
        'device_uuid': this.delegate.device.uuid,
        'name': 'miner',
        'wallet_uuid': wallet,
      }).pipe(
        map(createData => {
          this.errorMessage = null!;

          this.miner = createData;
          this.miningRate = createData.speed;
          this.setWallet(wallet);
          this.get();
        }),
        catchError(() => {
          this.setError('Invalid wallet');
          return of<void>();
        }));
    }
    return undefined!;
  }

  private updateMinerWallet(wallet: string): void {
    if (!this.miner) {
      this.createMiner(wallet).subscribe(() => this.updateMinerWallet);
    } else {
      this.websocketService.ms('service', ['miner', 'wallet'], {
        'service_uuid': this.miner.uuid,
        'wallet_uuid': wallet,
      }).subscribe({
        next: (walletData) => {
          this.errorMessage = undefined!;
          this.setWallet(wallet);
          this.setPower(walletData.power);
          this.get();
        },
        error: () => {
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
        this.setPower(Math.round(data.power * 100), false);
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
    setTimeout(() => this.errorMessage = undefined!, 5000);
  }

  private setWallet(uuid: string | undefined): void {
    this.wallet = uuid;
    if (uuid) {
      this.walletControl.setValue(uuid, {emitEvent: false});
    }
  }

  private setPower(power: number, syncSlider = true): void {
    this.power = power;
    this.active = power > 0;
    if (syncSlider) {
      this.minerPower.setValue(power, {emitEvent: false});
    }
  }
}

export class MinerWindowDelegate extends WindowDelegate {
  public title = 'Miner';
  public icon = 'assets/desktop/img/morphcoin_dark.svg';
  public type: Type<any> = MinerComponent;

  public override constraints = new WindowConstraints({singleInstance: true, resizable: false, maximizable: false});

  constructor() {
    super();
    this.position.width = 450;
    this.position.height = 320;
  }
}
