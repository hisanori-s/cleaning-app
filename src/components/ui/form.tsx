import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type FormData = z.infer<typeof formSchema>;

interface FormProps {
  onSubmit: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
  children: React.ReactNode;
}

export function FormComponent({
  onSubmit,
  defaultValues,
  children
}: FormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      email: '',
      password: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {children}
      </form>
    </Form>
  );
}

export function FormFieldWrapper({
  name,
  label,
  children
}: {
  name: keyof FormData;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {React.cloneElement(children as React.ReactElement, { ...field })}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}