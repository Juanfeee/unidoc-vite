
type Props = {
  value: string
  className?: string
}

export const ButtonTable = ({className, value }: Props) => {
  return (
    <p
      className={`border-2 bg-blue-500  hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-2xl ${className}`}
    > { value } </p>
  )
}