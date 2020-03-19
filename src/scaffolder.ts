import path from 'path'
import * as Mustache from 'mustache'
import fs from 'fs'
import { ReactGenSettings, TemplateInfo } from './settings'
import { createFileSync } from './file-helpers'
import { changeCase } from './change-case'

interface TemplateModel {
  directory: string
  fileName: string
  kebabName: string
  camelName: string
  pascalName: string
}

const replaceTemplateFileName = (fileName: string, model: TemplateModel): string =>
  fileName
    .replace(/^file(\..*)\.mustache$/, `${model.fileName}$1`)


const parseTargetPath = (targetPath: string, settings: ReactGenSettings): TemplateModel => {
  const parts = targetPath.split('/')
  const name = parts.slice().pop() ?? 'component'
  return {
    directory: parts
      .map(p => changeCase(p, settings.directoryCasing))
      .slice(0, settings.directoryForTemplate ? undefined : -1)
      .join('/'),
    fileName: changeCase(name, settings.fileCasing),
    kebabName: changeCase(name, 'kebabCase'),
    camelName: changeCase(name, 'camelCase'),
    pascalName: changeCase(name, 'pascalCase'),
  }

}

const readTemplateFile = (templatePath: string): string =>
  fs.readFileSync(templatePath, 'utf8') ?? ''

export const Scaffold = (template: TemplateInfo,
  targetPaths: string[],
  settings: ReactGenSettings): void => {

  for (const targetPath of targetPaths) {

    const model = parseTargetPath(targetPath, settings)
    for (const tf of template.files) {
      const output = Mustache.render(readTemplateFile(tf), model)
      const outPath = path.join(settings.basePath, '/',
        model.directory,
        replaceTemplateFileName(path.basename(tf), model))
      createFileSync(outPath, output)
    }
  }
}
