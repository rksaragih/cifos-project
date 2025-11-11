import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useToast } from "@/hooks/use-toast";

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

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus kategori ini?")) return;
        try {
            const token = localStorage.getItem("admin_token");
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            };

            const res = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
                headers: headers,
            });

            if (!res.ok) {
                throw new Error("Gagal menghapus kategori");
            }

            toast({
                title: "Deleted",
                description: "Kategori berhasil dihapus",
            });
            fetchCategories(); // Refresh list
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Gagal menghapus kategori",
                variant: "destructive",
            });
        }
    };

    const filteredItems = items.filter((it) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return String(it.nama).toLowerCase().includes(q);
    });

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">Daftar Kategori</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border rounded-md px-2 py-1">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search kategori..."
                            className="outline-none text-sm w-48"
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
                            <th className="p-3 text-right">Actions</th>
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
                                <td className="p-3 text-right">
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
                                        onClick={() => handleDelete(it.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-3 bg-gray-50 text-sm text-muted-foreground">
                    Showing {items.length} items
                </div>
            </div>
        </div>
    );
};

export default KategoriAdmin;
