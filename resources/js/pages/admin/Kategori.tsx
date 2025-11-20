import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel
} from "@/Components/ui/alert-dialog";

type CategoryRow = {
    id: number;
    nama: string;
};

const KategoriAdmin = () => {
    const { toast } = useToast();
    const [items, setItems] = useState<CategoryRow[]>([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        nama: "",
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        id: null as number | null,
        name: "",
    });

    const openCreateForm = () => {
        setEditingId(null);
        setForm({
            nama: "",
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            if (!res.ok) {
                throw new Error("Failed to fetch categories");
            }
            const data = await res.json();
            setItems(data);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Gagal memuat kategori",
                variant: "destructive",
            });
            setItems([]);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (key: string, value: any) =>
        setForm((f) => ({ ...f, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.nama) {
            toast({
                title: "Error",
                description: "Nama kategori tidak boleh kosong",
                variant: "destructive",
            });
            return;
        }

        try {
            const token = localStorage.getItem("admin_token");
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            };

            let res;
            if (editingId) {
                res = await fetch(`/api/categories/${editingId}`, {
                    method: "PUT",
                    headers: headers,
                    body: JSON.stringify(form),
                });
            } else {
                res = await fetch("/api/categories", {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(form),
                });
            }

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Gagal menyimpan kategori");
            }

            toast({
                title: "Berhasil",
                description: editingId
                    ? "Kategori berhasil diupdate"
                    : "Kategori berhasil ditambahkan",
            });
            setShowForm(false);
            setForm({ nama: "" });
            setEditingId(null);
            fetchCategories(); // Refresh list
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Gagal menyimpan kategori",
                variant: "destructive",
            });
        }
    };

    const handleEdit = (item: CategoryRow) => {
        setEditingId(item.id);
        setForm({ nama: item.nama });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async () => {
        if (!deleteDialog.id) return;

        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`/api/categories/${deleteDialog.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Gagal menghapus kategori");

            // update tampilan
            setItems((prev) => prev.filter((p) => p.id !== deleteDialog.id));

            toast({
                title: "Deleted",
                description: `${deleteDialog.name} berhasil dihapus`,
            });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Gagal menghapus kategori",
                variant: "destructive",
            });
        }

        // tutup modal
        setDeleteDialog({ open: false, id: null, name: "" });
    };

    const filteredItems = items.filter((it) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return String(it.nama).toLowerCase().includes(q);
    });

    return (
        <div className="max-w-4xl mx-auto">

            <AlertDialog open={deleteDialog.open} onOpenChange={(v) => {
                if (!v) setDeleteDialog({ open: false, id: null, name: "" });
            }}>
            <AlertDialogContent className="max-w-md bg-white">
                <AlertDialogHeader>
                <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-red-100 p-3">
                    <Trash className="h-12 w-12 text-red-600" />
                    </div>
                </div>

                <AlertDialogTitle className="text-center text-2xl text-red-700">
                    Hapus Data?
                </AlertDialogTitle>

                <AlertDialogDescription className="text-center text-base">
                    Apakah Anda yakin ingin menghapus kategori <b>{deleteDialog.name}</b>?  
                    Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                <AlertDialogCancel className="w-full border border-gray-300">
                    Batal
                </AlertDialogCancel>

                <AlertDialogAction
                    onClick={handleDelete}
                    className="w-full bg-red-600 hover:bg-red-700"
                >
                    Hapus
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>

            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">Daftar Kategori</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border rounded-md px-2 py-1">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kategori..."
                            className="outline-none text-sm w-48"
                            maxLength={50}
                        />
                    </div>
                    <Button onClick={openCreateForm}>Tambah</Button>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black opacity-40"
                        onClick={() => {
                            setShowForm(false);
                            setEditingId(null);
                        }}
                    />
                    <div className="relative bg-white w-11/12 md:w-1/2 lg:w-1/3 rounded-md shadow-lg p-6 z-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-lg font-semibold">
                                {editingId
                                    ? `Mengedit kategori #${editingId}`
                                    : "Tambah kategori"}
                            </div>
                            <button
                                className="text-gray-500"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label>Nama Kategori</Label>
                                    <Input
                                        value={form.nama}
                                        onChange={(e) =>
                                            handleChange("nama", e.target.value)
                                        }
                                        maxLength={30}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <Button type="submit">Simpan</Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                        setForm({ nama: "" });
                                    }}
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white border rounded-md overflow-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-900 text-white">
                            <th className="p-3 text-left">#</th>
                            <th className="p-3 text-left">Nama</th>
                            <th className="p-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((it, idx) => (
                            <tr
                                key={it.id}
                                className="border-t even:bg-gray-50"
                            >
                                <td className="p-3">{idx + 1}</td>
                                <td className="p-3">{it.nama}</td>
                                <td className="p-3 text-center">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(it)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="ml-2"
                                        onClick={() =>
                                        setDeleteDialog({
                                                open: true,
                                                id: it.id,
                                                name: it.nama,
                                            })
                                        }
                                    >
                                        Hapus
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-3 bg-gray-50 text-sm text-muted-foreground">
                    Menampilkan {items.length} kategori
                </div>
            </div>
        </div>
    );
};

export default KategoriAdmin;
