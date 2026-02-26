import { memo, useCallback } from 'react';

type FavoriteButtonProps = {
  isFavorite: boolean;
  onToggle: () => void;
};

/**
 * 收藏按钮组件
 * 单独管理收藏按钮的样式和交互
 */
export const FavoriteButton = memo(function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  const handleClick = useCallback(() => {
    onToggle();
  }, [onToggle]);

  const buttonClass = isFavorite ? 'favorite-button-active' : 'favorite-button-inactive';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isFavorite}
      className={buttonClass}
      title={isFavorite ? '取消收藏' : '收藏'}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4">
        <path
          d="M12 3.6l2.7 5.47 6.03.88-4.37 4.26 1.03 6.02L12 17.3l-5.39 2.93 1.03-6.02L3.27 9.95l6.03-.88L12 3.6z"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
});
