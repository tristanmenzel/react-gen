import path from 'path'
import * as Mustache from 'mustache'
import fs from 'fs'
import * as changeCase from 'change-case'
import { GenSettings, TemplateInfo } from './settings'
import { createFileSync } from './file-helpers'

interface TemplateModel {
  directory: string
  kebabName: string
  camelName: string
  pascalName: string
}

const replaceTemplateFileName = (fileName: string, model: TemplateModel) =>
  fileName
    .replace(/(kebab|camel|pascal)Name/, str => model[str as 'kebabName' | 'camelName' | 'pascalName'])
    .replace(/\.mustache/, '')


const parseTargetPath = (targetPath: string): TemplateModel => {
  const parts = targetPath.split('/')
  const name = parts.pop() ?? 'component'
  return {
    directory: parts.join('/'),
    kebabName: changeCase.paramCase(name),
    camelName: changeCase.camelCase(name),
    pascalName: changeCase.pascalCase(name),
  }

}

const readTemplateFile = (templatePath: string) =>
  fs.readFileSync(templatePath, 'utf8') ?? ''

export const Scaffold = (template: TemplateInfo,
  targetPath: string,
  settings: GenSettings) => {

  const model = parseTargetPath(targetPath)

  for (const tf of template.files) {
    const output = Mustache.render(readTemplateFile(tf), model)
    const outPath = path.join(settings.basePath, targetPath, replaceTemplateFileName(path.basename(tf), model))
    createFileSync(outPath, output)
  }
}
