/**
 * @file 회원가입 페이지 ( /signup )
 * @description 신규 유저의 정보(이메일, 이름, 비밀번호 등)를 입력받는 화면입니다.
 * @note 폼 제출 전, 각 인풋의 유효성 검사(정규식 등) 및 에러 메시지 처리가 핵심입니다.
 */

'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

import { Input } from '@/components/common/Input';
import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Checkbox';

export default function SignupPage() {
  // 입력값 상태
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agree, setAgree] = useState(false);

  // 비밀번호 보기/숨기기 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 에러 상태
  const [errors, setErrors] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
    agree: '',
  });

  // 이메일 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 이메일 입력 시 실시간 검사
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    setErrors((prev) => ({
      ...prev,
      email: !value
        ? ''
        : !emailRegex.test(value)
          ? '이메일 형식으로 작성해 주세요.'
          : '',
    }));
  };

  // 닉네임 입력 시 실시간 검사
  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);

    setErrors((prev) => ({
      ...prev,
      nickname: !value
        ? ''
        : value.length > 10
          ? '열 자 이하로 작성해주세요.'
          : '',
    }));
  };

  // 비밀번호 입력 시 실시간 검사
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    setErrors((prev) => ({
      ...prev,
      password: !value ? '' : value.length < 8 ? '8자 이상 입력해 주세요.' : '',
      passwordConfirm:
        passwordConfirm && value !== passwordConfirm
          ? '비밀번호가 일치하지 않습니다.'
          : '',
    }));
  };

  // 비밀번호 확인 입력 시 실시간 검사
  const handlePasswordConfirmChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordConfirm(value);

    setErrors((prev) => ({
      ...prev,
      passwordConfirm: !value
        ? ''
        : value !== password
          ? '비밀번호가 일치하지 않습니다.'
          : '',
    }));
  };

  // 체크박스 변경
  const handleAgreeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAgree(checked);

    setErrors((prev) => ({
      ...prev,
      agree: checked ? '' : prev.agree,
    }));
  };

  // 전체 유효성 검사
  const validate = () => {
    const nextErrors = {
      email: '',
      nickname: '',
      password: '',
      passwordConfirm: '',
      agree: '',
    };

    if (!email.trim()) {
      nextErrors.email = '이메일을 입력해 주세요.';
    } else if (!emailRegex.test(email)) {
      nextErrors.email = '이메일 형식으로 작성해 주세요.';
    }

    if (!nickname.trim()) {
      nextErrors.nickname = '닉네임을 입력해 주세요.';
    } else if (nickname.length > 10) {
      nextErrors.nickname = '열 자 이하로 작성해주세요.';
    }

    if (!password) {
      nextErrors.password = '비밀번호를 입력해 주세요.';
    } else if (password.length < 8) {
      nextErrors.password = '8자 이상 입력해 주세요.';
    }

    if (!passwordConfirm) {
      nextErrors.passwordConfirm = '비밀번호를 한 번 더 입력해 주세요.';
    } else if (password !== passwordConfirm) {
      nextErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    if (!agree) {
      nextErrors.agree = '이용약관에 동의해 주세요.';
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  // 버튼 활성화 조건
  const isButtonDisabled =
    !email.trim() ||
    !nickname.trim() ||
    !password.trim() ||
    !passwordConfirm.trim() ||
    !agree ||
    Object.values(errors).some((error) => error !== '');

  // 폼 제출
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    console.log({
      email,
      nickname,
      password,
      passwordConfirm,
      agree,
    });
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 sm:px-6">
      <div className="mx-auto flex min-h-screen w-full items-center justify-center py-10">
        <div className="flex w-full max-w-[520px] flex-col items-center gap-6 sm:gap-[30px]">
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

              <h1 className="text-center text-base text-gray-700 sm:text-xl-medium">
                첫 방문을 환영합니다!
              </h1>
            </div>
          </Link>

          <div className="flex w-full flex-col items-center gap-5 sm:gap-[24px]">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex w-full flex-col gap-5 sm:gap-[24px]"
            >
              <div className="flex w-full flex-col gap-4">
                <Input
                  label="이메일"
                  type="text"
                  placeholder="이메일을 입력해 주세요"
                  value={email}
                  onChange={handleEmailChange}
                  isError={!!errors.email}
                  errorMessage={errors.email || undefined}
                  className="h-[50px]"
                />

                <Input
                  label="닉네임"
                  type="text"
                  placeholder="닉네임을 입력해 주세요"
                  value={nickname}
                  onChange={handleNicknameChange}
                  isError={!!errors.nickname}
                  errorMessage={errors.nickname || undefined}
                  className="h-[50px]"
                />

                <Input
                  label="비밀번호"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해 주세요"
                  value={password}
                  onChange={handlePasswordChange}
                  isError={!!errors.password}
                  errorMessage={errors.password || undefined}
                  className="h-[50px]"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                      }
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  }
                />

                <Input
                  label="비밀번호 확인"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해 주세요"
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  isError={!!errors.passwordConfirm}
                  errorMessage={errors.passwordConfirm || undefined}
                  className="h-[50px]"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm((prev) => !prev)}
                      className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPasswordConfirm
                          ? '비밀번호 확인 숨기기'
                          : '비밀번호 확인 보기'
                      }
                    >
                      {showPasswordConfirm ? <EyeOff /> : <Eye />}
                    </button>
                  }
                />
              </div>

              <div>
                <Checkbox
                  label="이용약관에 동의합니다."
                  checked={agree}
                  onChange={handleAgreeChange}
                />
                {errors.agree && (
                  <p className="mt-1 text-xs text-red">{errors.agree}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="login_sm"
                disabled={isButtonDisabled}
                className="h-[50px] w-full rounded-[8px]"
              >
                가입하기
              </Button>
            </form>

            <p className="w-full text-center text-[16px] leading-[19px] text-gray-700">
              이미 회원이신가요?{' '}
              <Link href="/login" className="text-brand-violet underline">
                로그인하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
