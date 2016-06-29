/* @flow */

export type Options = {
  filter: ((filePath: string) => boolean),
  dotFiles: boolean,
  overwrite: boolean,
  deleteExtra: boolean,
  failIfExists: boolean,
  tickCallback: ((filePath: string, error: ?Error) => void)
}
