/**
 * @file XIcon.tsx
 * @description 엑스 모양 아이콘 컴포넌트입니다. 모달을 닫을 때 사용합니다.
 * @author 수경
 */

import { SVGProps } from 'react';

export default function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17 7L7 17"
        stroke="#6B6B6B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 7L17 17"
        stroke="#6B6B6B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
