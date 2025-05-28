export type DateRangeRole = 'end' | 'start' | null;
export interface InputDateConfig {
  dateRangeRole: DateRangeRole;
  useTimePicker: boolean;
  max: string | null;
  min: string | null;
}
