
// Input de texto


const TextInput = ({ type = "text", className = "", ...props }) => {




  return (
    <input
      {...props}
      type={type}
      className={`${className}         
        h-11 w-full rounded-lg  border-[1.8px] border-blue-600 
        bg-slate-100/40
        p-3 text-sm text-slate-950/90
        placeholder-slate-950/60 outline-none
        focus:border-blue-700 focus:ring-1  focus:ring-blue-700
        transition duration-300 ease-in-out`}

    >


    </input>
  )
}

export default TextInput
