// 이 파일의 모든 내용은 주석 사용 예시를 위함입니다! 편히 수정하셔요

/**
 * @file Header.tsx
 * @description 서비스 상단에 고정되는 공통 헤더(GNB) 컴포넌트입니다.
 * 현재 선택된 대시보드의 타이틀, 참여 멤버 프로필 칩, 내 프로필을 표시합니다.
 * @author 승미, 하늘
 * * @notes
 * - 접속한 라우트 경로(pathname)에 따라 우측 버튼('관리', '초대하기') 노출 여부가 달라집니다.
 * - 내 정보 및 알림 드롭다운 조작을 위해 'use client'가 선언되어 있습니다.
 */

'use client';

import { useParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import CrownIcon from '@/components/common/Icon/CrownIcon';
import AddBoxIcon from '@/components/common/Icon/AddBoxIcon';
import SettingIcon from '@/components/common/Icon/SettingIcon';
import { getDashboard, getMembers } from '@/api/dashboard';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useDashboardStore } from '@/store/useDashboardStore';
import UserProfileImage from '@/components/common/User/UserProfileImage';

const MAX_VISIBLE_MEMBERS = 4;

/** 프로필 이미지 없을 때 순서에 따라 순환하는 배경색 */
const CHIP_COLORS = [
  '#FFC85A',
  '#FDD446',
  '#9DD7ED',
  '#C4B1A2',
  '#A3C4A2',
  '#C4A3BD',
];

export default function Header() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeDashboardId = useDashboardStore((s) => s.activeDashboardId);

  const PAGE_TITLES: Record<string, string> = {
    '/mydashboard': '내 대시보드',
    '/mypage': '계정관리',
  };
  const staticTitle = PAGE_TITLES[pathname] ?? null;

  const dashboardId = params?.id ? Number(params.id) : null;

  /** URL에 id가 없으면 스토어의 마지막 방문 대시보드 사용 */
  const effectiveDashboardId = dashboardId ?? activeDashboardId;

  const { data: dashboard } = useQuery({
    queryKey: QUERY_KEYS.dashboard(effectiveDashboardId!),
    queryFn: () => getDashboard(effectiveDashboardId!),
    enabled: !!effectiveDashboardId,
  });

  const { data: membersData } = useQuery({
    queryKey: QUERY_KEYS.members(effectiveDashboardId!),
    queryFn: () => getMembers(effectiveDashboardId!),
    enabled: !!effectiveDashboardId,
  });

  const members = membersData?.members ?? [];
  const visibleMembers = members.slice(0, MAX_VISIBLE_MEMBERS);
  const extraCount = Math.max(0, members.length - MAX_VISIBLE_MEMBERS);

  const handleManageClick = () => {
    if (dashboardId) {
      router.push(`/dashboard/${dashboardId}/edit`);
    }
  };

  return (
    <header className="flex h-[64px] w-full items-center justify-between shrink-0 border-b border-gray-200 bg-white px-8">
      <div className="flex min-w-0 items-center gap-2">
        <h1 className="hidden lg:block truncate text-xl-bold text-gray-700">
          {staticTitle ?? dashboard?.title ?? ''}
        </h1>
        {!staticTitle && dashboard?.createdByMe && (
          <CrownIcon className="hidden lg:block h-[20px] w-[16px] shrink-0" />
        )}
      </div>

      <div className="flex shrink-0 items-center gap-4">
        {dashboard?.createdByMe && (
          <button
            type="button"
            onClick={handleManageClick}
            className="flex h-[40px] items-center gap-2 rounded-[8px] border border-gray-300 bg-white px-4 text-md-medium text-gray-500"
          >
            <SettingIcon className="h-[20px] w-[20px]" />
            관리
          </button>
        )}

        <button
          type="button"
          className="flex h-[40px] items-center gap-2 rounded-[8px] border border-gray-300 bg-white px-4 text-md-medium text-gray-500"
        >
          <AddBoxIcon className="h-[20px] w-[20px]" />
          초대하기
        </button>

        <div className="ml-1 flex items-center gap-0">
          {visibleMembers.length > 0 && (
            <div className="flex items-center">
              {visibleMembers.map((member, index) => (
                <div
                  key={member.id}
                  title={member.nickname}
                  style={{
                    marginLeft: index !== 0 ? '-8px' : undefined,
                    zIndex: index + 1,
                  }}
                >
                  <UserProfileImage profile={member} index={index} size={38} />
                </div>
              ))}

              {extraCount > 0 && (
                <div
                  className="-ml-2 flex h-[38px] min-w-[38px] items-center justify-center rounded-full border-2 border-white bg-[#F4D7DA] px-[8px] text-xs-semibold text-[#D25B68]"
                  style={{ zIndex: visibleMembers.length + 1 }}
                >
                  +{extraCount}
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => router.push('/mypage')}
            className="ml-6 flex items-center gap-3 border-l border-gray-300 pl-6 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#A3C4A2] text-lg-medium text-white">
              B
            </div>
            <span className="text-lg-medium text-gray-700">배유철</span>
          </button>
        </div>
      </div>
    </header>
  );
}
