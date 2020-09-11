export class Path {
  static ROOT = null;

  path: string[];
  parentUUID: string;

  constructor(path: string[], parentUUID: string = Path.ROOT) {
    this.path = path;
    this.parentUUID = parentUUID;
  }

  static fromString(path: string, parentIfRelative?: string): Path {
    if (!path.match(/^[a-zA-Z0-9/.\-_]+$/)) {
      throw new Error('invalid_path');
    }

    if (path === '/') {
      return new Path(['.']);
    }

    const parts = path.trim().split('/');
    if (path.startsWith('/')) {
      parts.splice(0, 1);
      return new Path(parts);
    } else if (parentIfRelative !== undefined) {
      return new Path(parts, parentIfRelative);
    } else {
      throw new Error('Path is relative but there is no parent directory given');
    }
  }

  isRelative(): boolean {
    return this.parentUUID !== Path.ROOT;
  }

  toString(): string {
    return (this.parentUUID !== Path.ROOT ? this.parentUUID : '') + '/' + this.path.join('/');
  }

}
