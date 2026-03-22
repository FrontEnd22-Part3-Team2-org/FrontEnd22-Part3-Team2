'use client';

/**
 * @file Textarea.tsx
 * @description 프로젝트 전반에서 사용되는 공통 여러 줄 입력 폼 컴포넌트입니다.
 * 여러 줄 텍스트 입력, 라벨 표시, 에러 상태(빨간 테두리 및 메시지) 처리를 지원합니다.
 * 내부 버튼이 필요한 댓글 입력 형태도 함께 지원합니다.
 * @author 인영
 *
 * @example
 * <Textarea label="내용" errorMessage="내용을 입력해 주세요." />
 *
 * @example
 * <Textarea placeholder="댓글 작성하기" buttonText="입력" />
 */

import { TextareaHTMLAttributes, useId } from 'react';
import clsx from 'clsx';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
}

export default function Textarea({
  label,
  isError = false,
  errorMessage,
  buttonText = '입력',
  onButtonClick,
  buttonDisabled = false,
  className,
  id,
  ...props
}: TextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  const hasError = isError || !!errorMessage;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1 block text-xs font-medium text-gray-600"
        >
          {label}
        </label>
      )}

      <div
        className={clsx(
          'rounded-md border bg-white p-4',
          hasError
            ? 'border-red focus-within:border-red'
            : 'border-gray-300 focus-within:border-brand-violet',
        )}
      >
        <textarea
          id={textareaId}
          {...props}
          className={clsx(
            'min-h-[110px] w-full resize-none text-sm outline-none',
            'placeholder:text-gray-400',
            'bg-transparent text-gray-900',
            className,
          )}
          aria-invalid={hasError}
          aria-describedby={errorMessage ? `${textareaId}-error` : undefined}
        />

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onButtonClick}
            disabled={buttonDisabled}
            className={clsx(
              'rounded-md border px-6 py-2 text-sm font-medium transition',
              buttonDisabled
                ? 'cursor-not-allowed border-gray-300 text-gray-300'
                : 'border-brand-violet text-brand-violet hover:bg-brand-violet-light',
            )}
          >
            {buttonText}
          </button>
        </div>
      </div>

      {errorMessage && (
        <p id={`${textareaId}-error`} className="mt-1 text-xs text-red">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
