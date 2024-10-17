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

export interface VerseType {
  link: string;
  title: string;
  translation?: string | null;
  firstPuportParagraph?: string | null;
  needReadMore?: boolean;
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
