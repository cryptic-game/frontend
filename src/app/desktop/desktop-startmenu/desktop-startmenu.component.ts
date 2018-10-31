import { Account } from '../../../dataclasses/account.class';
import { UserService } from '../user.service';
import { Component, Input, OnInit } from '@angular/core';

import { Program } from '../../../dataclasses/program.class';

@Component({
  selector: 'app-desktop-startmenu',
  templateUrl: './desktop-startmenu.component.html',
  styleUrls: ['./desktop-startmenu.component.scss']
})
export class DesktopStartmenuComponent implements OnInit {
  constructor(public userService: UserService) {}

  @Input()
  linkages: Program[] = [];

  @Input()
  target;

  searchTerm = '';

  token: string = localStorage.getItem('token');

  user: Account = new Account('', '');

  ngOnInit() {
    this.userService.owner(this.token).subscribe((data: any) => {
      if (data['error'] !== undefined) {
        console.log(data['error']);
      } else {
        this.user.setName(data.owner.username);
        this.user.setEmail(data.owner.email);
      }
    });
  }

  search(term: string) {
    return this.linkages.filter(item =>
      item
        .getDisplayName()
        .trim()
        .toLowerCase()
        .match(term.trim().toLowerCase())
    );
  }
}
