import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SidebarMenu, SidebarMenuItem } from '../control-center-sidebar-menu/control-center-sidebar-menu.component';
import {Params, Router} from '@angular/router';
import {Device} from 'src/app/api/devices/device';
import { MessageService } from '../message-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-control-center-computer-menu',
  templateUrl: './control-center-computer-menu.component.html',
  styleUrls: ['./control-center-computer-menu.component.scss']
})
export class ControlCenterComputerMenuComponent implements OnInit, OnDestroy {

  @Input() messages: any[];

  subscription: Subscription;

  @Input() menu: SidebarMenu;
  @Input() expanded!: boolean;
  @Output() expandChange = new EventEmitter<boolean>();

  @Input() devices: Device[];

  // 0: off = Offline
  // 1: on = Online
  // 2: amoff = Am Einschalten
  // 3: amon = Am Ausschalten
  states: any[] = [];

  constructor(private router: Router, private messageService: MessageService, private cdRef: ChangeDetectorRef) {
    this.subscription = this.messageService.onMessage().subscribe(message => {
      var msg = this.messages.find((msg) => {
        return msg.uuid === message.uuid;
      })
      if (msg !== undefined) {
        this.messages.splice(this.messages.indexOf(msg), 1, message)
      } else {
        this.messages.push(message);
      }
      this.updatePcState();

    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.updatePcState();
  }

  updatePcState() {

    if (this.devices !== undefined) {
      this.devices.forEach(device => {
        const msg = this.messages.find((msg) => {
          return msg.uuid === device.uuid;
        });
        if (msg !== undefined) {
          const pcItem = this.states.filter(
            pc => pc.uuid === msg.uuid
          );
          const index = this.states.indexOf(pcItem[0]);
          if (index !== -1) {
            if (msg.text === "off") this.states[index] = ({uuid: msg.uuid, state: 0})
            else if (msg.text === "on") this.states[index] = ({uuid: msg.uuid, state: 1})
            else if (msg.text === "amoff") this.states[index] = ({uuid: msg.uuid, state: 2})
            else if (msg.text === "amon") this.states[index] = ({uuid: msg.uuid, state: 3})
            else console.warn("Can't read state of pc: " + msg.uuid)
          } else {
            if (msg.text === "off") this.states.push({uuid: msg.uuid, state: 0})
            else if (msg.text === "on") this.states.push({uuid: msg.uuid, state: 1})
            else if (msg.text === "amoff") this.states.push({uuid: msg.uuid, state: 2})
            else if (msg.text === "amon") this.states.push({uuid: msg.uuid, state: 3})
            else console.warn("Can't read state of pc: " + msg.uuid)
          }
  
          
        } else {
          if (!device.powered_on) this.states.push({uuid: device.uuid, state: 0})
          else this.states.push({uuid: device.uuid, state:1})
        }
      });
    } 

    
  }

  itemClicked(item: SidebarMenuItem) {
    this.router.navigate([item.routerLink], {queryParams: item.queryParams}).then();
    this.expanded = false;
    this.expandChange.emit(this.expanded);
  }

  newPcClicked() {
    this.router.navigate(['/create-device']).then();
    this.expanded = false;
    this.expandChange.emit(this.expanded);
  }

  isItemActive(item: SidebarMenuItem) {
    // had to do this without routerLinkActive because of the lack of https://github.com/angular/angular/issues/31154
    if (!item.routerLink) {
      return false;
    }
    if (this.router.isActive(this.router.createUrlTree([item.routerLink], {queryParams: item.queryParams}), false)) {
      return true;
    }
     return false;
  }

}
