import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  active?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, children, active = false, className = '', ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        className={`an-icon-button${active ? ' an-icon-button--active' : ''} ${className}`.trim()}
        aria-label={label}
        title={label}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
