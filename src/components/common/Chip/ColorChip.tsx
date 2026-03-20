/**
 * @file ColorChip.tsx
 * @description 대시보드에 사용되는 색상 라벨 컴포넌트입니다.
 * 좌측 고정 사이드메뉴(SideMenu)와 대시보드 생성, 수정에서 사용됩니다.
 */

// TODO: [수경] 버튼 클릭 시 부모 컴포넌트로 색상 값 보내줘야 함

'use client';

import { useState } from 'react';

const COLORS = [
  { name: 'green', className: 'bg-green' }, // #7AC555
  { name: 'purple', className: 'bg-purple' }, // #760DDE
  { name: 'orange', className: 'bg-orange' }, // #FFA500
  { name: 'blue', className: 'bg-blue' }, // #76A5EA
  { name: 'pink', className: 'bg-pink' }, // #E876EA
];

export default function ColorChip() {
  // 색상 라벨 선택 상태 관리 (기본값: 첫 번째 라벨)
  const [selected, setSelected] = useState<string>('green');

  const handleClick = (color: string) => {
    setSelected(color);
  };

  return (
    <>
      <div className="flex gap-2">
        {COLORS.map((color) => {
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => handleClick(color.name)}
              className={`w-7 h-7 rounded-full flex items-center justify-center
            ${color.className}`}
            >
              {/* 선택됐을 때만 아이콘 표시 */}
              {selected === color.name && (
                <svg
                  width="15"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.288 8.775L13.763 0.3C13.963 0.1 14.2005 0 14.4755 0C14.7505 0 14.988 0.1 15.188 0.3C15.388 0.5 15.488 0.7375 15.488 1.0125C15.488 1.2875 15.388 1.525 15.188 1.725L5.988 10.925C5.788 11.125 5.55467 11.225 5.288 11.225C5.02133 11.225 4.788 11.125 4.588 10.925L0.288 6.625C0.088 6.425 -0.00783333 6.1875 0.0005 5.9125C0.00883333 5.6375 0.113 5.4 0.313 5.2C0.513 5 0.7505 4.9 1.0255 4.9C1.3005 4.9 1.538 5 1.738 5.2L5.288 8.775Z"
                    fill="white"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
