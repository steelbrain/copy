/* @flow */

import invariant from 'assert'
import type { Options } from './types'

export function fillOptions(options: Object): Options {
  const toReturn = {}
  if (options.filter) {
    invariant(typeof options.filter === 'function', 'Options.filter must be a function')
    toReturn.filter = options.filter
  } else {
    toReturn.filter = () => true
  }
  toReturn.dotFiles = Boolean(options.dotFiles)
  toReturn.overwrite = Boolean(options.overwrite)
  toReturn.deleteExtra = Boolean(options.deleteExtra)
  toReturn.failIfExists = typeof options.failIfExists === 'boolean' ? options.failIfExists : true
  if (options.tickCallback) {
    invariant(typeof options.tickCallback === 'function', 'Options.tickCallback must be a function')
    toReturn.tickCallback = options.tickCallback
  } else {
    toReturn.tickCallback = function() {}
  }
  return toReturn
}
