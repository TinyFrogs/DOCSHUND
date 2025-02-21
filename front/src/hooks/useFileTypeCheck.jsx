import { useState, useCallback } from "react";

// 파일 시그니처 정의
const FILE_SIGNATURES = {
  jpg: [
    [0xff, 0xd8, 0xff, 0xe0], // JPEG/JFIF
    [0xff, 0xd8, 0xff, 0xe1], // JPEG/Exif
    [0xff, 0xd8, 0xff, 0xe8], // JPEG/SPIFF
  ],
  png: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  gif: [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  ],
  webp: [[0x52, 0x49, 0x46, 0x46]],
};

const UseFileTypeCheck = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState(null);

  // 파일의 헤더 부분을 읽는 함수
  const readFileHeader = useCallback((file, bufferSize) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const buffer = new Uint8Array(e.target.result);
        resolve(buffer);
      };

      reader.onerror = () => {
        reject(new Error("파일을 읽는 중 오류가 발생했습니다."));
      };

      const blob = file.slice(0, bufferSize);
      reader.readAsArrayBuffer(blob);
    });
  }, []);

  // 버퍼와 시그니처 비교 함수
  const matchesSignature = useCallback((buffer, signature) => {
    return signature.every((byte, index) => buffer[index] === byte);
  }, []);

  // 파일 시그니처 확인 함수
  const checkFileSignature = useCallback(
    (buffer) => {
      for (const [format, signatures] of Object.entries(FILE_SIGNATURES)) {
        for (const signature of signatures) {
          if (matchesSignature(buffer, signature)) {
            return true;
          }
        }
      }
      return false;
    },
    [matchesSignature]
  );

  // 파일 검증 함수
  const validateImageFile = useCallback(
    async (file) => {
      setIsValidating(true);
      setError(null);

      try {
        if (!file || !(file instanceof File)) {
          throw new Error("유효하지 않은 파일입니다.");
        }

        const bufferSize = 8;
        const buffer = await readFileHeader(file, bufferSize);
        const isValid = checkFileSignature(buffer);

        if (!isValid) {
          throw new Error("유효하지 않은 이미지 파일입니다.");
        }

        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setIsValidating(false);
      }
    },
    [readFileHeader, checkFileSignature]
  );

  return {
    validateImageFile,
    isValidating,
    error,
  };
};

export default UseFileTypeCheck;
