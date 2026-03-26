/**
 * @file 대시보드 수정 페이지 ( /dashboard/{id}/edit )
 * @description 대시보드 이름/색상 변경, 구성원 삭제, 새로운 유저 초대 기능을 다루는 화면입니다.
 * @note 구성원 목록과 초대 내역 각각에 대한 페이지네이션 처리가 필요합니다.
 */

import Button from '@/components/common/Button';
import ArrowRightIcon from '@/components/common/Icon/ArrowRightIcon';
import EditDashboardForm from '@/components/dashboard/edit/EditDashboardForm';
import ManageInvitations from '@/components/dashboard/edit/ManageInvitations';
import ManageMembers from '@/components/dashboard/edit/ManageMembers';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardEditPage({ params }: PageProps) {
  const { id } = await params;

  // TODO: API 연동 시 삭제 예정
  const dummyMembers = [
    {
      id: 1,
      userId: 101,
      email: 'jongin@example.com',
      nickname: '종인',
      profileImageUrl: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z').toISOString(),
      updatedAt: new Date('2026-01-10T00:00:00.000Z').toISOString(),
      isOwner: true,
    },
    {
      id: 2,
      userId: 102,
      email: 'suekyung@example.com',
      nickname: '수경',
      profileImageUrl: null,
      createdAt: new Date('2026-01-02T00:00:00.000Z').toISOString(),
      updatedAt: new Date('2026-01-11T00:00:00.000Z').toISOString(),
      isOwner: false,
    },
    {
      id: 3,
      userId: 103,
      email: 'haneul@example.com',
      nickname: '하늘',
      profileImageUrl: null,
      createdAt: new Date('2026-01-03T00:00:00.000Z').toISOString(),
      updatedAt: new Date('2026-01-12T00:00:00.000Z').toISOString(),
      isOwner: false,
    },
    {
      id: 4,
      userId: 104,
      email: 'new_member@example.com',
      nickname: '인영',
      profileImageUrl: null,
      createdAt: new Date('2026-01-03T00:00:00.000Z').toISOString(),
      updatedAt: new Date('2026-01-12T00:00:00.000Z').toISOString(),
      isOwner: false,
    },
    {
      id: 5,
      userId: 105,
      email: 'code_master@example.com',
      nickname: '승미',
      profileImageUrl: null,
      createdAt: new Date('2026-01-03T00:00:00.000Z').toISOString(),
      updatedAt: new Date('2026-01-12T00:00:00.000Z').toISOString(),
      isOwner: false,
    },
    {
      id: 6,
      userId: 106,
      email: 'codeitit@example.com',
      nickname: '코드잇잇',
      profileImageUrl: null,
      createdAt: new Date('2026-01-03T00:00:00.000Z').toISOString(),
      updatedAt: new Date('2026-01-12T00:00:00.000Z').toISOString(),
      isOwner: false,
    },
  ];

  // TODO: API 연동 시 삭제 예정
  const dashboardData = {
    title: '코드잇',
    color: '#760DDE',
  };

  return (
    <div className="w-full bg-gray-100 h-[calc(100dvh-64px)] overflow-y-auto">
      <div className="w-full max-w-[620px] px-[12px] md:px-[20px]">
        <Link
          href={`/dashboard/${id}`}
          className="pt-[16px] flex items-center gap-[6px] md:gap-[8px]"
        >
          <ArrowRightIcon className="w-[18px] rotate-180 md:w-[20px]" />
          <span className="text-md-medium md:text-lg-medium mt-[1px]">
            돌아가기
          </span>
        </Link>

        <div className="mt-[10px] bg-white rounded-[8px] md:mt-[19px] lg:mt-[34px]">
          <EditDashboardForm
            initialTitle={dashboardData.title}
            initialColor={dashboardData.color}
          />
        </div>
        <div className="mt-[16px] h-[337px] bg-white rounded-[8px] md:h-[404px]">
          <ManageMembers data={dummyMembers} dashboardId={id} />
        </div>
        <div className="mt-[16px] h-[407px] bg-white rounded-[8px] md:h-[477px]">
          <ManageInvitations data={dummyMembers} dashboardId={id} />
        </div>

        <div className="mt-[24px] mb-[57px]">
          <Button
            variant="secondary"
            size="delete_dashboard"
            className="bg-gray-100"
          >
            대시보드 삭제하기
          </Button>
        </div>
      </div>
    </div>
  );
}
