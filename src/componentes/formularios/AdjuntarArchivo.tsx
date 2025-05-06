
type Props = {
  register: any; // Replace 'any' with the specific type from React Hook Form if available
  id: string;
}

export const AdjuntarArchivo = ({id, register}: Props) => {
  return (
    <div className="col-span-full border-2 border-dashed border-gray-400 p-6 rounded-md w-full flex flex-col items-center">
    <label htmlFor="archivo" className="text-lg font-bold text-gray-700 mb-2">
      Cargar archivo
    </label>

    <input
      id={id}
      type="file"
      accept=".pdf,application/pdf,.png,image/png,.jpg,image/jpeg"
      {...register}
      className="file:bg-gray-200 file:text-gray-700 file:rounded-md file:px-4 file:py-2 file:border-none file:shadow-sm file:hover:bg-gray-300 transition text-sm"
    />
  </div>
  )
}