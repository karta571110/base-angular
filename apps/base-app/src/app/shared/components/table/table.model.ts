export interface Column<rowKey = string> {
  /** 資料欄位 */
  field: rowKey;

  /** 標頭名稱 */
  name: string;

  /** 標頭及欄位文字位置 */
  align?: 'center' | 'end' | 'start';

  /**
   * 排序模式
   * 0: default
   * 1: asc
   * 2: desc
   */
  sort?: 0 | 1 | 2;
}
