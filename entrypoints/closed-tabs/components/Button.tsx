import { memo, useRef, type ReactNode } from 'react';
import { zaodongTheme } from '../themes/zaodong/meta';

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
  const ref = useRef<HTMLButtonElement>(null);
  const variantClass = `btn-${variant}`;

  const handleClick = () => {
    if (disabled) return;
    if (document.documentElement.dataset.theme === zaodongTheme.id) {
      ref.current?.classList.add('is-popping');
      window.setTimeout(() => ref.current?.classList.remove('is-popping'), 520);
    }
    onClick();
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className={`${variantClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
});
