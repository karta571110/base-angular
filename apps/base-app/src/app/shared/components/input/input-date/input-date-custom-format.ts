import { type MatDateFormats } from '@angular/material/core';

export const hasTimePickerFormat = {
  parse: {
    dateInput: 'yyyy/MM/dd HH:mm:ss',
  },
  display: {
    dateInput: 'yyyy/MM/dd HH:mm:ss',
    monthYearLabel: 'uuuu LLL',
    dateA11yLabel: 'dd',
    monthYearA11yLabel: 'dd',
  },
} as const;
export const withoutTimePickerFormat = {
  parse: {
    dateInput: 'yyyy/MM/dd',
  },
  display: {
    dateInput: 'yyyy/MM/dd',
    monthYearLabel: 'uuuu LLL',
    dateA11yLabel: 'dd',
    monthYearA11yLabel: 'dd',
  },
} as const;

export class CustomDateFnsFormat implements MatDateFormats {
  useTimePicker = true;

  get display(): MatDateFormats['display'] {
    return this.useTimePicker
      ? hasTimePickerFormat.display
      : withoutTimePickerFormat.display;
  }

  get parse(): MatDateFormats['parse'] {
    return this.useTimePicker
      ? hasTimePickerFormat.parse
      : withoutTimePickerFormat.parse;
  }
}
