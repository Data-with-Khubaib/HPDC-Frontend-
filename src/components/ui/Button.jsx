const variants = {
  solid: 'bg-[#1b5e20] hover:bg-[#14451a] text-white',
  outline: 'border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#111827]',
  danger: 'bg-[#E53E3E] hover:bg-red-700 text-white',
  'danger-outline': 'border border-red-300 bg-white hover:bg-red-50 text-[#E53E3E]',
  ghost: 'bg-transparent hover:bg-gray-100 text-[#6B7280]',
  amber: 'bg-[#B7791F] hover:bg-amber-700 text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

export default function Button({
  children,
  variant = 'solid',
  size = 'md',
  className = '',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40
        ${variants[variant] || variants.solid}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
