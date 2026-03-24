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
import { Assignee } from '@/types/dashboard';
import DropdownList from './DropdownList';

// TODO : [수경] 인풋 입력값에 따른 리스트 변화 기능 구현
/** 임시 mock 데이터 */
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
    profileImageUrl: '',
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

interface AssigneeProps {
  /** @defalut '이름을 입력해 주세요' */
  placeholder?: string;
}

export default function DropdownAssignee({
  placeholder = '이름을 입력해 주세요',
}: AssigneeProps) {
  const [query, setQuery] = useState(''); // 인풋 입력값 관리
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);

  const [selectedUser, setSelectedUser] = useState<Assignee | null>(null); // 선택된 담당자 값 관리

  /** Input과 담당자가 선택된 박스의 공통 css */
  const baseStyle =
    'w-full h-[48px] border border-gray-300 px-4 py-2 rounded-md flex justify-between items-center bg-white';

  return (
    <div className="relative min-w-[217px]">
      {/* 선택을 안했을 때는 입력 input 렌더링, 선택 했을 때는 사용자 이름 및 아이콘 렌더링 */}
      {selected ? (
        <button
          type="button"
          className={`${baseStyle}`}
          onClick={() => {
            setSelected(false);
            setOpen(true);
          }}
        >
          {/* selectedUser가 있을 때만 렌더링 */}
          {selectedUser && (
            <>
              <UserName
                profile={{
                  nickname: selectedUser.nickname,
                  profileImageUrl: selectedUser.profileImageUrl,
                }}
              />
              <ArrowDropDownIcon className="w-5 h-5" />
            </>
          )}
        </button>
      ) : (
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={`${baseStyle} outline-none text-gray-700 placeholder:text-gray-400`}
        />
      )}

      {/* 담당자 리스트 */}
      <DropdownList
        open={open}
        items={Object.values(MOCK_ASSIGNEE)}
        onSelect={(user) => {
          setQuery(user.nickname);
          setOpen(false);
          setSelected(true);
          setSelectedUser(user);
        }}
        getKey={(user) => user.id}
        renderItem={(user) => <UserName profile={user} />}
      />
    </div>
  );
}
