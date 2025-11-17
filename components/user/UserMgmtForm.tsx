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
  username: z.string().min(3, "Minimal 3 karakter."),
  name: z.string().min(3,"Minimal 3 karakter."),
  email: z.string().email("Email tidak valid."),
  department_name: z.string().optional(),
  password: z.string().min(6, "Minimal 6 karakter."),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  editing?: boolean;
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
}

export default function UserMgmtForm({
  editing = false,
  initialData,
  onSubmit,
}: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: initialData?.username ?? "",
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      department_name: initialData?.department_name ?? "",
      password: "",
    },
  });

  const handleSubmit = (values: FormData) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <div className="grid gap-4 py-4">
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

       <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama" {...field} />
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
                <Input placeholder="Masukkan email" {...field} />
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
                <Input placeholder="Departemen" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password baru" {...field} />
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
