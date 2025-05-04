import React from 'react'
import clsx from 'clsx'
type Props = {
  value: string
  type?: "submit" | "button" | "reset"
  className?: string
  disabled?: boolean
}

export const ButtonPrimary = ({ className, value, type = "submit", disabled = false }: Props) => {
  return (
    <button
      className={clsx(
        'font-semibold py-2 px-16 rounded-2xl',
        !className?.includes('bg-') && 'bg-blue-500 hover:bg-blue-600 text-white',
        className
      )}

      type={type}
      disabled={disabled}
    > {value} </button>
  )
}