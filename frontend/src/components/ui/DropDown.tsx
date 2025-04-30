'use client';

import React from 'react';
import { Option } from "@/types"


export interface DropdownProps {
    name: string
  /** 드롭다운 옵션 목록 */
  options: Option[];
  /** 현재 선택된 값 */
  value: string | undefined;
  /** 값 변경 시 호출되는 콜백 */
  onChange: (value: string) => void;
  /** 첫 번째 placeholder 옵션 텍스트 */
  placeholder?: string;
  /** 필드 레이블 (선택) */
  label?: string;
  required?: boolean;
}

export default function Dropdown({
    name,
    options,
    value,
    onChange,
    placeholder,
    label,
    required = false
}: DropdownProps) {
  return (
    <div>
      {label && (
        <label>
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
      >
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
