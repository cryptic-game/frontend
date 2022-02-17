export interface Changelog {
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
