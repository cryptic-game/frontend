import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Changelog } from './Changelog';

@Component({
  selector: 'app-control-center-changelog-page',
  templateUrl: './control-center-changelog-page.component.html',
  styleUrls: ['./control-center-changelog-page.component.scss'],
})
export class ControlCenterChangelogPageComponent implements OnInit {
  changelog: Changelog;

  constructor(private httpClient: HttpClient) {
    this.changelog = {
      latest: '',
      versions: [
        {
          name: '',
          date: '',
          additions: [],
          changes: [],
          enhancements: [],
          fixes: [],
        },
      ],
      start_date: '',
    };
  }

  ngOnInit(): void {
    this.httpClient.get<Changelog>('/assets/changelog.json').subscribe((changelog) => (this.changelog = changelog));
  }
}
