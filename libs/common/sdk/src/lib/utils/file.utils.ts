import { isUndefined } from 'lodash-es';
import { type Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';

/** office檔案格式 */
export const officeFileMimeType = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
} as const;

/** office檔案格式型別 */
export type OfficeFileType = keyof typeof officeFileMimeType;

/** 圖片檔案副檔名 */
export const imageFileMimeType = {
  tif: 'image/tiff; application=faxbw',
  jpg: 'image/jpg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  png: 'image/png',
} as const;

/** 圖片檔案副檔名類型 */
export type ImageFileType = keyof typeof imageFileMimeType;

/** 檔案類型 */
export const fileMimeType = {
  ...officeFileMimeType,
  ...imageFileMimeType,
} as const;
/**
 * Base64 轉 byteArray
 * @param base64 - Base64 字串
 * @returns ByteArray
 */
function base64ToByteArray(base64: string): Uint8Array {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  return byteArray;
}
/**
 * base64字串 轉換為 blob
 * @param file - 檔案
 * @param fileType - 檔案類型
 * @returns Blob
 */
export function covertToBlob(
  file: Blob | string,
  fileType: keyof typeof fileMimeType
): Blob {
  const mimeType = fileMimeType[fileType];

  // base64
  if (typeof file === 'string') {
    // base64 轉 blob
    const byteArray = base64ToByteArray(file);

    file = new Blob([byteArray], {
      type: mimeType,
    });
  }

  return file;
}

/**
 * file 轉 Base64
 * @param file - 欲轉換字串
 * @param removeMimeType - 欲移除的fileMimeType
 * @returns Base64
 */
export function fileToBase64(
  file: File,
  removeMimeType?: (keyof typeof fileMimeType)[]
): Observable<string> {
  return from(
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        let base64Result = reader.result as string;

        if (!isUndefined(removeMimeType)) {
          const fileType = removeMimeType.find(type =>
            base64Result.includes(fileMimeType[type])
          );

          base64Result = base64Result.replace(
            !isUndefined(fileType)
              ? `data:${fileMimeType[fileType]};base64,`
              : '',
            ''
          );
        }
        resolve(base64Result);
      };
      reader.onerror = reject;
    })
  );
}
