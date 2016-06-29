/* @flow */

export type Options = {
  filter: ((source: string, destination: string) => boolean),
  dotFiles: boolean,
  overwrite: boolean,
  deleteExtra: boolean,
  failIfExists: boolean,
  tickCallback: ((source: string, destination: string) => void)
}
