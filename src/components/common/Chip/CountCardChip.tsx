/**
 * @file CountCardChip.tsx
 * @description 할 일 카드의 개수를 보여주는 컴포넌트입니다.
 * 대시보드 내 진행 상태에 따라 할 일 카드의 개수를 보여줍니다.
 *
 * @author 수경
 */

// TODO: [수경] 부모 컴포넌트로부터 prop을 받아서 화면에 보여주도록 수정 필요

'use client';

import { useState } from 'react';

export default function CountCardChip() {
  const [count, setCount] = useState<number>(5);

  return (
    <>
      <div className="w-5 h-5 flex items-center justify-center rounded bg-[#EEEEEE]">
        <span className="text-[#787486] text-xs-medium">{count}</span>
      </div>
    </>
  );
}
