import { Path } from './path';

describe('Path', () => {
  beforeAll(() => {
    Path.ROOT = 'test-root';
  });

  afterAll(() => {
    Path.ROOT = null;
  });

  it('should create an instance', () => {
    expect(new Path([])).toBeTruthy();
  });

  it('#fromString() should throw an invalid_path error if not every character is either alphanumeric or one of .-_/', () => {
    const testCharacters = '!"§$%&()=?\\\n\r°^|;:`´äöüÄÖÜ\'*,~£œŸþ ';
    for (const char of testCharacters) {
      try {
        const path = Path.fromString(char);
        expect(path).toBeUndefined();
      } catch (err) {
        expect(err.message).toEqual('invalid_path');
      }
    }
  });

  it('#fromString() should return an absolute path if it starts with /', () => {
    const path = Path.fromString('/abc/def/ghi', 'xyz');
    expect(path).toBeTruthy();
    expect(path.path).toEqual(['abc', 'def', 'ghi']);
    expect(path.parentUUID).toEqual(Path.ROOT);
  });

  it('#fromString() should return ["."] if the path is just "/"', () => {
    const path = Path.fromString('/', 'xyz');
    expect(path).toBeTruthy();
    expect(path.path).toEqual(['.']);
    expect(path.parentUUID).toEqual(Path.ROOT);
  });

  it('#fromString() should return a relative path with a parent if one is given', () => {
    const path = Path.fromString('xyz/123/987zyx.gdf', '1e7a8918-73b6-454e-815d-a3e112a07d96');
    expect(path).toBeTruthy();
    expect(path.path).toEqual(['xyz', '123', '987zyx.gdf']);
    expect(path.parentUUID).toEqual('1e7a8918-73b6-454e-815d-a3e112a07d96');
  });

  it('#fromString() should throw an error if the path is relative but no parent is given', () => {
    try {
      const path = Path.fromString('xyz/321/abc/.giu');
      expect(path).toBeUndefined();
    } catch (err) {
      expect(err.message).toBeTruthy();
    }
  });

  it('#isRelative() should return true if a parent UUID other than undefined is given', () => {
    expect(new Path([], '826f4c20-c6aa-46f4-b4be-ebfa30b7277a').isRelative()).toBeTruthy();
  });

  it('#isRelative() should return false if no parent UUID is given', () => {
    expect(new Path([]).isRelative()).toBeFalsy();
  });

  it('#toString() should return the parts of the path joined by slashes', () => {
    expect(new Path(['1', '2', '3', '4']).toString()).toEqual('/1/2/3/4');
    expect(new Path(['a', 'b', 'c', 'd'], '258dd223-8fa6-4bbc-9f88-b2593df6ca9f').toString())
      .toEqual('258dd223-8fa6-4bbc-9f88-b2593df6ca9f/a/b/c/d');
  });

  it('should use Path.ROOT as the default parent in the constructor', () => {
    expect(new Path([]).parentUUID).toEqual(Path.ROOT);
  });

});
