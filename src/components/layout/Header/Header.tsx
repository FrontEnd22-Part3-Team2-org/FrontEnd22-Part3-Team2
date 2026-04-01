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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CrownIcon from '@/components/common/Icon/CrownIcon';
import AddBoxIcon from '@/components/common/Icon/AddBoxIcon';
import SettingIcon from '@/components/common/Icon/SettingIcon';
import { getDashboard, getMembers, inviteMember } from '@/api/dashboard';
import { getMe } from '@/api/auth';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useDashboardStore } from '@/store/useDashboardStore';
import UserProfileImage from '@/components/common/User/UserProfileImage';
import Skeleton from '@/components/common/Skeleton/Skeleton';
import FormModal from '@/components/Modal/FormModal';
import ModalOverlay from '@/components/common/ModalBase/ModalOverlay';

const MAX_VISIBLE_MEMBERS_DESKTOP = 4;
const MAX_VISIBLE_MEMBERS_COMPACT = 2;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Header() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeDashboardId = useDashboardStore((s) => s.activeDashboardId);
  const queryClient = useQueryClient();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maxVisibleMembers, setMaxVisibleMembers] = useState(
    MAX_VISIBLE_MEMBERS_DESKTOP,
  );

  const PAGE_TITLES: Record<string, string> = {
    '/mydashboard': '내 대시보드',
    '/mypage': '계정관리',
  };
  const staticTitle = PAGE_TITLES[pathname] ?? null;

  const dashboardId = params?.id ? Number(params.id) : null;

  /** URL에 id가 없으면 스토어의 마지막 방문 대시보드 사용 */
  const effectiveDashboardId = dashboardId ?? activeDashboardId;

  const { data: dashboard, isLoading: isDashboardLoading } = useQuery({
    queryKey: QUERY_KEYS.dashboard(effectiveDashboardId!),
    queryFn: () => getDashboard(effectiveDashboardId!),
    enabled: !!effectiveDashboardId,
  });

  const { data: membersData, isLoading: isMembersLoading } = useQuery({
    queryKey: QUERY_KEYS.members(effectiveDashboardId!),
    queryFn: () => getMembers(effectiveDashboardId!),
    enabled: !!effectiveDashboardId,
  });

  const { data: me, isLoading: isMeLoading } = useQuery({
    queryKey: QUERY_KEYS.me(),
    queryFn: getMe,
  });

  useEffect(() => {
    const updateVisibleMembers = () => {
      setMaxVisibleMembers(
        window.innerWidth < 1024
          ? MAX_VISIBLE_MEMBERS_COMPACT
          : MAX_VISIBLE_MEMBERS_DESKTOP,
      );
    };

    updateVisibleMembers();
    window.addEventListener('resize', updateVisibleMembers);
    return () => window.removeEventListener('resize', updateVisibleMembers);
  }, []);

  const members = membersData?.members ?? [];
  const visibleMembers = members.slice(0, maxVisibleMembers);
  const extraCount = Math.max(0, members.length - maxVisibleMembers);

  const handleManageClick = () => {
    if (dashboardId) {
      router.push(`/dashboard/${dashboardId}/edit`);
    }
  };

  const inviteMutation = useMutation({
    mutationFn: (email: string) => inviteMember(effectiveDashboardId!, email),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['invitations', effectiveDashboardId],
      });
      closeInviteModal();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (message === '이미 대시보드에 초대된 멤버입니다.') {
          setInviteError('이미 대시보드에 초대된 멤버입니다.');
          return;
        }
        if (message === '이메일 형식이 올바르지 않습니다') {
          setInviteError('이메일 형식으로 작성해 주세요.');
          return;
        }
        if (message === '대시보드 초대 권한이 없습니다.') {
          setInviteError('초대 권한이 없습니다.');
          return;
        }
        if (message === '대시보드가 존재하지 않습니다.') {
          setInviteError('대시보드를 찾을 수 없습니다.');
          return;
        }
      }
      setInviteError('초대에 실패했습니다. 다시 시도해 주세요.');
    },
  });

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteEmail('');
    setInviteError('');
    setIsSubmitting(false);
  };

  const handleEmailChange = (value: string) => {
    setInviteEmail(value);
    if (!value.trim()) {
      setInviteError('');
      return;
    }
    if (!emailRegex.test(value.trim())) {
      setInviteError('이메일 형식으로 작성해 주세요.');
      return;
    }
    setInviteError('');
  };

  const handleInviteConfirm = async () => {
    const trimmed = inviteEmail.trim();
    if (!trimmed) return;
    if (!emailRegex.test(trimmed)) {
      setInviteError('이메일 형식으로 작성해 주세요.');
      return;
    }
    try {
      setIsSubmitting(true);
      setInviteError('');
      await inviteMutation.mutateAsync(trimmed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInviteDisabled = !inviteEmail.trim() || !!inviteError || isSubmitting;

  return (
    <>
      <header className="flex h-[64px] w-full items-center justify-between shrink-0 border-b border-gray-200 bg-white px-3 md:px-5 lg:px-8">
        {/* ── 좌측: 대시보드 타이틀 ── */}
        <div className="flex min-w-0 items-center gap-2">
          {isDashboardLoading && !staticTitle ? (
            <Skeleton className="hidden lg:block h-6 w-36 rounded" />
          ) : (
            <>
              <h1 className="hidden lg:block truncate text-xl-bold text-gray-700">
                {staticTitle ?? dashboard?.title ?? ''}
              </h1>
              {!staticTitle && dashboard?.createdByMe && (
                <CrownIcon className="hidden lg:block h-[20px] w-[16px] shrink-0" />
              )}
            </>
          )}
        </div>

        {/* ── 우측: 버튼 + 멤버 아바타 + 프로필 ── */}
        <div className="flex min-w-0 items-center gap-2 md:gap-3 lg:gap-4">
          {isDashboardLoading && dashboardId ? (
            <>
              <Skeleton className="h-[40px] w-[72px] rounded-[8px]" />
              <Skeleton className="h-[40px] w-[88px] rounded-[8px]" />
            </>
          ) : (
            <>
              {dashboardId && dashboard?.createdByMe && (
                <button
                  type="button"
                  onClick={handleManageClick}
                  className="flex h-[32px] md:h-[36px] lg:h-[40px] items-center gap-1.5 md:gap-2 rounded-[8px] border border-gray-300 bg-white px-2 md:px-3 lg:px-4 text-xs-medium md:text-md-medium text-gray-500 shrink-0"
                >
                  <SettingIcon className="h-[16px] w-[16px] md:h-[18px] md:w-[18px] lg:h-[20px] lg:w-[20px]" />
                  <span className="hidden md:inline">관리</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsInviteModalOpen(true)}
                className="flex h-[32px] md:h-[36px] lg:h-[40px] items-center gap-1.5 md:gap-2 rounded-[8px] border border-gray-300 bg-white px-2 md:px-3 lg:px-4 text-xs-medium md:text-md-medium text-gray-500 shrink-0"
              >
                <AddBoxIcon className="h-[16px] w-[16px] md:h-[18px] md:w-[18px] lg:h-[20px] lg:w-[20px]" />
                <span className="hidden md:inline">초대하기</span>
              </button>
            </>
          )}

          <div className="ml-1 flex min-w-0 items-center gap-0">
            {/* 멤버 아바타 */}
            {isMembersLoading && dashboardId ? (
              <div className="flex items-center">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-[38px] h-[38px] rounded-full border-2 border-white"
                    style={{ marginLeft: i !== 0 ? '-8px' : undefined }}
                  />
                ))}
              </div>
            ) : (
              visibleMembers.length > 0 && (
                <div className="flex items-center shrink-0">
                  {visibleMembers.map((member, index) => (
                    <div
                      key={member.id}
                      title={member.nickname}
                      style={{
                        marginLeft: index !== 0 ? '-8px' : undefined,
                        zIndex: index + 1,
                      }}
                    >
                      <UserProfileImage
                        profile={member}
                        index={index}
                        size={38}
                      />
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
              )
            )}

            {/* 내 프로필 */}
            {isMeLoading ? (
              <div className="ml-2 md:ml-4 lg:ml-6 flex items-center gap-2 md:gap-3 border-l border-gray-300 pl-2 md:pl-4 lg:pl-6 shrink-0">
                <Skeleton className="w-[38px] h-[38px] rounded-full shrink-0" />
                <Skeleton className="h-4 w-20 rounded hidden lg:block" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => router.push('/mypage')}
                className="ml-2 md:ml-4 lg:ml-6 flex items-center gap-2 md:gap-3 border-l border-gray-300 pl-2 md:pl-4 lg:pl-6 hover:opacity-80 transition-opacity shrink-0"
              >
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full overflow-hidden bg-[#A3C4A2] text-lg-medium text-white shrink-0">
                  {me?.profileImageUrl ? (
                    <Image
                      src={me.profileImageUrl}
                      alt={me.nickname}
                      width={38}
                      height={38}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  ) : (
                    (me?.nickname?.[0]?.toUpperCase() ?? 'U')
                  )}
                </div>
                <span className="hidden lg:inline text-lg-medium text-gray-700">
                  {me?.nickname ?? ''}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {isInviteModalOpen && (
        <ModalOverlay onClose={closeInviteModal}>
          <FormModal
            title="멤버 초대"
            label="이메일"
            value={inviteEmail}
            placeholder="이메일을 입력해 주세요"
            cancelText="취소"
            confirmText="초대"
            errorText={inviteError}
            showCloseButton
            disabled={isInviteDisabled}
            onChange={handleEmailChange}
            onCancel={closeInviteModal}
            onClose={closeInviteModal}
            onConfirm={handleInviteConfirm}
          />
        </ModalOverlay>
      )}
    </>
  );
}
