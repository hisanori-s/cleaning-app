import React from 'react';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export function Form({ children, ...props }: FormProps) {
  return <form {...props}>{children}</form>;
}

export interface FormFieldProps {
  name: string;
  children: React.ReactNode;
}

export function FormField({ name, children }: FormFieldProps) {
  return <div className="space-y-2" data-field-name={name}>{children}</div>;
}

export interface FormItemProps {
  children: React.ReactNode;
}

export function FormItem({ children }: FormItemProps) {
  return <div className="space-y-1">{children}</div>;
}

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function FormLabel({ children, ...props }: FormLabelProps) {
  return (
    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" {...props}>
      {children}
    </label>
  );
}

export interface FormControlProps {
  children: React.ReactNode;
}

export function FormControl({ children }: FormControlProps) {
  return <div className="relative">{children}</div>;
}

export interface FormMessageProps {
  children: React.ReactNode;
}

export function FormMessage({ children }: FormMessageProps) {
  return <p className="text-sm font-medium text-destructive">{children}</p>;
}