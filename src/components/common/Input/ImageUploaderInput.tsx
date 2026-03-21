/**
 * @file ImageUploaderInput.tsx
 * @description 이미지 업로드 및 미리보기 컴포넌트입니다.
 *
 * @author 수경
 *
 * @example
 * <ImageUploaderInput />
 * <ImageUploaderInput size={178} />
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import ImageUploaderChip from '../Chip/ImageUploaderChip';
import Image from 'next/image';

interface Props {
  /**
   * 버튼 크기 및 미리보기 이미지 사이즈를 제어합니다.
   * @default 76
   */
  size?: number;
}

/**
 * 이미지 업로드 및 미리보기 컴포넌트입니다.
 */
export default function ImageUploaderInput({ size = 76 }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  /** 파일(input[type="file"]) 변경 시 실행되는 핸들러 */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    /** 선택된 파일 중 첫 번째 파일 가져오기 */
    const selected = e.target.files?.[0];

    /** 파일이 선택되지 않은 경우 (취소 버튼 등) */
    if (!selected) {
      setFile(null); // 파일 상태 초기화
      setImageUrl(''); // 미리보기 이미지 초기화
      return;
    }
    /** 이미지 파일이 아닌 경우 필터링 */
    if (!selected.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    /** 선택된 파일을 브라우저에서 미리보기 가능한 blob URL로 변환 */
    const blobUrl = URL.createObjectURL(selected);
    setFile(selected); // 실제 파일 저장 (서버 업로드용)
    setImageUrl(blobUrl); // 미리보기용 URL 저장
  };

  /** 업로드 버튼 클릭 시 숨겨진 input[type="file"]을 트리거하는 함수 */
  const handleUploadClick = () => {
    inputRef.current?.click(); // 파일 선택 창 열기
  };

  useEffect(() => {
    return () => {
      /** 기존에 생성된 blob URL이 있다면 메모리에서 해제 */
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  return (
    <div>
      {/* 숨겨진 input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        ref={inputRef}
        className="hidden"
      />

      {/* 버튼, 이미지 UI */}
      <button
        onClick={handleUploadClick}
        className="relative group"
        style={{ width: size, height: size }}
      >
        {/* 이미지 업로드 여부에 따라 미리보기 또는 업로드 버튼 UI 렌더링 */}
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt="이미지 미리보기"
              fill
              className="object-cover rounded-md"
            />

            {/* hover 오버레이 */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition rounded-md flex items-center justify-center">
              {/* 펜 아이콘 */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.12981 21.2499C0.809708 21.2499 0.541385 21.1417 0.324843 20.9251C0.108281 20.7086 0 20.4402 0 20.1201V17.9543C0 17.6495 0.0584999 17.3589 0.1755 17.0827C0.292479 16.8064 0.453531 16.5657 0.658656 16.3606L16.488 0.538469C16.677 0.366782 16.8857 0.234114 17.1141 0.140469C17.3425 0.0468228 17.582 0 17.8327 0C18.0833 0 18.326 0.0444798 18.561 0.133438C18.7959 0.222376 19.0039 0.363792 19.185 0.557688L20.7115 2.10334C20.9054 2.28443 21.0436 2.4928 21.1261 2.72847C21.2087 2.96412 21.2499 3.19976 21.2499 3.43541C21.2499 3.68676 21.207 3.92664 21.1212 4.15503C21.0353 4.38345 20.8988 4.59217 20.7115 4.78119L4.88934 20.5913C4.68422 20.7964 4.44353 20.9575 4.16728 21.0744C3.89101 21.1914 3.60046 21.2499 3.29562 21.2499H1.12981ZM17.5649 5.24275L19.375 3.44466L17.8053 1.87497L16.0072 3.68506L17.5649 5.24275Z"
                  fill="white"
                />
              </svg>
            </div>
          </>
        ) : (
          <ImageUploaderChip size={size} />
        )}
      </button>
    </div>
  );
}
