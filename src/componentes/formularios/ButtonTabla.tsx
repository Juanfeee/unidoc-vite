
type Props = {
  value: string
  className?: string
}

export const ButtonTable = ({className, value }: Props) => {
  return (
    <p
      className={` hover:bg-[#266AAE]/90 text-white bg-[#266AAE] font-semibold py-2 px-16 rounded-lg ${className}`}
    > { value } </p>
  )
}