import React from 'react'
import styles from './Checkbox.module.css'

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  name?: string
}

export default function SingleCheckbox({
  label,
  checked,
  onChange,
  name,
}: CheckboxProps) {
  return (
    <label className={styles.terms_label}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      {label}
    </label>
  )
}
