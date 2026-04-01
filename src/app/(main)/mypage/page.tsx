/**
 * @file 계정 관리 페이지 ( /mypage )
 * @description 유저의 프로필 이미지, 닉네임, 비밀번호를 수정하는 마이페이지입니다.
 * @note 프로필 이미지 업로드 API 연동과, 현재 비밀번호 검증 로직이 포함됩니다.
 */

'use client';

import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import Input from '@/components/common/Input/Input';
import Button from '@/components/common/Button';

export default function MyPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const mockMyInfo = {
    id: 1,
    email: 'test1@test.com',
    nickname: 'seungmi',
    profileImageUrl: null,
    createdAt: '2026-03-24T04:23:25.506Z',
    updatedAt: '2026-03-24T04:23:25.506Z',
  };

  const initialEmail = mockMyInfo.email;
  const initialNickname = mockMyInfo.nickname;
  const initialProfileImageUrl = mockMyInfo.profileImageUrl;

  const [nickname, setNickname] = useState(initialNickname);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(
    initialProfileImageUrl,
  );

  // 비밀번호 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 에러 상태
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);

  const isNicknameChanged = nickname !== initialNickname;
  const isImageChanged = selectedImageFile !== null;
  const isProfileChanged = isNicknameChanged || isImageChanged;

  const isPasswordFormValid =
    currentPassword !== '' && newPassword !== '' && confirmPassword !== '';

  useEffect(() => {
    return () => {
      if (previewImageUrl && selectedImageFile) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl, selectedImageFile]);

  const handleCurrentPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  // blur 시 검증
  const handleConfirmPasswordBlur = () => {
    if (newPassword !== confirmPassword) {
      setIsPasswordMismatch(true);
    } else {
      setIsPasswordMismatch(false);
    }
  };

  // 변경 버튼 클릭
  const handlePasswordChange = () => {
    if (!isPasswordFormValid) return;

    // 현재 비밀번호 검증 (임시)
    const mockCurrentPassword = '1234'; // TODO: API 연동 시 제거

    if (currentPassword !== mockCurrentPassword) {
      alert('현재 비밀번호가 틀립니다');
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsPasswordMismatch(true);
      return;
    }

    // TODO: 비밀번호 변경 API 연결
    console.log({
      currentPassword,
      newPassword,
    });
  };
  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const handleProfileImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);

    setSelectedImageFile(imageFile);
    setPreviewImageUrl(objectUrl);

    // NOTE: 같은 파일을 다시 선택해도 change 이벤트가 동작하도록 value를 초기화합니다.
    event.target.value = '';
  };

  const handleProfileSave = () => {
    if (!isProfileChanged) {
      return;
    }

    console.log({
      nickname,
      selectedImageFile,
    });
  };

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
                aria-label="프로필 이미지 업로드"
              >
                {previewImageUrl ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={previewImageUrl}
                      alt="프로필 미리보기"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl-semibold text-brand-violet">
                    +
                  </div>
                )}
              </button>
            </div>

            <div className="flex w-full flex-col gap-4">
              <Input
                label="이메일"
                value={initialEmail}
                readOnly
                className="bg-white"
              />

              <Input
                label="닉네임"
                value={nickname}
                onChange={handleNicknameChange}
                placeholder="닉네임 입력"
                maxLength={10}
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
              placeholder="비밀번호 입력"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
            />

            <Input
              label="새 비밀번호"
              type="password"
              placeholder="새 비밀번호 입력"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />

            <div>
              <Input
                label="새 비밀번호 확인"
                type="password"
                placeholder="새 비밀번호 입력"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={handleConfirmPasswordBlur}
                isError={isPasswordMismatch}
                errorMessage={
                  isPasswordMismatch
                    ? '비밀번호가 일치하지 않습니다'
                    : undefined
                }
              />
              {/* 에러메시지 공간 확보 */}
              <div className="mt-1 h-5" />
            </div>

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
      </div>
    </div>
  );
}
