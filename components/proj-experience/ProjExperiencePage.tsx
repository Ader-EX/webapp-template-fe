"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search as SearchIcon,
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { SidebarHeaderBar } from "@/components/ui/SidebarHeaderBar";
import GlobalPaginationFunction from "@/components/pagination-global";

import toast from "react-hot-toast";
import { ProjectExperience, ProjectExperienceInput, projectExperienceService } from "@/services/projExperienceService";
import ProjectExperienceForm from "./ProjExperienceForm";




export default function ProjExperiencePage() {
  const [users, setUsers] = useState<ProjectExperience[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalPages = Math.ceil(total / rowsPerPage);

  const fetchUsers = async (pageNumber: number, query: string, limit: number) => {
    setLoading(true);
    try {
      const response = await projectExperienceService.getAll({
        skip: (pageNumber - 1) * limit,
        limit,
        search: query,
      });

      setUsers(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      toast.error("Gagal memuat data user");
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, searchTerm, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers(1, searchTerm, rowsPerPage);
  };

  const openEdit = (user: ProjectExperienceInput) => {
    setEditing(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await projectExperienceService.delete(id);
      await fetchUsers(page, searchTerm, rowsPerPage);
      toast.success("User berhasil dihapus!");
    } catch (error) {
      toast.error("Gagal menghapus user");
    }
  };

  const handleSubmit = async (data: ProjectExperienceInput) => {
    setSubmitting(true);
    try {
      if (editing) {
        await projectExperienceService.update(editing.id, data);
        toast.success("Manager diperbarui!");
      } else {
        await projectExperienceService.create(data);
        toast.success("Manager dibuat!");
      }

      setIsDialogOpen(false);
      setEditing(null);

      await fetchUsers(page, searchTerm, rowsPerPage);
    } catch (error : any) {
      toast.error( error.detail || "Gagal menyimpan user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-1">
      <div className="flex flex-1 flex-col space-y-6">
        <SidebarHeaderBar
          showToggle={true}
          title="Project Experience Management"
          
          rightContent={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Projek
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editing ? "Edit Projek" : "Tambah Projek Baru"}
                  </DialogTitle>
                </DialogHeader>

                <ProjectExperienceForm
                  initialData={editing ?? undefined}
                  editing={!!editing}
                  onSubmit={handleSubmit}
                />
              </DialogContent>
            </Dialog>
          }
        />


     
            <div className="flex w-full justify-between space-x-2">
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari Project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-7 w-full"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                <SearchIcon className="mr-2 h-4 w-4" /> Cari
              </Button>
            </div>
     
        {/* Table */}
 <Table>
  <TableHeader>
    <TableRow>
      <TableHead>ID</TableHead>
      <TableHead>No Sales Order</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead>Project Name</TableHead>
      <TableHead>Year</TableHead>
      <TableHead>Category</TableHead>
      <TableHead>Consulting Manager</TableHead>
      <TableHead className="text-right">Aksi</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {loading ? (
      <TableRow>
        <TableCell colSpan={8} className="text-center py-8">
          <Loader2 className="animate-spin mx-auto h-6 w-6" />
        </TableCell>
      </TableRow>
    ) : users.length === 0 ? (
      <TableRow>
        <TableCell colSpan={8} className="text-center py-8">
          Tidak ada data
        </TableCell>
      </TableRow>
    ) : (
      users.map((u: ProjectExperience, index) => (
        <TableRow key={index}>
          <TableCell>{u.id}</TableCell>
          <TableCell>{u.no_sales_order}</TableCell>
          <TableCell>{u.customer_name}</TableCell>
          <TableCell>{u.project_name}</TableCell>
          <TableCell>{u.project_year}</TableCell>
          <TableCell>{u.category}</TableCell>
          <TableCell>{u.consulting_manager_id ?? "-"}</TableCell>

          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEdit(u)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDelete(u.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>


        <GlobalPaginationFunction
          page={page}
          total={total}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          handleRowsPerPageChange={setRowsPerPage}
          handlePageChange={setPage}
        />
      </div>
    </div>
  );
}
