import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-center-changelog-page',
  templateUrl: './control-center-changelog-page.component.html',
  styleUrls: ['./control-center-changelog-page.component.scss']
})
export class ControlCenterChangelogPageComponent implements OnInit {

  versions = [{
    name: 'Pre-Alpha 2.0',
    date: new Date(2020, 7 - 1),
    additions: [
      'Control Center',
      'Crypto-currency miner app',
      'Hardware-Shop app',
      'Animation when booting and shutting down computers',
      'Task-Manager app',
      'Wallet app',
      'System resource usage',
    ],
    fixes: [
      'Fixed bug in the terminal app when maximizing',
      'Fixed several bugs in the start menu'
    ],
    enhancements: [
      'Added new terminal commands'
    ]
  }, {
    name: 'Pre-Alpha 1.0',
    date: new Date(2019, 5 - 1, 27),
    additions: [
      'Login',
      'Register',
      'Desktop of the computer',
      'Start menu to search for programs',
      'Database structure'
    ],
    fixes: [],
    enhancements: []
  }];

  constructor() {
  }

  ngOnInit(): void {
  }

}
