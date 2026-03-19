/**
 * @file ColorChip.tsx
 * @description 대시보드에 사용되는 색상 라벨 컴포넌트입니다.
 * 좌측 고정 사이드메뉴(SideMenu)와 대시보드 생성, 수정에서 사용됩니다.
 * @author 수경
 */

// TODO: [수경]

'use client';

import CheckIcon from '@/components/common/Icon/Chip/CheckIcon';
import { useState } from 'react';

const COLORS: { name: string; className: string }[] = [
  { name: 'green', className: 'bg-green-500' },
  { name: 'purple', className: 'bg-purple-400' },
  { name: 'orange', className: 'bg-orange-500' },
  { name: 'blue', className: 'bg-blue-500' },
  { name: 'pink', className: 'bg-pink-500' },
];

export default function ColorChip() {
  // 색상 라벨 선택 상태 관리 (기본값: 첫 번째 라벨)
  const [selected, setSelected] = useState<string>('green');

  const handleClick = (color: string) => {
    setSelected(color);
  };

  return (
    <>
      <div className="flex gap-10">
        {COLORS.map((color) => {
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => handleClick(color.name)}
              className={`w-10 h-10 rounded-full flex items-center justify-center
            ${color.className}`}
            >
              {/* 👉 선택됐을 때만 아이콘 표시 */}
              {selected === color.name && <CheckIcon className="w-4 h-4" />}
            </button>
          );
        })}
      </div>
    </>
  );
}
