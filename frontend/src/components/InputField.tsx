"use client"

import { useState } from 'react';
import styles from './InputField.module.css';

interface Props {
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

export default function InputField({
  id,
  name,
  type = 'text',
  value,
  onChange,
  label,
  required = false,
  minLength,
  maxLength,
}: Props) {
  const [touched, setTouched] = useState(false);

  return (
    <div
      className={`${styles.user_box} ${
        touched ? styles.touched : ''
      }`}
    >
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        placeholder=" "
        required={required}
        minLength={minLength}
        maxLength={maxLength}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
