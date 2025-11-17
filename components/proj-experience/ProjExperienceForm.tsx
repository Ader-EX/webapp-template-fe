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
import { QuickFormSearchableField } from "@/components/form/FormSearchableField";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  no_sales_order: z.string().min(1, "Nomor SO wajib diisi."),
  customer_name: z.string().min(2, "Nama customer minimal 2 karakter."),
  project_name: z.string().min(2, "Nama project minimal 2 karakter."),
  project_year: z.string().min(4, "Tahun project harus 4 digit."),
  category: z.string().min(2, "Kategori minimal 2 karakter."),
  consulting_manager_id: z.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  editing?: boolean;
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
}

export default function ProjectExperienceForm({
  editing = false,
  initialData,
  onSubmit,
}: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      no_sales_order: initialData?.no_sales_order ?? "",
      customer_name: initialData?.customer_name ?? "",
      project_name: initialData?.project_name ?? "",
      project_year: initialData?.project_year ?? "",
      category: initialData?.category ?? "",
      consulting_manager_id: initialData?.consulting_manager_id ?? undefined,
    },
  });

  const handleSubmit = (values: FormData) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <div className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="no_sales_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. Sales Order</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nomor SO" {...field}  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Customer</FormLabel>
              <FormControl>
                <Input placeholder="Nama customer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="project_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Project</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full justify-between">
            
        <FormField
          control={form.control}
          name="project_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun Project</FormLabel>
              <FormControl>
                <Input placeholder="contoh: 2025" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan kategori project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>


        <QuickFormSearchableField
          control={form.control}
          name="consulting_manager_id"
          type="consulting_manager"
          isRequired={false}
          label="Consulting Manager"
          placeholder="Pilih Consulting Manager"
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