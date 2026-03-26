/**
 * @file 계정 관리 페이지 ( /mypage )
 * @description 유저의 프로필 이미지, 닉네임, 비밀번호를 수정하는 마이페이지입니다.
 * @note 프로필 이미지 업로드 API 연동과, 현재 비밀번호 검증 로직이 포함됩니다.
 */

'use client';

import Input from '@/components/common/Input/Input';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const router = useRouter();

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
            <div className="relative h-[180px] w-[180px] shrink-0 rounded-md bg-[#f5f5f5]">
              <button
                type="button"
                className="flex h-full w-full items-center justify-center text-3xl-semibold text-brand-violet"
              >
                +
              </button>
            </div>

            <div className="flex w-full flex-col gap-4">
              <Input
                label="이메일"
                value="johndoe@gmail.com"
                readOnly
                className="bg-white"
              />

              <Input label="닉네임" value="배유철" readOnly />

              <Button size="modal_lg" className="w-full">
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
              readOnly
            />

            <Input
              label="새 비밀번호"
              type="password"
              placeholder="새 비밀번호 입력"
              readOnly
            />

            <div>
              <Input
                label="새 비밀번호 확인"
                type="password"
                placeholder="새 비밀번호 입력"
                readOnly
              />
              {/* 에러메시지 공간 확보 */}
              <div className="mt-1 h-5" />
            </div>

            <Button size="modal_lg" className="w-full">
              변경
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
