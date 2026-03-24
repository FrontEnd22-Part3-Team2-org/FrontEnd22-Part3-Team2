/**
 * @file DropdownProgress.tsx
 * @description 진행 상태를 선택할 수 있는 드롭다운 메뉴 컴포넌트입니다.
 * 할 일 카드에서 사용됩니다.
 *
 * @author 수경
 */

'use client';

import { useState } from 'react';
import StatusChip from '../Chip/StatusChip';
import { Status, STATUS_LIST } from '../Chip/StatusConfig';
import ArrowDropDownIcon from '../Icon/ArrowDropDownIcon';
import DropdownList from './DropdownList';

interface Props {
  value: Status;
  onChange: (status: Status) => void;
}

export default function DropdownProgress({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  function handleSelect(status: Status) {
    onChange(status);
    setOpen(false);
  }
  return (
    <>
      <div className="relative min-w-[217px]">
        {/* 선택된 값 */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full h-[48px] border border-gray-300 px-4 py-2 rounded-md flex justify-between items-center bg-white"
        >
          <StatusChip status={value} />
          <ArrowDropDownIcon className="w-5 h-5" />
        </button>

        {/* 진행 상태 리스트 */}
        <DropdownList
          open={open}
          items={Object.values(STATUS_LIST)}
          onSelect={handleSelect}
          getKey={(status) => status}
          renderItem={(status) => <StatusChip status={status} />}
        />
      </div>
    </>
  );
}
