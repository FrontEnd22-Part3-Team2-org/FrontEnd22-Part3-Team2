/**
 * @file 계정 관리 페이지 ( /mypage )
 * @description 유저의 프로필 이미지, 닉네임, 비밀번호를 수정하는 마이페이지입니다.
 * @note 프로필 이미지 업로드 API 연동과, 현재 비밀번호 검증 로직이 포함됩니다.
 */

'use client';

import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Input from '@/components/common/Input/Input';
import Button from '@/components/common/Button';
import {
  getMyInfo,
  updateMyInfo,
  uploadProfileImage,
  changePassword,
} from '@/api/user';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { clearToken, getToken } from '@/lib/auth'; // ✅ 추가

export default function MyPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  // ✅ 추가 (로그인 체크)
  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace('/');
    }
  }, [router]);

  const { data: myInfo, isLoading } = useQuery({
    queryKey: QUERY_KEYS.me(),
    queryFn: getMyInfo,
  });

  const initialEmail = myInfo?.email ?? '';
  const initialNickname = myInfo?.nickname ?? '';
  const initialProfileImageUrl = myInfo?.profileImageUrl ?? null;

  const [nickname, setNickname] = useState<string | undefined>(undefined);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(
    undefined,
  );
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const currentNickname = nickname ?? initialNickname;
  const currentPreviewImageUrl = previewImageUrl ?? initialProfileImageUrl;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);

  const isNicknameChanged =
    nickname !== undefined && currentNickname !== initialNickname;
  const isImageChanged = selectedImageFile !== null;
  const isProfileChanged = isNicknameChanged || isImageChanged;

  const isPasswordFormValid =
    currentPassword !== '' && newPassword !== '' && confirmPassword !== '';

  const uploadProfileImageMutation = useMutation({
    mutationFn: uploadProfileImage,
  });

  const updateMyInfoMutation = useMutation({
    mutationFn: updateMyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me() });
      alert('프로필이 업데이트되었습니다.');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      alert('비밀번호가 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordMismatch(false);
    },
  });

  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  const handleCurrentPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleConfirmPasswordBlur = () => {
    if (newPassword !== confirmPassword) {
      setIsPasswordMismatch(true);
    } else {
      setIsPasswordMismatch(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!isPasswordFormValid) return;

    if (newPassword !== confirmPassword) {
      setIsPasswordMismatch(true);
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        password: currentPassword,
        newPassword,
      });
    } catch {
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const handleProfileImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];
    if (!imageFile) return;

    const objectUrl = URL.createObjectURL(imageFile);

    setSelectedImageFile(imageFile);
    setPreviewImageUrl(objectUrl);

    event.target.value = '';
  };

  const handleProfileSave = async () => {
    if (!isProfileChanged) return;

    try {
      let profileImageUrl = currentPreviewImageUrl ?? null;

      if (selectedImageFile) {
        const uploadResult =
          await uploadProfileImageMutation.mutateAsync(selectedImageFile);
        profileImageUrl = uploadResult.profileImageUrl;
      }

      await updateMyInfoMutation.mutateAsync({
        nickname: currentNickname,
        profileImageUrl,
      });

      setSelectedImageFile(null);
      setPreviewImageUrl(undefined);
    } catch {
      alert('프로필 저장 중 오류가 발생했습니다.');
    }
  };

  // ✅ 추가 (로그아웃)
  const handleLogout = () => {
    clearToken();
    router.replace('/');
  };

  if (isLoading) {
    return <div className="p-6">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col p-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-md-medium text-gray-700"
      >
        ← 돌아가기
      </button>

      <div className="flex max-w-[624px] flex-col gap-6">
        <section className="rounded-2xl bg-white px-7 py-8">
          <h2 className="mb-6 text-2xl-bold leading-none text-gray-900">
            프로필
          </h2>

          <div className="flex items-start gap-[42px]">
            <div className="relative h-[180px] w-[180px] shrink-0 overflow-hidden rounded-md bg-[#f5f5f5]">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />

              <button
                type="button"
                onClick={handleProfileImageButtonClick}
                className="h-full w-full"
              >
                {currentPreviewImageUrl ? (
                  <Image
                    src={currentPreviewImageUrl}
                    alt="프로필"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl text-brand-violet">
                    +
                  </div>
                )}
              </button>
            </div>

            <div className="flex w-full flex-col gap-4">
              <Input label="이메일" value={initialEmail} readOnly />
              <Input
                label="닉네임"
                value={currentNickname}
                onChange={handleNicknameChange}
              />

              <Button
                size="modal_lg"
                className="w-full"
                disabled={!isProfileChanged}
                onClick={handleProfileSave}
              >
                저장
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-4">
          <h2 className="mb-6 text-2xl-bold leading-none text-gray-700">
            비밀번호 변경
          </h2>

          <div className="flex flex-col gap-4">
            <Input
              label="현재 비밀번호"
              type="password"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
            />
            <Input
              label="새 비밀번호"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            <Input
              label="비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
              isError={isPasswordMismatch}
              errorMessage={
                isPasswordMismatch ? '비밀번호가 일치하지 않습니다.' : undefined
              }
            />

            <Button
              size="modal_lg"
              className="w-full"
              disabled={!isPasswordFormValid}
              onClick={handlePasswordChange}
            >
              변경
            </Button>
          </div>
        </section>

        {/* ✅ 로그아웃 버튼 추가 */}
        <Button
          variant="secondary"
          size="modal_lg"
          className="w-full mt-6"
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      </div>
    </div>
  );
}
