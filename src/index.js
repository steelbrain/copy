/* @flow */

import FS from 'fs'
import Path from 'path'
import rimraf from 'rimraf'
import promisify from 'sb-promisify'
import { fillOptions } from './helpers'
import type { Options } from './types'

const link = promisify(FS.link)
const stat = promisify(FS.stat, false)
const mkdir = promisify(FS.mkdir)
const remove = promisify(rimraf)
const readdir = promisify(FS.readdir)
const readLink = promisify(FS.readlink)

async function copy(source: string, destination: string, options: Options): Promise<void> {
  const sourceInfo: FS.Stats = await stat(source)
  let destinationInfo: ?FS.Stats = await stat(destination)
  if (!sourceInfo) {
    throw new Error(`Source '${source}' doesn't exist`)
  }
  if (!(await stat(Path.dirname(destination)))) {
    throw new Error(`Parent directory of destination '${destination}' doesn't exist`)
  }
  if (destinationInfo && (sourceInfo.isFile() || (sourceInfo.isDirectory() && !destinationInfo.isDirectory()))) {
    if (!options.overwrite) {
      if (options.failIfExists) {
        throw new Error(`Destination '${destination}' already exists`)
      }
      return
    }
    await remove(destination, {
      disableGlob: true,
    })
    destinationInfo = null
  }
  if (sourceInfo.isFile()) {
    await new Promise(function(resolve, reject) {
      FS.createReadStream(source).pipe(FS.createWriteStream(destination, {
        mode: sourceInfo.mode,
      }, { end: true })).on('error', reject).on('close', resolve)
    })
    options.tickCallback(source, destination)
    return
  }
  if (sourceInfo.isSymbolicLink()) {
    await link(destination, await readLink(source))
    options.tickCallback(source, destination)
    return
  }
  if (sourceInfo.isDirectory()) {
    if (!destinationInfo) {
      await mkdir(destination, sourceInfo.mode)
    }
    const sourceContents = await readdir(source)
    const destinationContents = await readdir(destination)

    if (options.deleteExtra) {
      const filesToDelete = destinationContents.filter(item => sourceContents.indexOf(item) === -1)
      await Promise.all(filesToDelete.map(function(item) {
        return remove(Path.join(destination, item), {
          disableGlob: true,
        })
      }))
    }

    await Promise.all(sourceContents.filter(function(item) {
      return options.filter(Path.join(source, item), Path.join(destination, item))
    }).map(function(item) {
      return copy(Path.join(source, item), Path.join(destination, item), options)
    }))
    options.tickCallback(source, destination)
    return
  }
  throw new Error(`Unable to determine type of '${source}'`)
}

function copyContent(source: string, destination: string, givenOptions: Object = {}): Promise<void> {
  return copy(source, destination, fillOptions(givenOptions))
}

module.exports = copyContent
