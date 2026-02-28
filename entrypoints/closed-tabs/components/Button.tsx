import { memo, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'danger' | 'secondary';

type ButtonProps = {
  variant?: ButtonVariant;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  title?: string;
  disabled?: boolean;
};

/**
 * 统一的按钮组件
 * 使用预定义的样式类（在 style.css 的 @layer components 中定义）
 */
export const Button = memo(function Button({
  variant = 'secondary',
  onClick,
  children,
  className = '',
  title,
  disabled = false,
}: ButtonProps) {
  const variantClass = `btn-${variant}`;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${variantClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
});
