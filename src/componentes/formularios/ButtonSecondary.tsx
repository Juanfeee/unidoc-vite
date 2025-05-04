import React from 'react'

type Props = {
  value: string
  className?: string
}

export const ButtonSecondary = ({className, value }: Props) => {
  return (
    <p
      className={`border-2 border-blue-500 hover:bg-gray-200 text-blue-500 font-semibold py-2 px-16 rounded-2xl ${className}`}
    > { value } </p>
  )
}