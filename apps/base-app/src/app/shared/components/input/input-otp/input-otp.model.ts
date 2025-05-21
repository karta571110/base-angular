export interface InputOtpConfig {
  length: number;
  allowNumbersOnly: boolean;
  autoFocusInputIndex: number;
  letterCase?: 'lower' | 'upper';
}
