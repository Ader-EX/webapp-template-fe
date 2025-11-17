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


import UserMgmtForm from "@/components/user/UserMgmtForm";
import { ConsultingManager, ConsultingManagerInput, consultingManagerService } from "@/services/consManagerService";
import ConsultingManagerForm from "./ConsMgmtForm";

export default function ConsultingManagerPage() {
  const [users, setUsers] = useState<ConsultingManager[]>([]);
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
      const response = await consultingManagerService.getAll({
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

  const openEdit = (user: ConsultingManagerInput) => {
    setEditing(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await consultingManagerService.delete(id);
      await fetchUsers(page, searchTerm, rowsPerPage);
      toast.success("User berhasil dihapus!");
    } catch (error) {
      toast.error("Gagal menghapus user");
    }
  };

  const handleSubmit = async (data: ConsultingManagerInput) => {
    setSubmitting(true);
    try {
      if (editing) {
        await consultingManagerService.update(editing.id, data);
        toast.success("Manager diperbarui!");
      } else {
        await consultingManagerService.create(data);
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
          title="Consulting Manager Management"
          
          rightContent={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Manager
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editing ? "Edit Manager" : "Tambah Manager Baru"}
                  </DialogTitle>
                </DialogHeader>

                <ConsultingManagerForm
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
                  placeholder="Cari manager..."
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
            
               <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Departemen</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="animate-spin mx-auto h-6 w-6" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Tidak ada manager terdaftar
                </TableCell>
              </TableRow>
            ) : (
              users.map((u: ConsultingManager, index) => (
                <TableRow key={index}>
                <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.department_name}</TableCell>
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
