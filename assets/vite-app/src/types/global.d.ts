declare module '@/components/ui/select' {
  import * as React from 'react';
  
  interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    value?: string;
    onValueChange?: (value: string) => void;
  }
  
  export const Select: React.FC<SelectProps>;
  export const SelectTrigger: React.FC<React.HTMLAttributes<HTMLButtonElement>>;
  export const SelectValue: React.FC<{ placeholder?: string }>;
  export const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const SelectItem: React.FC<{ value: string } & React.HTMLAttributes<HTMLDivElement>>;
}

declare module '@/components/ui/input' {
  import * as React from 'react';
  
  interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
  
  export const Input: React.FC<InputProps>;
}

declare module '@/components/ui/label' {
  import * as React from 'react';
  
  interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
  
  export const Label: React.FC<LabelProps>;
}

declare module '@/components/ui/textarea' {
  import * as React from 'react';
  
  interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
  
  export const Textarea: React.FC<TextareaProps>;
}

declare module '@/components/ui/checkbox' {
  import * as React from 'react';
  
  interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
  
  export const Checkbox: React.FC<CheckboxProps>;
}

declare module '@/components/ui/button' {
  import * as React from 'react';
  
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
  
  export const Button: React.FC<ButtonProps>;
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

declare module '@/components/ui/alert' {
  import * as React from 'react';
  
  interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'destructive';
  }
  
  export const Alert: React.FC<AlertProps>;
  export const AlertDescription: React.FC<React.HTMLAttributes<HTMLDivElement>>;
}

declare module '@/lib/utils' {
  export function cn(...inputs: any[]): string;
}

declare module '@/hooks/use-toast' {
  export function toast(options: { title: string; description?: string; variant?: 'default' | 'destructive' }): void;
}

declare module '@/context/QuoteContext' {
  import { Dispatch, SetStateAction } from 'react';
  import { Quote, PhaseStatus } from '@/types/quote';
  
  export function useQuote(): {
    quote: Quote;
    setQuote: Dispatch<SetStateAction<Quote>>;
    setPhaseStatus: (phase: string, status: PhaseStatus) => void;
    setCurrentPhase: (phase: string) => void;
  };
}

declare module '@/utils/quoteUtils' {

  export function generateUniqueId(): string;
}

declare module '@/types/quote' {
  export interface GroupRange {
    id: string;
    label: string;
    min: number;
    max: number;
    selected: boolean;
  }

  export type GroupType = 'known' | 'speculative';
  
  export interface City {
    id: string;
    name: string;
    country: string;
    arrivalDate: Date;
    departureDate: Date;
  }
  
  export interface Quote {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    agentName: string;
    agencyName: string;
    groupType: GroupType;
    travelerCount: number;
    groupRanges: GroupRange[];
    budget: number;
    cities: City[];
  }
  
  export type PhaseStatus = 'not-started' | 'in-progress' | 'completed' | 'error';
}
