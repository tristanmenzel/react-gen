import arg from 'arg'
import process from 'process'
import { Scaffold } from './scaffolder'
import { CreateSettings, GenSettings, LoadSettings, TemplateInfo } from './settings'


interface Args {
  command: 'init' | 'gen'
  template: TemplateInfo | undefined
  path: string | undefined
}

const Commands: Args['command'][] = ['init', 'gen']

const parseArgs = (rawArgs: string[], settings: GenSettings): Args => {
  const args = arg(
    {},
    {
      argv: rawArgs.slice(2),
    },
  )
  const commandOrTemplate = args._[0]
  const argOffset = Commands.includes(commandOrTemplate as any) ? 1 : 0
  const templateNameOrShortcut = args._[0 + argOffset]
  const path = args._[1 + argOffset]
  return {
    command: Commands.find(c => c === commandOrTemplate) ?? 'gen',
    template: settings.templates
      .filter(t => t.name === templateNameOrShortcut || t.shortcut === templateNameOrShortcut)[0],
    path,
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
    case 'gen':
      if (parsed.template === undefined) {
        console.error('Please specify a template name or shortcut (eg. functional-component)')
        return
      }
      if (parsed.path === undefined) {
        console.error('Please specify a file path / name')
        return
      }
      Scaffold(parsed.template, parsed.path, settings)
      return
  }
}
