/**
 * @file DropdownProgress.tsx
 * @description 진행 상태를 선택할 수 있는 드롭다운 메뉴 컴포넌트입니다.
 * 할 일 카드에서  사용됩니다.
 *
 * @author 수경
 */

'use client';

import { useState } from 'react';
import StatusChip from '../Chip/StatusChip';
import { Status, STATUS_LIST } from '../Chip/StatusConfig';
import ArrowDropDownIcon from '../Icon/ArrowDropDownIcon';

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
          className="w-full border-gray-300 px-4 py-2 rounded-md flex justify-between items-center bg-white"
        >
          <StatusChip status={value} />
          <ArrowDropDownIcon className="w-5 h-5" />
        </button>

        {/* 옵션 리스트 */}
        {open && (
          <div className="absolute mt-1 w-full border rounded bg-white shadow">
            {Object.values(STATUS_LIST).map((status) => {
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleSelect(status)}
                  className="w-full pl-11 py-2 hover:bg-gray-100 flex"
                >
                  <StatusChip status={status} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

/**
 * @description 부모 컴포넌트에 사용할 코드
 */

// export default function ParentComponent() {
//   const [value, setValue] = useState('To Do');
//   const handleChange = (data: Status) => {
//     console.log(data);
//     setValue(data);
//   };
//   return (
//     <DropdownProgress value={value} onChange={handleChange} />
//   )
// }
