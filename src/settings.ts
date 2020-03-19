import path from 'path'
import * as fs from 'fs'
import { createFileSync } from './file-helpers'
import Ajv from 'ajv'
import * as schema from './schema.react-gen.json'

export type CaseOptions = 'kebabCase' | 'camelCase' | 'pascalCase'

export interface ReactGenSettings {
  basePath: string
  templates: TemplateInfo[]
  directoryForTemplate: boolean
  directoryCasing: CaseOptions
  fileCasing: CaseOptions

}

export interface TemplateInfo {
  name: string
  shortcut: string
  files: string[]
}


const ValidateSchema = (settings: ReactGenSettings): void => {
  const ajv = new Ajv()
  if (!ajv.validate(schema, settings)) {
    console.error(ajv.errorsText(ajv.errors).red)
    throw new Error('Invalid settings file schema')
  }
}

export const DEFAULT_SETTINGS: ReactGenSettings = {
  basePath: 'src',
  templates: [{
    name: 'functional-component',
    shortcut: 'fc',
    files: [
      path.join(__dirname, '../templates/functional-component/file.module.scss.mustache'),
      path.join(__dirname, '../templates/functional-component/file.tsx.mustache'),
    ],
  }],
  directoryCasing: 'kebabCase',
  fileCasing: 'pascalCase',
  directoryForTemplate: true,
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

const SETTINGS_TEMPLATE: Partial<ReactGenSettings> = {
  basePath: 'src',
  templates: [],
}

export const LoadSettings = (workingDirectory: string): ReactGenSettings => {
  const dir = FindPackageJsonDir(workingDirectory)

  const settingsFilePath = path.join(dir, '.react-gen')
  const settingsFile = fs.existsSync(settingsFilePath)
    ? JSON.parse(fs.readFileSync(settingsFilePath, 'utf8')) as Partial<ReactGenSettings>
    : undefined

  const settings = {
    ...DEFAULT_SETTINGS,
    ...settingsFile,
    basePath: path.join(dir, settingsFile?.basePath ?? DEFAULT_SETTINGS.basePath),
    templates: [
      ...(settingsFile
          ?.templates
          ?.map(t => ({
            ...t,
            files: t.files.map(fp => fp.startsWith('.') ? path.join(dir, fp) : fp),
          }))
        ?? []),
      ...(DEFAULT_SETTINGS.templates),
    ],
  }
  ValidateSchema(settings)
  return settings
}


export const CreateSettings = (workingDirectory: string): void => {
  const dir = FindPackageJsonDir(workingDirectory)
  const outFile = path.join(dir, '.react-gen')
  createFileSync(outFile, JSON.stringify(SETTINGS_TEMPLATE, null, 2))
}