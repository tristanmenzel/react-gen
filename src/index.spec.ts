import { parseArgs } from './index'
import { DEFAULT_SETTINGS } from './settings'

const NODE_ENV_ARGS = ['Path to node', 'Path to js']

test('parseArgs defaults to gen command with no args. ', () => {
  const result = parseArgs(NODE_ENV_ARGS, DEFAULT_SETTINGS)

  expect(result.command).toBe('gen')
})
test('parseArgs with init returns init command. ', () => {
  const result = parseArgs([...NODE_ENV_ARGS, 'init'], DEFAULT_SETTINGS)

  expect(result.command).toBe('init')
})
test('parseArgs with gen returns gen command. ', () => {
  const result = parseArgs([...NODE_ENV_ARGS, 'gen'], DEFAULT_SETTINGS)

  expect(result.command).toBe('gen')
})
test('parseArgs with gen, invalid template and path returns gen command with undefined template. ', () => {
  const result = parseArgs([...NODE_ENV_ARGS, 'gen', 'does-not-exist', 'some/path'], DEFAULT_SETTINGS)

  expect(result.command).toBe('gen')
  expect(result.template).toBeUndefined()
  expect(result.paths[0]).toBe('some/path')
})
test('parseArgs with gen, valid template and path returns gen command with defined template. ', () => {
  const result = parseArgs([...NODE_ENV_ARGS, 'gen', 'functional-component', 'some/path'], DEFAULT_SETTINGS)

  expect(result.command).toBe('gen')
  expect(result.template?.name).toBe('functional-component')
  expect(result.paths[0]).toBe('some/path')
})
test('parseArgs with gen, valid template shortcut and path returns gen command with defined template. ', () => {
  const result = parseArgs([...NODE_ENV_ARGS, 'gen', 'fc', 'some/path'], DEFAULT_SETTINGS)

  expect(result.command).toBe('gen')
  expect(result.template?.name).toBe('functional-component')
  expect(result.paths[0]).toBe('some/path')
})
test('parseArgs with no command, valid template shortcut and path returns gen command with defined template. ', () => {
  const result = parseArgs([...NODE_ENV_ARGS, 'fc', 'some/path'], DEFAULT_SETTINGS)

  expect(result.command).toBe('gen')
  expect(result.template?.name).toBe('functional-component')
  expect(result.paths[0]).toBe('some/path')
})
test('parseArgs with no command, valid template shortcut and multiple paths returns gen command with multiple paths. ', () => {
  const result = parseArgs([...NODE_ENV_ARGS, 'fc', 'some/path', 'some/other/path'], DEFAULT_SETTINGS)

  expect(result.command).toBe('gen')
  expect(result.template?.name).toBe('functional-component')
  expect(result.paths[0]).toBe('some/path')
  expect(result.paths[1]).toBe('some/other/path')
})
