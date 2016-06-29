/* @flow */

import FS from 'fs'
import rimraf from 'rimraf'
import promisify from 'sb-promisify'
import { fillOptions } from './helpers'
import type { Options } from './types'

const link = promisify(FS.link)
const stat = promisify(FS.stat, false)
const remove = promisify(rimraf)
const readLink = promisify(FS.readLink)

async function copy(source: string, destination: string, options: Options): Promise {
  const sourceInfo: FS.Stats = await stat(source)
  const destinationInfo: FS.Stats = await stat(destination)
  if (!sourceInfo) {
    throw new Error(`Source '${source}' doesn't exist`)
  }
  if (destinationInfo) {
    if (!options.overwrite) {
      if (options.failIfExists) {
        throw new Error(`Destination '${destination}' already exists`)
      }
      return
    }
    if ((sourceInfo.isFile() && !destinationInfo.isFile()) || (sourceInfo.isDirectory() && !destinationInfo.isDirectory())) {
      await remove(destination)
    }
  }
  if (sourceInfo.isFile()) {
    await new Promise(function(resolve, reject) {
      FS.createReadStream(source).pipe(FS.createWriteStream(destination, {
        mode: sourceInfo.mode
      }, { end: true })).on('error', reject).on('close', resolve)
    })
    return
  }
  if (sourceInfo.isSymbolicLink()) {
    await link(destination, await readLink(source))
    return
  }
}

function copyContent(source: string, destination: string, givenOptions: Object = {}): Promise {
  return copy(source, destination, fillOptions(givenOptions))
}

module.exports = copyContent
