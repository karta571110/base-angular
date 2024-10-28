/** 下拉選項 */
export interface SelectOption<T> {
  /** 選項值 */
  optionValue: T;
  /** 選項名稱 */
  optionName: string;
}

/**
 * 比較函式
 */
export type CompareFn<T> = (option1: T, option2: T) => boolean;
