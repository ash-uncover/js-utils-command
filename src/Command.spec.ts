import { CommandArgumentTypes } from './CommandArgumentType'
import { CommandError } from './CommandError'
import { Command } from './Command'

describe('Command', () => {

  let error: any

  beforeEach(() => {
    //error = jest.spyOn(console, "error").mockImplementation((e) => { console.log(e) });
    error = jest.spyOn(console, "error").mockImplementation(() => { });
  })

  afterEach(() => {
    error.mockReset()
  })

  describe('parse', () => {

    const ERROR = 'Failed to parse command, use --help for details'

    const ARGUMENT_REQ_VALUE = {
      key: 'argRequiredValue',
      alias: [],
      required: true,
      type: CommandArgumentTypes.VALUE
    }
    const ARGUMENT_ALIAS_VALUE = {
      key: 'argAliasValue',
      alias: ['argAliasValue1', 'argAliasValue2'],
      required: false,
      type: CommandArgumentTypes.VALUE
    }
    const ARGUMENT_BOOLEAN = {
      key: 'argBoolean',
      alias: [],
      required: false,
      type: CommandArgumentTypes.BOOLEAN
    }
    const ARGUMENT_FILE = {
      key: 'argFile',
      alias: [],
      required: false,
      type: CommandArgumentTypes.FILE
    }
    const ARGUMENT_FILE_EXIST = {
      key: 'argFileExist',
      alias: [],
      required: false,
      type: CommandArgumentTypes.FILE_EXIST
    }
    const ARGUMENT_FILE_FOLDER = {
      key: 'argFileFolder',
      alias: [],
      required: false,
      type: CommandArgumentTypes.FILE_FOLDER
    }
    const ARGUMENT_FILE_FOLDER_EXIST = {
      key: 'argFileFolderExist',
      alias: [],
      required: false,
      type: CommandArgumentTypes.FILE_FOLDER_EXIST
    }
    const ARGUMENT_FOLDER = {
      key: 'argFolder',
      alias: [],
      required: false,
      type: CommandArgumentTypes.FOLDER
    }
    const ARGUMENT_FOLDER_EXIST = {
      key: 'argFolderExist',
      alias: [],
      required: false,
      type: CommandArgumentTypes.FOLDER_EXIST
    }

    test('when sending an unknow argument', () => {
      // Declaration
      process.argv = ['node', 'command', '--arg']
      // Execution
      // Assertion
      expect(() => Command.parse([])).toThrow(ERROR)
      expect(error).toHaveBeenCalledTimes(3)
      expect(error).toHaveBeenCalledWith(CommandError.unknownArgument('arg'))
    })

    test('when sending an argument with invalid separator', () => {
      // Declaration
      process.argv = ['node', 'command', '--arg']
      // Execution
      // Assertion
      expect(() => Command.parse([], { separator: '*' })).toThrow(ERROR)
      expect(error).toHaveBeenCalledTimes(3)
      expect(error).toHaveBeenCalledWith(CommandError.invalidArgument('--arg'))
    })

    test('when required argument is missing', () => {
      // Declaration
      process.argv = ['node', 'command']
      // Execution
      // Assertion
      expect(() => Command.parse([ARGUMENT_REQ_VALUE])).toThrow(ERROR)
      expect(error).toHaveBeenCalledTimes(3)
      expect(error).toHaveBeenCalledWith(CommandError.missingArgument(ARGUMENT_REQ_VALUE.key))
    })

    test('when argument has no value', () => {
      // Declaration
      process.argv = ['node', 'command', `--${ARGUMENT_REQ_VALUE.key}`]
      // Execution
      // Assertion
      expect(() => Command.parse([ARGUMENT_REQ_VALUE])).toThrow(ERROR)
      expect(error).toHaveBeenCalledTimes(3)
      expect(error).toHaveBeenCalledWith(CommandError.missingValue(ARGUMENT_REQ_VALUE.key))
    })

    test('when argument has a value but should not', () => {
      // Declaration
      process.argv = ['node', 'command', `--${ARGUMENT_BOOLEAN.key}=value`]
      // Execution
      // Assertion
      expect(() => Command.parse([ARGUMENT_BOOLEAN])).toThrow(ERROR)
      expect(error).toHaveBeenCalledTimes(3)
      expect(error).toHaveBeenCalledWith(CommandError.unexpectedValue(ARGUMENT_BOOLEAN.key))
    })

    test('when argument is a file that doesnt exist', () => {
      // Declaration
      process.argv = ['node', 'command', `--${ARGUMENT_FILE_EXIST.key}=dummy.txt`]
      // Execution
      // Assertion
      expect(() => Command.parse([ARGUMENT_FILE_EXIST])).toThrow(ERROR)
      expect(error).toHaveBeenCalledTimes(3)
      expect(error).toHaveBeenCalledWith(CommandError.fileNoExist(ARGUMENT_FILE_EXIST.key))
    })

    test('when argument is a file but points to a folder', () => {
      // Declaration
      process.argv = ['node', 'command', `--${ARGUMENT_FILE.key}=../`]
      // Execution
      // Assertion
      expect(() => Command.parse([ARGUMENT_FILE])).toThrow(ERROR)
      expect(error).toHaveBeenCalledTimes(3)
      expect(error).toHaveBeenCalledWith(CommandError.notFile(ARGUMENT_FILE.key))
    })

    test('when argument is an existing file but points to a folder', () => {
      // Declaration
      process.argv = ['node', 'command', `--${ARGUMENT_FILE_EXIST.key}=../`]
      // Execution
      // Assertion
      expect(() => Command.parse([ARGUMENT_FILE_EXIST])).toThrow(ERROR)
      expect(error).toHaveBeenCalledTimes(3)
      expect(error).toHaveBeenCalledWith(CommandError.notFile(ARGUMENT_FILE_EXIST.key))
    })

    test('when argument is a file/folder that doesnt exist', () => {
      // Declaration
      process.argv = ['node', 'command', `--${ARGUMENT_FILE_FOLDER_EXIST.key}=dummy.txt`]
      // Execution
      // Assertion
      expect(() => Command.parse([ARGUMENT_FILE_FOLDER_EXIST])).toThrow(ERROR)
      expect(error).toHaveBeenCalledTimes(3)
      expect(error).toHaveBeenCalledWith(CommandError.fileNoExist(ARGUMENT_FILE_FOLDER_EXIST.key))
    })

    test('when argument is a folder that doesnt exist', () => {
      // Declaration
      process.argv = ['node', 'command', `--${ARGUMENT_FOLDER_EXIST.key}=dummy`]
      // Execution
      // Assertion
      expect(() => Command.parse([ARGUMENT_FOLDER_EXIST])).toThrow(ERROR)
      expect(error).toHaveBeenCalledTimes(3)
      expect(error).toHaveBeenCalledWith(CommandError.folderNoExist(ARGUMENT_FOLDER_EXIST.key))
    })

    test('when argument is a folder but points to a file', () => {
      // Declaration
      process.argv = ['node', 'command', `--${ARGUMENT_FOLDER.key}=./package.json`]
      // Execution
      // Assertion
      expect(() => Command.parse([ARGUMENT_FOLDER])).toThrow(ERROR)
      expect(error).toHaveBeenCalledTimes(3)
      expect(error).toHaveBeenCalledWith(CommandError.notFolder(ARGUMENT_FOLDER.key))
    })

    test('when argument is an existing folder but points to a file', () => {
      // Declaration
      process.argv = ['node', 'command', `--${ARGUMENT_FOLDER_EXIST.key}=./package.json`]
      // Execution
      // Assertion
      expect(() => Command.parse([ARGUMENT_FOLDER_EXIST])).toThrow(ERROR)
      expect(error).toHaveBeenCalledTimes(3)
      expect(error).toHaveBeenCalledWith(CommandError.notFolder(ARGUMENT_FOLDER_EXIST.key))
    })

    test('when receiving valid command', () => {
      // Declaration
      process.argv = ['node', 'command', `--${ARGUMENT_BOOLEAN.key}`, `--${ARGUMENT_REQ_VALUE.key}=value`]
      // Execution
      const result = Command.parse([ARGUMENT_BOOLEAN, ARGUMENT_REQ_VALUE])
      // Assertion
      expect(result).toEqual({
        [ARGUMENT_BOOLEAN.key]: true,
        [ARGUMENT_REQ_VALUE.key]: 'value'
      })
    })
  })
})
