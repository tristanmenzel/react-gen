import * as fs from 'fs'
import path from 'path'
import 'colors'


const ensureDirectoryExists = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    ensureDirectoryExists(path.dirname(dir))
    fs.mkdirSync(dir)
  }
}


export const createFileSync = (filePath: string, fileContents: string): void => {
  ensureDirectoryExists(path.dirname(filePath))
  try {
    fs.writeFileSync(filePath, fileContents, {
      flag: 'wx',
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

