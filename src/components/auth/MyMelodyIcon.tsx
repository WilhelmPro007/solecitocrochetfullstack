interface MyMelodyIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  emoji?: string;
  className?: string;
}

export function MyMelodyIcon({ 
  size = 'md', 
  emoji = '🎀', 
  className = '' 
}: MyMelodyIconProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-20 h-20 text-3xl'
  };

  return (
    <div className={`
      inline-flex items-center justify-center 
      bg-gradient-to-br from-pink-200 to-pink-300
      rounded-full shadow-sm
      ${sizeClasses[size]}
      ${className}
    `}>
      <span className="select-none">{emoji}</span>
    </div>
  );
} 