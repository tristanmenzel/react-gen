import { CaseOptions } from './settings'
import { camelCase, pascalCase, paramCase } from 'change-case'

export const changeCase = (value: string, caseOption: CaseOptions): string => {
  switch (caseOption) {
    case 'camelCase':
      return camelCase(value)
    case 'pascalCase':
      return pascalCase(value)
    case 'kebabCase':
      return paramCase(value)
  }
}
