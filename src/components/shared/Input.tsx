import { useState } from 'react'
import { EyeClose, EyeOpen } from '../assets/icons'

export default function Input({
  name,
  placeholder,
  type,
}: Readonly<{
  name: string
  placeholder: string
  type: string
}>) {
  const [showPassword, setShowPassword] = useState(false)
  const toggleEye = () => {
    setShowPassword((iso) => !iso)
  }
  return (
    <div className="flex w-full items-center gap-1 rounded-lg border border-gray-300 px-3 py-3 focus-within:border-[#541975]">
      <input
        className="w-full bg-transparent text-lg outline-none placeholder:text-sm placeholder:text-[#333]"
        placeholder={placeholder}
        type={type}
        name={name}
      />
      {type == 'password' && (
        <>{!showPassword ? <EyeOpen onClick={toggleEye} /> : <EyeClose onClick={toggleEye} />}</>
      )}
    </div>
  )
}
