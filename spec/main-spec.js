'use babel'

/* @flow */

import FS from 'fs'
import Path from 'path'
import rimraf from 'rimraf'
import promisify from 'sb-promisify'
import { it } from 'jasmine-fix'

import copy from '../'

const stat = promisify(FS.stat, false)
const remove = promisify(rimraf)

describe('copy module', function() {
  function getFixturePath(entry) {
    return Path.join(__dirname, 'fixtures', entry)
  }

  it('works on files', async function() {
    const srcPath = getFixturePath('src/file.txt')
    const dstPath = getFixturePath('dest/file.txt')
    await remove(dstPath)
    expect(await stat(dstPath)).toBe(null)
    await copy(srcPath, dstPath)
    expect(typeof (await stat(dstPath)).isFile).toBe('function')
  })
  it('copies the modes of the files properly', async function() {
    const srcPath = getFixturePath('src/file-exe.txt')
    const dstPath = getFixturePath('dest/file-exe.txt')
    await remove(dstPath)
    expect(await stat(dstPath)).toBe(null)
    await copy(srcPath, dstPath)
    expect(typeof (await stat(dstPath)).isFile).toBe('function')
    expect((await stat(dstPath)).mode).toBe((await stat(srcPath)).mode)
  })
})
