export type ToothStatus =
  | 'saudavel'
  | 'carie'
  | 'restaurado'
  | 'ausente'
  | 'implante'
  | 'fraturado'
  | 'planejado';

export interface ToothInfo {
  id: string; // FDI: 11..48 (decíduos 51..85)
  status: ToothStatus;
  notes?: string;
  procedures?: string[];
}

export interface ToothBounds {
  x: number; // px
  y: number; // px
  w: number; // px
  h: number; // px
}

export type ToothMap = Record<string, ToothBounds>;
