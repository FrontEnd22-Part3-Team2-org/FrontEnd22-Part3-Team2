/**
 * @file 로그인 페이지 ( /login )
 * @description 이메일과 비밀번호를 입력받아 유저 인증을 처리하는 화면입니다.
 * @note 로그인 성공 시 토큰을 저장하고 `/mydashboard`로 리다이렉트 해야 합니다.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import Input from '@/components/common/Input/Input';
import Button from '@/components/common/Button';
import { setToken } from '@/lib/auth';

// 팀 ID
const TEAM_ID = '22-2';

// 백엔드 서버 주소
const BASE_URL = 'https://sp-taskify-api.vercel.app';

// 이메일 유효성 검사 정규식
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();

  // 입력값 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 에러 상태
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [loginError, setLoginError] = useState('');

  // 비밀번호 보기/숨기기 상태
  const [showPassword, setShowPassword] = useState(false);

  // 버튼 활성화 조건
  const isButtonDisabled =
    !email.trim() || !password.trim() || isEmailError || isPasswordError;

  // 이메일 입력 변경 + 실시간 유효성 검사
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (loginError) setLoginError('');

    if (!value) {
      setIsEmailError(false);
      return;
    }

    setIsEmailError(!emailRegex.test(value));
  };

  // 비밀번호 입력 변경 + 실시간 유효성 검사
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (loginError) setLoginError('');

    if (!value) {
      setIsPasswordError(false);
      return;
    }

    setIsPasswordError(value.length < 8);
  };

  // 로그인 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;

    if (!emailRegex.test(email)) {
      setIsEmailError(true);
      hasError = true;
    }

    if (password.length < 8) {
      setIsPasswordError(true);
      hasError = true;
    }

    if (hasError) return;

    setLoginError('');

    try {
      const res = await fetch(`${BASE_URL}/${TEAM_ID}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError('이메일 또는 비밀번호를 확인해 주세요.');
        return;
      }

      // 토큰 저장
      setToken(data.accessToken);

      // 로그인 성공 시 이동
      router.push('/mydashboard');
    } catch {
      setLoginError('서버 오류가 발생했습니다.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 sm:px-6">
      <div className="mx-auto flex min-h-screen w-full items-center justify-center py-10">
        <div className="flex w-full max-w-[520px] flex-col items-center gap-6 sm:gap-[30px]">
          {/* 로고 영역 */}
          <Link href="/">
            <div className="flex cursor-pointer flex-col items-center gap-[10px]">
              <div className="flex flex-col items-center justify-center gap-5 sm:gap-[30px]">
                <Image
                  src="/logo-taskify-icon-main.svg"
                  alt="Taskify icon"
                  width={200}
                  height={190}
                  className="h-auto w-[120px] sm:w-[200px]"
                  priority
                />
                <Image
                  src="/logo-taskify-text-main.svg"
                  alt="Taskify"
                  width={198}
                  height={55}
                  className="h-auto w-[140px] sm:w-[198px]"
                  priority
                />
              </div>

              <p className="text-center text-base text-gray-700 sm:text-xl-medium">
                오늘도 만나서 반가워요!
              </p>
            </div>
          </Link>

          {/* 로그인 폼 영역 */}
          <div className="flex w-full flex-col items-center gap-5 sm:gap-[24px]">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex w-full flex-col gap-5 sm:gap-[24px]"
            >
              <div className="flex w-full flex-col gap-4">
                {/* 이메일 입력 */}
                <Input
                  label="이메일"
                  type="text"
                  placeholder="이메일을 입력해 주세요"
                  value={email}
                  onChange={handleEmailChange}
                  isError={isEmailError}
                  errorMessage={
                    isEmailError ? '이메일 형식으로 작성해 주세요.' : undefined
                  }
                />

                {/* 비밀번호 입력 */}
                <Input
                  label="비밀번호"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해 주세요"
                  value={password}
                  onChange={handlePasswordChange}
                  isError={isPasswordError}
                  errorMessage={
                    isPasswordError ? '8자 이상 입력해 주세요.' : undefined
                  }
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                      }
                    >
                      {showPassword ? (
                        <EyeOff width={24} height={24} />
                      ) : (
                        <Eye width={24} height={24} />
                      )}
                    </button>
                  }
                />
              </div>

              {/* 로그인 에러 메시지 */}
              {loginError && (
                <p className="text-md-regular text-red">{loginError}</p>
              )}

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                variant="primary"
                size="login_sm"
                disabled={isButtonDisabled}
                className="h-[50px] w-full rounded-[8px]"
              >
                로그인
              </Button>
            </form>

            {/* 회원가입 이동 */}
            <p className="w-full text-center text-[16px] leading-[19px] text-gray-700">
              회원이 아니신가요?{' '}
              <Link href="/signup" className="text-brand-violet underline">
                회원가입하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
