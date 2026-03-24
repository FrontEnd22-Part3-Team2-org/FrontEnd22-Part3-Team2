// 이 파일의 모든 내용은 주석 사용 예시를 위함입니다! 편히 수정하셔요

/**
 * @file Header.tsx
 * @description 서비스 상단에 고정되는 공통 헤더(GNB) 컴포넌트입니다.
 * 현재 선택된 대시보드의 타이틀, 참여 멤버 프로필 칩, 내 프로필을 표시합니다.
 * @author 승미
 * * @notes
 * - 접속한 라우트 경로(pathname)에 따라 우측 버튼('관리', '초대하기') 노출 여부가 달라집니다.
 * - 내 정보 및 알림 드롭다운 조작을 위해 'use client'가 선언되어 있습니다.
 */

'use client';

import CrownIcon from '@/components/common/Icon/CrownIcon';
import AddBoxIcon from '@/components/common/Icon/AddBoxIcon';
import SettingIcon from '@/components/common/Icon/SettingIcon';

type Member = {
  id: number;
  name: string;
  bgColor: string;
};

const members: Member[] = [
  { id: 1, name: 'Y', bgColor: 'bg-[#FFC85A]' },
  { id: 2, name: 'C', bgColor: 'bg-[#FDD446]' },
  { id: 3, name: 'K', bgColor: 'bg-[#9DD7ED]' },
  { id: 4, name: 'J', bgColor: 'bg-[#C4B1A2]' },
];

export default function Header() {
  return (
    <header className="flex h-[64px] w-full items-center justify-between shrink-0 border-b border-gray-200 bg-white px-8">
      <div className="flex min-w-0 items-center gap-2">
        <h1 className="truncate text-xl-bold text-gray-700">비브리지</h1>
        <CrownIcon className="h-[20px] w-[16px] shrink-0" />
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <button
          type="button"
          className="flex h-[40px] items-center gap-2 rounded-[8px] border border-gray-300 bg-white px-4 text-md-medium text-gray-500"
        >
          <SettingIcon className="h-[20px] w-[20px]" />
          관리
        </button>

        <button
          type="button"
          className="flex h-[40px] items-center gap-2 rounded-[8px] border border-gray-300 bg-white px-4 text-md-medium text-gray-500"
        >
          <AddBoxIcon className="h-[20px] w-[20px]" />
          초대하기
        </button>

        <div className="ml-1 flex items-center">
          <div className="flex items-center">
            {members.map((member, index) => (
              <div
                key={member.id}
                className={`relative flex h-[38px] w-[38px] items-center justify-center rounded-full border-2 border-white text-md-semibold text-white ${member.bgColor} ${
                  index !== 0 ? '-ml-2' : ''
                }`}
                style={{
                  zIndex: index + 1,
                }}
                title={member.name}
              >
                {member.name}
              </div>
            ))}

            <div
              className="-ml-2 flex h-[38px] min-w-[38px] items-center justify-center rounded-full border-2 border-white bg-[#F4D7DA] px-[8px] text-xs-semibold text-[#D25B68]"
              style={{ zIndex: members.length + 1 }}
            >
              +2
            </div>
          </div>

          <div className="ml-6 flex items-center gap-3 border-l border-gray-300 pl-6">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#A3C4A2] text-lg-medium text-white">
              B
            </div>
            <span className="text-lg-medium text-gray-700">배유철</span>
          </div>
        </div>
      </div>
    </header>
  );
}
