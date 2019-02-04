import {Account} from '../../../dataclasses/account';
import {UserService} from '../user.service';
import {Component, Input, OnInit} from '@angular/core';
import {DesktopComponent} from '../desktop.component';

@Component({
  selector: 'app-desktop-startmenu',
  templateUrl: './desktop-startmenu.component.html',
  styleUrls: ['./desktop-startmenu.component.scss']
})
export class DesktopStartmenuComponent implements OnInit {
  constructor(public userService: UserService) {
  }

  @Input() parent: DesktopComponent;

  @Input() target;

  searchTerm = '';

  token: string = localStorage.getItem('token');

  user: Account = {name: '', email: ''};

  ngOnInit() {
    this.userService.owner(this.token).subscribe((data: any) => {
      if (data['error'] !== undefined) {
        console.log(data['error']);
      } else {
        this.user.name = data.owner.username;
        this.user.email = data.owner.email;
      }
    });
  }

  search(term: string) {
    return this.parent.linkages.filter(item => item
      .displayName
      .trim()
      .toLowerCase()
      .match(term.trim().toLowerCase())
    );
  }
}
