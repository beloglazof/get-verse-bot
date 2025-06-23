export enum Env {
  Dev = 'dev',
  Prod = 'prod',
  Preview = 'preview',
}

export enum ApiEnv {
  Prod = 'prod',
  Test = 'test',
}

export enum Command {
  Start = 'start',
  Help = 'help',
  StartDaily = 'startdaily',
  StopDaily = 'stopdaily',
  StartSandwich = 'startsandwich',
  StopSandwich = 'stopsandwich',
}

export enum Book {
  BG = 'bg',
  SB = 'sb',
  CC = 'cc',
}

export enum CcLila {
  Adi = 'adi',
  Madhya = 'madhya',
  Antya = 'antya',
}

export enum ErrorCode {
  Unknown = 'Unknown',
  NoSandwichData = 'NoSandwichData', // bookmark errors
  UnsupportedLibraryHostname = 'UnsupportedLibraryHostname',
  InvalidBookmarkTarget = 'InvalidBookmarkTarget',
}

interface VerseLibraryLink {
  vedabase: string;
  gitabase: string;
  ocean: string;
}
export interface VerseType {
  from: Book;
  libraryLink: VerseLibraryLink;
  title: string;
  translation: string;
}
