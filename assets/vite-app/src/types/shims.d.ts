// Add type declarations for shadcn/ui components
declare module '@/components/ui/button' {
  import * as React from 'react';
  
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
  }
  
  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >;
}

declare module '@/components/ui/card' {
  import * as React from 'react';
  
  interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
  interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
  interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
  interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
  interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
  interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
  
  export const Card: React.FC<CardProps>;
  export const CardHeader: React.FC<CardHeaderProps>;
  export const CardTitle: React.FC<CardTitleProps>;
  export const CardDescription: React.FC<CardDescriptionProps>;
  export const CardContent: React.FC<CardContentProps>;
  export const CardFooter: React.FC<CardFooterProps>;
}

declare module '@/components/ui/input' {
  import * as React from 'react';
  
  interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
  
  export const Input: React.ForwardRefExoticComponent<
    InputProps & React.RefAttributes<HTMLInputElement>
  >;
}

declare module '@/components/ui/textarea' {
  import * as React from 'react';
  
  interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
  
  export const Textarea: React.ForwardRefExoticComponent<
    TextareaProps & React.RefAttributes<HTMLTextAreaElement>
  >;
}

declare module '@/components/ui/label' {
  import * as React from 'react';
  
  interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
  
  export const Label: React.ForwardRefExoticComponent<
    LabelProps & React.RefAttributes<HTMLLabelElement>
  >;
}

declare module '@/components/ui/checkbox' {
  import * as React from 'react';
  
  interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checked?: boolean | 'indeterminate';
    onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  }
  
  export const Checkbox: React.ForwardRefExoticComponent<
    CheckboxProps & React.RefAttributes<HTMLInputElement>
  >;
}

declare module '@/components/ui/select' {
  import * as React from 'react';
  
  interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    children?: React.ReactNode;
  }
  
  interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
    className?: string;
    children?: React.ReactNode;
  }
  
  interface SelectValueProps {
    placeholder?: string;
    children?: React.ReactNode;
  }
  
  interface SelectContentProps {
    children?: React.ReactNode;
    position?: 'item-aligned' | 'popper';
  }
  
  interface SelectItemProps {
    value: string;
    children?: React.ReactNode;
    className?: string;
  }
  
  export const Select: React.FC<SelectProps> & {
    Trigger: React.FC<SelectTriggerProps>;
    Value: React.FC<SelectValueProps>;
    Content: React.FC<SelectContentProps>;
    Item: React.FC<SelectItemProps>;
  };
  
  export const SelectTrigger: React.FC<SelectTriggerProps>;
  export const SelectValue: React.FC<SelectValueProps>;
  export const SelectContent: React.FC<SelectContentProps>;
  export const SelectItem: React.FC<SelectItemProps>;
}

declare module '@/components/ui/alert' {
  import * as React from 'react';
  
  interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'destructive';
  }
  
  interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
  interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
  
  export const Alert: React.FC<AlertProps>;
  export const AlertTitle: React.FC<AlertTitleProps>;
  export const AlertDescription: React.FC<AlertDescriptionProps>;
}

declare module '@/lib/utils' {
  export function cn(...inputs: (string | undefined)[]): string;
  // Add other utility function types as needed
}

declare module '@/hooks/use-toast' {
  export interface Toast {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
    action?: React.ReactNode;
  }
  
  export function toast(toast: Toast): void;
}

declare module '@/context/QuoteContext' {
  import { Dispatch, SetStateAction } from 'react';
  import { Quote } from '@/types/quote';
  
  export interface QuoteContextType {
    quote: Quote;
    setQuote: Dispatch<SetStateAction<Quote>>;
    setPhaseStatus: (phase: string, status: string) => void;
    setCurrentPhase: (phase: string) => void;
  }
  
  export function useQuote(): QuoteContextType;
}

declare module '@/utils/quoteUtils' {

  export function generateUniqueId(): string;
}
