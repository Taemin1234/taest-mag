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
    const handleToggle = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter(v => v !== value));
        } else {
            onChange([...selectedValues, value]);
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
                        checked={selectedValues.includes(opt.value)}
                        onChange={() => handleToggle(opt.value)}
                    />
                    {opt.label}
                </label>
            ))}
        </div>
    );
};

export default CheckboxGroup;
