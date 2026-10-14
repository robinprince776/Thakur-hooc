export type DevForgeTab =
  | 'json'
  | 'regex'
  | 'crypto'
  | 'jwt'
  | 'api'
  | 'git'
  | 'utils';

export interface HashResult {
  algorithm: string;
  hash: string;
}

export interface RegexPatternPreset {
  id: string;
  name: string;
  pattern: string;
  flags: string;
  testSample: string;
  description: string;
}

export interface PortReference {
  port: number;
  protocol: string;
  service: string;
  description: string;
  risk: 'Low' | 'Medium' | 'High';
}
