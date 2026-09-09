export type ModelKind = 'cabinet' | 'valve' | 'room'
export interface ModelOptions { kind: ModelKind; finish: string; accent: string; handles: boolean; exploded: boolean; part: string }
