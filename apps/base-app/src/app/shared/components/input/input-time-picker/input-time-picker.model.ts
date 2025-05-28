export interface TimePickerForm {
  hour: string;
  minute: string;
  second: string;
}

export interface TimePickerConfig {
  useHour: boolean;
  useMinute: boolean;
  useSecond: boolean;
  enableMeridian: boolean;
  format: string;
}
