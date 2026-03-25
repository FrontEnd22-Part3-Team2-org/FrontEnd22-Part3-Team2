'use client';

// React 상태 관리
import { useState } from 'react';

// Next.js 라우팅
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 이미지 최적화 컴포넌트
import Image from 'next/image';

// 아이콘
import { Eye, EyeOff } from 'lucide-react';

// 공통 컴포넌트
import Input from '@/components/common/Input/Input';
import Button from '@/components/common/Button';

// 팀 ID (API 요청 시 사용)
const TEAM_ID = '22-2';

// 이메일 유효성 검사 정규식
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();

  // =========================
  // 상태 관리
  // =========================
  const [email, setEmail] = useState(''); // 이메일 입력값
  const [password, setPassword] = useState(''); // 비밀번호 입력값

  const [isEmailError, setIsEmailError] = useState(false); // 이메일 에러 여부
  const [isPasswordError, setIsPasswordError] = useState(false); // 비밀번호 에러 여부
  const [loginError, setLoginError] = useState(''); // 로그인 실패 메시지

  const [showPassword, setShowPassword] = useState(false); // 비밀번호 보기/숨기기

  // 버튼 활성화 조건 (둘 다 입력해야 활성화)
  const isButtonDisabled = !email || !password;

  // =========================
  // 입력 핸들러
  // =========================

  // 이메일 입력 변경
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    // 에러 상태 초기화
    if (isEmailError) setIsEmailError(false);
    if (loginError) setLoginError('');
  };

  // 비밀번호 입력 변경
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);

    // 에러 상태 초기화
    if (isPasswordError) setIsPasswordError(false);
    if (loginError) setLoginError('');
  };

  // =========================
  // 로그인 요청
  // =========================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;

    // 이메일 형식 검사
    if (!emailRegex.test(email)) {
      setIsEmailError(true);
      hasError = true;
    }

    // 비밀번호 길이 검사
    if (password.length < 8) {
      setIsPasswordError(true);
      hasError = true;
    }

    // 에러 있으면 요청 중단
    if (hasError) return;

    setLoginError('');

    try {
      // 로그인 API 요청
      const res = await fetch(
        `https://linkshop-api.vercel.app/${TEAM_ID}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      // 로그인 실패 처리
      if (!res.ok) {
        setLoginError('이메일 또는 비밀번호를 확인해 주세요.');
        return;
      }

      // 토큰 및 유저 정보 저장
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 로그인 성공 → 페이지 이동
      router.push('/mydashboard');
    } catch {
      // 서버 에러 처리
      setLoginError('서버 오류가 발생했습니다.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto flex min-h-screen w-full items-center justify-center">
        <div className="flex w-[520px] flex-col items-center gap-[30px]">
          {/* =========================
              로고 영역 (클릭 시 메인으로 이동)
          ========================= */}
          <Link href="/">
            <div className="flex h-[322px] w-[200px] cursor-pointer flex-col items-center gap-[10px]">
              <div className="flex h-[280px] w-[200px] flex-col items-center justify-center gap-[30px]">
                <Image
                  src="/logo-taskify-icon-main.svg"
                  alt="Taskify icon"
                  width={200}
                  height={190}
                  priority
                />
                <Image
                  src="/logo-taskify-text-main.svg"
                  alt="Taskify"
                  width={198}
                  height={55}
                  priority
                />
              </div>
              <p className="h-[32px] w-[200px] text-center text-xl-medium text-gray-700">
                오늘도 만나서 반가워요!
              </p>
            </div>
          </Link>

          {/* =========================
              로그인 폼 영역
          ========================= */}
          <div className="flex w-[520px] flex-col items-center gap-[24px]">
            <form
              onSubmit={handleSubmit}
              className="flex w-[520px] flex-col gap-[24px]"
            >
              <div className="flex w-[520px] flex-col gap-[16px]">
                {/* 이메일 입력 */}
                <Input
                  label="이메일"
                  type="email"
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
                    // 비밀번호 보기/숨기기 버튼
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                      }
                    >
                      {showPassword ? (
                        <Eye width={24} height={24} />
                      ) : (
                        <EyeOff width={24} height={24} />
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
                className="h-[50px] w-[520px] rounded-[8px]"
              >
                로그인
              </Button>
            </form>

            {/* 회원가입 이동 */}
            <p className="w-[520px] text-center text-[16px] leading-[19px] text-gray-700">
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
