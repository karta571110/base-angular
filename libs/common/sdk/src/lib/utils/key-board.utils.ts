/**
 *是否為指定按鍵
 * @param event - 鍵盤事件
 * @param keys - 按鍵
 * @returns 是否為指定按鍵
 */
export function ifKey(event: KeyboardEvent, keys: string[]): boolean {
  return keys.some(k => k === event.key);
}
/**
 *
 *是否為倒退鍵
 * @param event - 鍵盤事件
 * @returns 是否為倒退鍵
 */
export function ifBackspace(event: KeyboardEvent): boolean {
  return ifKey(event, ['Backspace']);
}

/**
 * 是否為方向右鍵
 * @param event -鍵盤事件
 * @returns 是否為方向右鍵
 */
export function ifRightArrow(event: KeyboardEvent): boolean {
  return ifKey(event, ['ArrowRight', 'Right']);
}

/**
 *是否為方向左鍵
 * @param event - 鍵盤事件
 * @returns 是否為方向左鍵
 */
export function ifLeftArrow(event: KeyboardEvent): boolean {
  return ifKey(event, ['ArrowLeft', 'Left']);
}

/**
 * 是否為空白鍵
 * @param event - 鍵盤事件
 * @returns 是否為空白鍵
 */
export function ifSpacebar(event: KeyboardEvent): boolean {
  return ifKey(event, ['Spacebar', ' ']); // don't remove the space after ; as this will check for space key
}

/**
 * 是否為刪除鍵
 * @param event - 鍵盤事件
 * @returns 是否為刪除鍵
 */
export function ifDelete(event: KeyboardEvent): boolean {
  return ifKey(event, ['Delete', 'Del']);
}

/**
 *  是否為Tab鍵
 * @param event - 鍵盤事件
 * @returns 是否為Tab鍵
 */
export function ifTab(event: KeyboardEvent): boolean {
  return ifKey(event, ['Tab']);
}
