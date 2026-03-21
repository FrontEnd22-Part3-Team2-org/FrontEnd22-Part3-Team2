/**
 * @file 서비스 랜딩 페이지 ( / )
 * @description Taskify 서비스에 처음 접속했을 때 보이는 소개 화면입니다.
 * @note 비로그인 유저도 접근할 수 있어야 하며, 서비스의 장점을 어필하는 UI 위주로 구성됩니다.
 */

'use client';

import { Status } from '@/components/common/Chip/StatusConfig';
import DropdownMenu from '@/components/common/Dropdown/DropdownMenu';
import DropdownProgress from '@/components/common/Dropdown/DropdownProgress';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [value, setValue] = useState('To Do');
  const test = (v: string) => {
    console.log(`${v} 버튼 클릭`);
  };

  const handleChange = (data: Status) => {
    console.log(data);
    setValue(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <DropdownProgress value={value} onChange={handleChange} />
      <DropdownMenu onEdit={() => test('수정')} onDelete={() => test('삭제')} />
      <Link
        href="/login"
        className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
      >
        로그인
      </Link>
    </div>
  );
}
