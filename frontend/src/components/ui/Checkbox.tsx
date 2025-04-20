import React from 'react';
import styles from './Checkbox.module.css'

export type Option = {
    label: string;
    value: string;
};

interface CheckboxGroupProps {
    options: Option[];               // 렌더링할 옵션 목록
    selectedValues: string[];        // 현재 체크된 값들의 배열
    onChange: (vals: string[]) => void; // 선택 변경 시 호출
    name?: string;                   // 체크박스 그룹 name 속성 (optional)
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
    options,
    selectedValues,
    onChange,
    name,
}) => {
    const allSelected = options
        .filter(o => o.value !== 'all') // 'all' 옵션 제외
        .every(o => selectedValues.includes(o.value));

    const handleToggle = (value: string) => {
        if (value === 'all') {
            // all 클릭 시 전체 선택/해제
            if (allSelected) {
                onChange([]); // 전부 해제
            } else {
                onChange(options.map(o => o.value) // 'all' 제외한 모든 value
                    .filter(v => v !== 'all'));
            }
        } else {
            // 개별 토글
            if (selectedValues.includes(value)) {
                onChange(selectedValues.filter(v => v !== value));
            } else {
                onChange([...selectedValues, value]);
            }
        }
    };

    return (
        <div className={styles.checkbox_wrap}>
            {options.map(opt => (
                <label key={opt.value} className={styles.terms_label}>
                    <input
                        type="checkbox"
                        name={name}
                        value={opt.value}
                        checked={
                            opt.value === 'all'
                                ? allSelected
                                : selectedValues.includes(opt.value)
                        }
                        onChange={() => handleToggle(opt.value)}
                    />
                    {opt.label}
                </label>
            ))}
        </div>
    );
};

export default CheckboxGroup;
