import path from 'path'
import * as fs from 'fs'
import { createFileSync } from './file-helpers'

export interface GenSettings {
  basePath: string
  templates: TemplateInfo[]

}

export interface TemplateInfo {
  name: string
  shortcut: string
  files: string[]
}

const DefaultSettings: GenSettings = {
  basePath: 'src',
  templates: [{
    name: 'functional-components',
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

const EmptySettings: GenSettings = {
  basePath: 'src',
  templates: [],
}

export const LoadSettings = (workingDirectory: string): GenSettings => {
  const dir = FindPackageJsonDir(workingDirectory)

  const settingsFilePath = path.join(dir, '.react-gen')
  const settingsFile = fs.existsSync(settingsFilePath)
    ? JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'))
    : undefined

  return {
    ...DefaultSettings,
    ...settingsFile,
    basePath: path.join(dir, settingsFile?.basePath ?? DefaultSettings.basePath),
    templates: [
      ...(settingsFile.templates ?? []),
      ...(DefaultSettings.templates),
    ],
  }
}


export const CreateSettings = (workingDirectory: string): void => {
  const dir = FindPackageJsonDir(workingDirectory)
  const outFile = path.join(dir, '.react-gen')
  createFileSync(outFile, JSON.stringify(EmptySettings, null, 2))
}