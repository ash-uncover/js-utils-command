export class CommandError {

  static ERROR = 'Failed to parse command, use --help for details'

  static invalidArgument(arg: string) {
    return `Invalid argument: ${arg}`
  }

  static unknownArgument(arg: string) {
    return `Unknown argument: ${arg}`
  }

  static missingArgument(arg: string) {
    return `Missing argument: ${arg}`
  }

  static missingValue(arg: string) {
    return `Missing value for argument: ${arg}`
  }

  static unexpectedValue(arg: string) {
    return `Unexpected value for argument: ${arg}`
  }

  static fileNoExist(arg: string) {
    return `File does not exist: ${arg}`
  }

  static folderNoExist(arg: string) {
    return `Folder does not exist: ${arg}`
  }

  static notFile(arg: string) {
    return `Must point to a file (found folder): ${arg}`
  }

  static notFolder(arg: string) {
    return `Must point to a folder (found file): ${arg}`
  }
}