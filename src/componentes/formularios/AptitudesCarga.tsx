type Props = {
  value?: string;
  className?: string;
}
 const AptitudesCarga = ({className=" ",value,...props}:Props) => {

  return (
    <span
      {...props}
      className={`${className} flex flex-wrap items-center text-[13px] text-[#266AAE] border-2 font-semibold border-[#266AAE]  px-2 py-1 rounded-full`}
    >
      {value}
    </span>
  )
}
export default AptitudesCarga