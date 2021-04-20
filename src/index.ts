import arg from 'arg'
import process from 'process'
import { Scaffold } from './scaffolder'
import { CreateSettings, ReactGenSettings, LoadSettings, TemplateInfo, EjectTemplates } from './settings'


interface Args {
  command: 'init' | 'gen' | 'eject'
  template: TemplateInfo | undefined
  paths: string[]
}

const Commands: Args['command'][] = ['init', 'gen', 'eject']

export const parseArgs = (rawArgs: string[], settings: ReactGenSettings): Args => {
  const args = arg(
    {},
    {
      argv: rawArgs.slice(2),
    },
  )
  const commandOrTemplate = args._[0]
  const argOffset = Commands.includes(commandOrTemplate as Args['command']) ? 1 : 0
  const templateNameOrShortcut = args._[0 + argOffset]
  const paths = args._.slice(1 + argOffset)
  return {
    command: Commands.find(c => c === commandOrTemplate) ?? 'gen',
    template: settings.templates
      .filter(t => t.name === templateNameOrShortcut || t.shortcut === templateNameOrShortcut)[0],
    paths,
  }
}


export function cli(args: string[]): void {
  const workingDirectory = process.cwd()
  const settings = LoadSettings(workingDirectory)
  const parsed = parseArgs(args, settings)

  switch (parsed.command) {
    case 'init':
      CreateSettings(workingDirectory)
      return
    case 'eject':
      EjectTemplates(workingDirectory)
      return
    case 'gen':
      if (parsed.template === undefined) {
        console.error('Please specify a valid template name or shortcut (eg. functional-component)')
        return
      }
      if (parsed.paths.length === 0) {
        console.error('Please specify a file path / name')
        return
      }
      Scaffold(parsed.template, parsed.paths, settings)
      return
  }
}
