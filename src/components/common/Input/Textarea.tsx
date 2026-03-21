'use client';

/**
 * @file Textarea.tsx
 * @description 프로젝트 전반에서 사용되는 공통 여러 줄 입력 폼 컴포넌트입니다.
 * 댓글 입력과 같이 여러 줄 텍스트 입력 및 내부 버튼 표시를 지원합니다.
 * @author 인영
 *
 * @example
 * <Textarea placeholder="댓글 작성하기" buttonText="입력" />
 */

import { TextareaHTMLAttributes, useId } from 'react';
import clsx from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
}

export default function Textarea({
  label,
  buttonText = '입력',
  onButtonClick,
  buttonDisabled = false,
  className,
  id,
  ...props
}: TextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
        >
          {label}
        </label>
      )}
      <div
        className={clsx(
          'rounded-md border bg-white p-4',
          'dark:bg-zinc-800 dark:border-zinc-600',
          'border-gray-300 focus-within:border-purple-500 dark:focus-within:border-purple-400',
        )}
      >
        <textarea
          id={textareaId}
          {...props}
          className={clsx(
            'min-h-[110px] w-full resize-none text-sm outline-none',
            'placeholder:text-gray-400 dark:placeholder:text-gray-600',
            'bg-transparent text-gray-900 dark:text-gray-100',
            className,
          )}
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onButtonClick}
            disabled={buttonDisabled}
            className={clsx(
              'rounded-md border px-6 py-2 text-sm font-medium transition',
              buttonDisabled
                ? 'cursor-not-allowed border-gray-300 text-gray-300 dark:border-zinc-600 dark:text-zinc-600'
                : 'border-[#5534DA] text-[#5534DA] hover:bg-purple-50 dark:hover:bg-purple-950',
            )}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
