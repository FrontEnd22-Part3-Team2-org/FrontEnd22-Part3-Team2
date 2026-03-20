/**
 * @file TagChip.tsx
 * @description 사용자가 입력한 값을 기반으로 태그를 생성하고,
 * 각 태그에 랜덤 색상을 적용하여 표시하는 컴포넌트입니다.
 *
 * @example
 * const value = "유저가 입력한 값"
 * <TagChip label={value} />
 *
 * @author 수경
 */

// TODO : [수경] 배경, 글씨색 랜덤으로 적용되어야 함. 같은 태그는 같은 색 유지

interface TagChipProps {
  label: string;
  color?: string;
}

export default function TagChip({ label }: TagChipProps) {
  return (
    <button type="button" className="rounded-md bg-[#F9EEE3]">
      <p className="p-[6px] text-md-regular text-[#D58D49]">{label}</p>
    </button>
  );
}
