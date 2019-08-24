import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { WindowComponent, WindowDelegate } from '../../window/window-delegate';
import { WebsocketService } from '../../../websocket.service';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-miner',
  templateUrl: './miner.component.html',
  styleUrls: ['./miner.component.scss']
})
export class MinerComponent extends WindowComponent implements OnInit, OnDestroy {

  active = false;
  power = 0.0;
  started;

  wallet: string;

  errorMessage: string;

  activeDevice: string;
  miner;

  sendingData = false;

  constructor(private websocketService: WebsocketService) {
    super();
  }

  ngOnInit() {
    this.activeDevice = JSON.parse(sessionStorage.getItem('activeDevice'))['uuid'];
    this.websocketService.ms('service', ['list'], {
      'device_uuid': this.activeDevice,
    }).subscribe((listData) => {
      listData.services.forEach((service) => {
        if (service.name === 'miner') {
          this.miner = service;
          this.get();
        }
      });
    });

    this.events.asObservable().subscribe((event) => {
      if (event === 'close') {
        this.power = 0;
        this.active = false;

        this.update();
      }
    });
  }

  ngOnDestroy() {
    this.active = false;
    this.power = 0;

    this.update();
  }

  createMiner(wallet) {
    if (!this.miner) {
      this.websocketService.ms('service', ['create'], {
        'device_uuid': this.activeDevice,
        'name': 'miner',
        'wallet_uuid': wallet,
      }).subscribe((createData) => {
        if (!('error' in createData)) {
          this.errorMessage = null;

          this.miner = createData;
          this.get();
        } else {
          this.errorMessage = 'Invalid wallet';
        }
      });
    }
  }

  updateMinerWallet(wallet) {
    if (this.miner) {
      this.websocketService.ms('service', ['miner', 'wallet'], {
        'service_uuid': this.miner.uuid,
        'wallet_uuid': wallet,
      }).subscribe((walletData) => {
        if (!('error' in walletData)) {
          this.errorMessage = null;

          this.miner = walletData;
        } else {
          this.errorMessage = 'Invalid wallet';
        }
        this.get();
      });
    }
  }

  get() {
    if (this.miner) {
      this.websocketService.ms('service', ['miner', 'get'], {
        'service_uuid': this.miner.uuid,
      }).subscribe((getData) => {
        this.wallet = getData['wallet'];
        this.started = getData['started'];
        this.power = getData['power'] * 100;
        this.active = this.power > 0 && this.started != null;
      });
    }
  }

  update() {
    if (this.miner) {
      if (this.active && this.power === 0.0) {
        this.power = 100;
      }

      if (!this.active) {
        this.power = 0;
      }

      if (!this.sendingData) {
        this.sendingData = true;

        this.websocketService.ms('service', ['miner', 'power'], {
          'service_uuid': this.miner.uuid,
          'power': this.power / 100,
        });

        setTimeout(() => {
          this.sendingData = false;
        }, 1000);
      }
    }
  }

  checkWallet() {
    if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(this.wallet)) {
      if (this.miner) {
        this.updateMinerWallet(this.wallet);
      } else {
        this.createMiner(this.wallet);
      }
    }
  }

}

export class MinerWindowDelegate extends WindowDelegate {
  title = 'Miner';
  icon = 'assets/desktop/img/morphcoin_dark.svg';
  type: Type<any> = MinerComponent;
}
