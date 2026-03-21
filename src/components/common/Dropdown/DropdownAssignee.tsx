/**
 * @file DropdownAssignee.tsx
 * @description
 *
 * ### 할 일 생성 로직
 * 1. GET /members API 호출
 * 2. 대시보드 멤버 목록 가져오기
 *
 * ### 할 일 수정 로직
 * 1. GET /cards API 호출 , GET /members API 호출
 * 2. 담당자 정보(cards.assignee) 값 가져오기
 * 3. 가져온 담당자 정보 렌더링
 * 4. 드롭다운에는 대시보드 멤버 목록 보여주기
 *
 * @author 수경
 */

'use client';
import { useState } from 'react';
import ArrowDropDownIcon from '../Icon/ArrowDropDownIcon';
import UserName from '../User/UserName';

/**
 * 임시 mock 데이터 및 타입 정의
 */
// TODO : [수경] API 연동 후 재정의 필요
interface Assignee {
  id: number;
  nickname: string;
  profileImageUrl: string;
}
const MOCK_ASSIGNEE: Assignee[] = [
  {
    id: 1,
    nickname: '공민수',
    profileImageUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    nickname: '이지은',
    profileImageUrl: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    nickname: '김현우',
    profileImageUrl: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 4,
    nickname: '이수빈',
    profileImageUrl: '',
  },
  {
    id: 5,
    nickname: '문지훈',
    profileImageUrl: 'https://i.pravatar.cc/150?img=5',
  },
];

export default function DropdownAssignee({}) {
  const [query, setQuery] = useState(''); // 인풋 입력값 관리
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);

  /** Input과 담당자가 선택된 박스의 공통 css */
  const baseStyle =
    'min-w-[217px] h-12 border border-gray-300 rounded-md bg-white px-4 py-2';

  return (
    <div className="relative">
      {/* 선택된 값 */}
      {selected ? (
        <div
          className={`${baseStyle} flex justify-between items-center cursor-pointer`}
          onClick={() => {
            setSelected(false);
            setOpen(true);
          }}
        >
          {/* 임시 코드 */}
          <UserName
            assignee={{
              id: 5,
              nickname: '문지훈',
              profileImageUrl: 'https://i.pravatar.cc/150?img=5',
            }}
          />
          <ArrowDropDownIcon className="w-5 h-5" />
        </div>
      ) : (
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="담당자 이름 입력"
          className={`${baseStyle} outline-none text-gray-700 placeholder:text-gray-400 w-full`}
        />
      )}

      {/* 옵션 리스트 */}
      {open && (
        <div className="absolute mt-1 w-full border rounded bg-white shadow">
          {Object.values(MOCK_ASSIGNEE).map((user) => {
            console.log(user);
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  setQuery(user.nickname); // 선택 시 input 값 변경
                  setOpen(false);
                  setSelected(true);
                }}
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

                {/* 임시 태그 */}
                <UserName assignee={user} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
