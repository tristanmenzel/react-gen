import path from 'path'
import * as fs from 'fs'
import { copyFileSync, createFileSync, moveFileSync } from './file-helpers'
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
  directoryForTemplate?: boolean
  fileCasing?: CaseOptions
  directoryCasing?: CaseOptions
}

const ValidateSchema = (settings: ReactGenSettings): void => {
  const ajv = new Ajv()
  if (!ajv.validate(schema, settings)) {
    console.error(ajv.errorsText(ajv.errors).red)
    throw new Error('Invalid settings file schema')
  }
}

const DEFAULT_TEMPLATES = [
  {
    name: 'functional-component',
    shortcut: 'fc',
    files: ['templates/functional-component/file.module.scss.mustache', 'templates/functional-component/file.tsx.mustache'],
  },
  {
    name: 'component',
    shortcut: 'c',
    files: ['templates/component/file.module.scss.mustache', 'templates/component/file.tsx.mustache'],
  },
  {
    name: 'router-5',
    shortcut: 'router',
    files: ['templates/router-5/file.tsx.mustache'],
    directoryForTemplate: false,
  },
]

const MakeTemplateFilePathsAbsolute = (templates: TemplateInfo[], basePath: string): TemplateInfo[] =>
  templates.map((t) => ({
    ...t,
    files: t.files.map((f) => path.join(basePath, f)),
  }))

export const DEFAULT_SETTINGS: ReactGenSettings = {
  basePath: 'src',
  templates: MakeTemplateFilePathsAbsolute(DEFAULT_TEMPLATES, path.join(__dirname, '..')),
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
  if (files.some((f) => f === 'package.json')) {
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

  const legacySettingsFilePath = path.join(dir, '.react-gen')
  const settingsFilePath = path.join(dir, './.react-gen/settings.json')

  if (fs.existsSync(legacySettingsFilePath) && fs.statSync(legacySettingsFilePath).isFile()) {
    console.log('Found settings at legacy location, moving to new location')
    moveFileSync(legacySettingsFilePath, settingsFilePath)
  }

  const settingsFile = fs.existsSync(settingsFilePath)
    ? (JSON.parse(fs.readFileSync(settingsFilePath, 'utf8')) as Partial<ReactGenSettings>)
    : undefined

  const settings = {
    ...DEFAULT_SETTINGS,
    ...settingsFile,
    basePath: path.join(dir, settingsFile?.basePath ?? DEFAULT_SETTINGS.basePath),
    templates: [
      ...(settingsFile?.templates?.map((t) => ({
        ...t,
        files: t.files.map((fp) => (fp.startsWith('.') ? path.join(dir, fp) : fp)),
      })) ?? []),
      ...DEFAULT_SETTINGS.templates,
    ],
  }
  ValidateSchema(settings)
  return settings
}

export const CreateSettings = (workingDirectory: string): void => {
  const projectRoot = FindPackageJsonDir(workingDirectory)
  const settingsFilePath = path.join(projectRoot, './.react-gen/settings.json')
  createFileSync(settingsFilePath, JSON.stringify(SETTINGS_TEMPLATE, null, 2))
}

export const EjectTemplates = (workingDirectory: string): void => {
  const projectRoot = FindPackageJsonDir(workingDirectory)
  const settingsFilePath = path.join(projectRoot, './.react-gen/settings.json')
  const settings: ReactGenSettings = fs.existsSync(settingsFilePath)
    ? JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'))
    : SETTINGS_TEMPLATE

  DEFAULT_TEMPLATES.forEach((t) =>
    t.files.forEach((f) => copyFileSync(path.join(__dirname, '..', f), path.join(projectRoot, '.react-gen', f))),
  )

  const updatedSettings = {
    ...settings,
    templates: [...(settings?.templates ?? []), ...MakeTemplateFilePathsAbsolute(DEFAULT_TEMPLATES, '.react-gen')],
  }
  createFileSync(settingsFilePath, JSON.stringify(updatedSettings, null, 2), { flag: 'w' })
}
