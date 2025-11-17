"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(3, "Minimal 3 karakter."),
  email: z.string().email("Email tidak valid."),
  department_name: z.string().min(2, "Minimal 2 karakter."),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  editing?: boolean;
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
}

export default function ConsultingManagerForm({
  editing = false,
  initialData,
  onSubmit,
}: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      department_name: initialData?.department_name ?? "",
    },
  });

  const handleSubmit = (values: FormData) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <div className="grid gap-4 py-4">
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan email manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="department_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departemen</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan departemen" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <DialogFooter>
        <Button type="button" onClick={form.handleSubmit(handleSubmit)}>
          {editing ? "Perbarui" : "Simpan"}
        </Button>
      </DialogFooter>
    </Form>
  );
}
