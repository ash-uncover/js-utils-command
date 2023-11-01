export type CommandArgumentType =
'boolean' |
'file' |
'fileFolder' |
'folder' |
'fileExist' |
'fileFolderExist' |
'folderExist' |
'value'

export const CommandArgumentTypes: {
  BOOLEAN: CommandArgumentType
  FILE: CommandArgumentType
  FILE_FOLDER: CommandArgumentType
  FOLDER: CommandArgumentType
  FILE_EXIST: CommandArgumentType
  FILE_FOLDER_EXIST: CommandArgumentType
  FOLDER_EXIST: CommandArgumentType
  VALUE: CommandArgumentType
} = {
  BOOLEAN: 'boolean',
  FILE: 'file',
  FILE_FOLDER: 'fileFolder',
  FOLDER: 'folder',
  FILE_EXIST: 'fileExist',
  FILE_FOLDER_EXIST: 'fileFolderExist',
  FOLDER_EXIST: 'folderExist',
  VALUE: 'value'
}