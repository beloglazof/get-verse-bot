export enum Env {
  Dev = 'dev',
  Prod = 'prod',
}

export type BGVerseType = [Book, string, string];
export type SBVerseType = [Book, string, string, string];
export type VerseType = BGVerseType | SBVerseType;

export enum Book {
  BG = 'bg',
  SB = 'sb',
  // CC = 'cc',
}
