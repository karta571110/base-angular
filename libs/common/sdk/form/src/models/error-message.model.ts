export interface CommonErrorField {
  fieldName: string;
}

/** 預設訊息欄位定義物件 */
export interface CommonMessage {
  required: CommonErrorField;

  'regex-pattern-error': CommonErrorField;

  'no-message': boolean;
}

/** 自訂訊息欄位定義物件 */
export type ValidatorErrorMessage<ErrorMessageType = CommonMessage> = {
  [key in keyof ErrorMessageType]?: ErrorMessageType[key];
};

export type MessageData = {
  [key in keyof CommonMessage]: string;
};
