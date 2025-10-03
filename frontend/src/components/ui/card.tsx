import * as React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div
      className={
        'rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--card-foreground))] shadow ' +
        className
      }
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: CardProps) {
  return (
    <div className={'flex flex-col space-y-1.5 p-6 ' + className} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: CardProps) {
  return (
    <h3
      className={
        'text-lg font-semibold leading-none tracking-tight ' + className
      }
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <p
      className={'text-sm text-[rgb(var(--muted-foreground))] ' + className}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className = '', children, ...props }: CardProps) {
  return (
    <div className={'p-6 pt-0 ' + className} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }: CardProps) {
  return (
    <div className={'flex items-center p-6 pt-0 ' + className} {...props}>
      {children}
    </div>
  );
}
