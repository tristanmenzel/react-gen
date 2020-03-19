import path from 'path'
import * as fs from 'fs'
import { createFileSync } from './file-helpers'

export interface ReactGenSettings {
  basePath: string
  templates: TemplateInfo[]

}

export interface TemplateInfo {
  name: string
  shortcut: string
  files: string[]
}

export const DEFAULT_SETTINGS: ReactGenSettings = {
  basePath: 'src',
  templates: [{
    name: 'functional-component',
    shortcut: 'fc',
    files: [
      path.join(__dirname, '../templates/functional-component/pascalName.module.scss.mustache'),
      path.join(__dirname, '../templates/functional-component/pascalName.tsx.mustache'),
    ],
  }],
}

export const FindPackageJsonDir = (workingDirectory: string): string => {
  const basePath = path.dirname(workingDirectory)
  if (basePath === workingDirectory) {
    throw new Error('Could not find package.json file in current working directory or its parents')
  }
  const files = fs.readdirSync(workingDirectory)
  if (files.some(f => f === 'package.json')) {
    return workingDirectory
  }
  return FindPackageJsonDir(basePath)

}

const EMPTY_SETTINGS: ReactGenSettings = {
  basePath: 'src',
  templates: [],
}

export const LoadSettings = (workingDirectory: string): ReactGenSettings => {
  const dir = FindPackageJsonDir(workingDirectory)

  const settingsFilePath = path.join(dir, '.react-gen')
  const settingsFile = fs.existsSync(settingsFilePath)
    ? JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'))
    : undefined

  return {
    ...DEFAULT_SETTINGS,
    ...settingsFile,
    basePath: path.join(dir, settingsFile?.basePath ?? DEFAULT_SETTINGS.basePath),
    templates: [
      ...(settingsFile.templates ?? []),
      ...(DEFAULT_SETTINGS.templates),
    ],
  }
}


export const CreateSettings = (workingDirectory: string): void => {
  const dir = FindPackageJsonDir(workingDirectory)
  const outFile = path.join(dir, '.react-gen')
  createFileSync(outFile, JSON.stringify(EMPTY_SETTINGS, null, 2))
}