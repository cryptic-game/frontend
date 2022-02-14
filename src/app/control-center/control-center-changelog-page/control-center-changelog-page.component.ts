import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-control-center-changelog-page',
  templateUrl: './control-center-changelog-page.component.html',
  styleUrls: ['./control-center-changelog-page.component.scss']
})
export class ControlCenterChangelogPageComponent implements OnInit {

  changelog: Changelog;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.httpClient.get('/assets/changelog.json').subscribe(changelog => {
      this.changelog = changelog as Changelog;
    });
  }

}

interface Changelog {
  latest: string;
  versions: {
    name: string;
    date: string;
    additions: string[];
    changes: string[];
    enhancements: string[];
    fixes: string[];
  }[];
  start_date: string;
}
