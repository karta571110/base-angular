/** 取得物件某 key 值的型別 */
export type PickObj<T, U extends keyof T> = T[U];
