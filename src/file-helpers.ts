import * as fs from 'fs'
import path from 'path'
import 'colors'
import { WriteFileOptions } from 'fs'
import { randomUUID } from 'crypto'

const ensureDirectoryExists = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    ensureDirectoryExists(path.dirname(dir))
    fs.mkdirSync(dir)
  }
}

export const createFileSync = (filePath: string, fileContents: string, options?: Exclude<WriteFileOptions, string | null>): void => {
  ensureDirectoryExists(path.dirname(filePath))
  try {
    fs.writeFileSync(filePath, fileContents, {
      flag: 'wx',
      ...options,
    })
    console.info(`File created:\n '${filePath}'`.green)
  } catch (err) {
    if (fs.existsSync(filePath)) {
      console.error(`File could not be created as it already exists:\n${filePath}`.red)
    } else {
      console.error('File could not be created:'.red)
      console.error(err)
    }
  }
}

export const copyFileSync = (filePath: string, destinationPath: string): void => {
  ensureDirectoryExists(path.dirname(destinationPath))
  fs.copyFileSync(filePath, destinationPath)
}
export const moveFileSync = (filePath: string, destinationPath: string): void => {
  const tempPath = path.join(path.dirname(filePath), `${randomUUID()}.ext`)
  fs.renameSync(filePath, tempPath)
  ensureDirectoryExists(path.dirname(destinationPath))
  fs.copyFileSync(tempPath, destinationPath)
  fs.rmSync(tempPath)
}
