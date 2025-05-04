import React from 'react'
import ArrowLeft from '@heroicons/react/24/outline/ArrowLeftIcon'

type Props = {

  className?: string
}

export const ButtonRegresar = ({className }: Props) => {
  return (
    <p
      className={` hover:bg-blue-700  rounded-full bg-blue-500 text-white size-8 ${className}`}
    > <ArrowLeft className="p-2 stroke-3" /> </p>
  )
}