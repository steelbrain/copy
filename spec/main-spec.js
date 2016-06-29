'use babel'

/* @flow */

import FS from 'fs'
import Path from 'path'
import rimraf from 'rimraf'
import promisify from 'sb-promisify'
import { it } from 'jasmine-fix'

import copy from '../'

const stat = promisify(FS.stat, false)
const read = promisify(FS.readFile)
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
  it('works on directories', async function() {
    const srcPath = getFixturePath('src/dir')
    const dstPath = getFixturePath('dest/dir')
    await remove(dstPath)
    expect(await stat(dstPath)).toBe(null)
    await copy(srcPath, dstPath)
    expect(typeof (await stat(getFixturePath('dest/dir/test.txt'))).isFile).toBe('function')
  })
  it('copies the modes of the directories properly', async function() {
    const srcPath = getFixturePath('src/dir')
    const dstPath = getFixturePath('dest/dir')
    await remove(dstPath)
    expect(await stat(dstPath)).toBe(null)
    await copy(srcPath, dstPath)
    expect((await stat(dstPath)).mode).toBe((await stat(srcPath)).mode)
  })
  it('does not replace contents of directories if its told to', async function() {
    const srcFirstPath = getFixturePath('src/dir')
    const srcSecondPath = getFixturePath('src/dir-2')
    const dstPath = getFixturePath('dest/dir-replace-1')
    await remove(dstPath)
    expect(await stat(dstPath)).toBe(null)
    await copy(srcFirstPath, dstPath)
    await copy(srcSecondPath, dstPath, { failIfExists: false })
    expect(await read(getFixturePath('dest/dir-replace-1/test.txt'), 'utf8')).toBe('Boom!\n')
  })
  it('does replaces contents of directories if its told to', async function() {
    const srcFirstPath = getFixturePath('src/dir')
    const srcSecondPath = getFixturePath('src/dir-2')
    const dstPath = getFixturePath('dest/dir-replace-2')
    await remove(dstPath)
    expect(await stat(dstPath)).toBe(null)
    await copy(srcFirstPath, dstPath)
    await copy(srcSecondPath, dstPath, { overwrite: true })
    expect(await read(getFixturePath('dest/dir-replace-2/test.txt'), 'utf8')).toBe('Hey!\n')
  })
})
