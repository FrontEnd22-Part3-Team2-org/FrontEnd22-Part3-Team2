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
                  className="w-full pl-5 py-2 flex items-center gap-3 group"
                >
                  {/* 체크 아이콘 - 호버시에만 아이콘 표시 */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.60892 8.12758L12.5275 0.208998C12.6638 0.0726743 12.8257 0.00303754 13.0132 8.89256e-05C13.2006 -0.00284441 13.3654 0.0667924 13.5076 0.208998C13.6498 0.351188 13.7209 0.514538 13.7209 0.699047C13.7209 0.883542 13.6498 1.04689 13.5076 1.1891L5.18887 9.50783C5.02317 9.67353 4.82985 9.75638 4.60892 9.75638C4.38799 9.75638 4.19467 9.67353 4.02897 9.50783L0.201883 5.68077C0.0655599 5.54444 -0.00172341 5.38256 3.35332e-05 5.19511C0.00180576 5.00767 0.0737871 4.84286 0.215977 4.70066C0.358183 4.55846 0.521533 4.48736 0.706027 4.48736C0.890537 4.48736 1.05389 4.55846 1.19608 4.70066L4.60892 8.12758Z"
                        fill="#787486"
                      />
                    </svg>
                  </span>
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
