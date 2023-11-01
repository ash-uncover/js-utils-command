import * as fs from 'fs'
import { CommandArgumentType, CommandArgumentTypes } from './CommandArgumentType'
import { CommandError } from './CommandError'

interface CommandArgument {
  key: string
  alias: string[]
  required: boolean
  type: CommandArgumentType
}
interface CommandArgumentBuilt extends CommandArgument {
  value: any
}

interface CommandOptions {
  separator: string
}

const DEFAULT_OPTIONS: CommandOptions = {
  separator: '--'
}

export class Command {

  static parse(args: CommandArgument[], options: CommandOptions = DEFAULT_OPTIONS) {
    const processArgs = process.argv.slice()
    processArgs.splice(0, 2)
    const errors: string[] = []
    const commandArgs: { [key: string]: CommandArgumentBuilt } = args.reduce((acc: any, arg) => {
      acc[arg.key] = {
        ...arg,
        value: arg.type === CommandArgumentTypes.BOOLEAN ? false : null
      }
      return acc
    }, {})
    processArgs.forEach(processArg => {
      if (!processArg.startsWith(options.separator)) {
        errors.push(CommandError.invalidArgument(processArg))
        return
      }

      processArg = processArg.substring(2)
      let [argKey, argValue] = processArg.split('=')
      argKey = argKey
      const commandArg = Object.values(commandArgs).find(arg => arg.key === argKey || arg.alias.includes(argKey))

      if (!commandArg) {
        errors.push(CommandError.unknownArgument(argKey))
        return
      }
      if (commandArg.type !== CommandArgumentTypes.BOOLEAN && !argValue) {
        errors.push(CommandError.missingValue(argKey))
        commandArgs[commandArg.key].value = true
        return
      }
      if (commandArg.type === CommandArgumentTypes.BOOLEAN && argValue) {
        errors.push(CommandError.unexpectedValue(argKey))
        return
      }

      switch (commandArg.type) {
        case CommandArgumentTypes.BOOLEAN: {
          commandArgs[commandArg.key].value = true
          break
        }
        case CommandArgumentTypes.FILE: {
          commandArgs[commandArg.key].value = argValue
          if (fs.existsSync(argValue)) {
            const filePath = fs.lstatSync(argValue)
            if (filePath.isDirectory()) {
              errors.push(CommandError.notFile(argKey))
            }
          }
          break
        }
        case CommandArgumentTypes.FILE_EXIST: {
          commandArgs[commandArg.key].value = argValue
          if (!fs.existsSync(argValue)) {
            errors.push(CommandError.fileNoExist(argKey))
          } else {
            const filePath = fs.lstatSync(argValue)
            if (filePath.isDirectory()) {
              errors.push(CommandError.notFile(argKey))
            }
          }
          break
        }
        case CommandArgumentTypes.FILE_FOLDER_EXIST: {
          commandArgs[commandArg.key].value = argValue
          if (!fs.existsSync(argValue)) {
            errors.push(CommandError.fileNoExist(argKey))
          }
          break
        }
        case CommandArgumentTypes.FOLDER: {
          commandArgs[commandArg.key].value = argValue
          if (fs.existsSync(argValue)) {
            const filePath = fs.lstatSync(argValue)
            if (!filePath.isDirectory()) {
              errors.push(CommandError.notFolder(argKey))
            }
          }
          break
        }
        case CommandArgumentTypes.FOLDER_EXIST: {
          commandArgs[commandArg.key].value = argValue
          if (!fs.existsSync(argValue)) {
            errors.push(CommandError.folderNoExist(argKey))
          } else {
            const filePath = fs.lstatSync(argValue)
            if (!filePath.isDirectory()) {
              errors.push(CommandError.notFolder(argKey))
            }
          }
          break
        }
        default: {
          commandArgs[commandArg.key].value = argValue
          break
        }
      }
    })
    Object.keys(commandArgs).forEach((key: any) => {
      const arg = commandArgs[key]
      if (arg.required && !arg.value) {
        errors.push(CommandError.missingArgument(key))
      }
    })

    if (errors.length) {
      console.error(CommandError.ERROR)
      errors.forEach(error => console.error(error))
      console.error('')
      throw new Error(CommandError.ERROR)
    }

    return Object.keys(commandArgs).reduce((acc: any, key) => {
      if (commandArgs[key].value) {
        acc[key] = commandArgs[key].value
      }
      return acc
    }, {})
  }
}
