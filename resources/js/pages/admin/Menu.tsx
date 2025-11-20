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

type MenuRow = {
    id: number;
    foto_menu: string;
    kategori: string;
    kategori_id?: number;
    nama_menu: string;
    harga_menu: number;
    tersedia: boolean;
    rekomendasi?: boolean;
    best_seller?: boolean;
};

const MenuAdmin = () => {
    const { toast } = useToast();
    const [items, setItems] = useState<MenuRow[]>([]);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState<number | "all">("all");
    const [categories, setCategories] = useState<Array<{ id: number; nama: string }>>([]);
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        id: null as number | null,
        name: "",
    });
    const [form, setForm] = useState({
        kategori_id: "",
        nama_menu: "",
        harga_menu: "",
        foto_menu: "",
        tersedia: true,
        rekomendasi: false,
        best_seller: false,
    });

    const openCreateForm = () => {
        setEditingId(null);
        setForm({
            kategori_id: "",
            nama_menu: "",
            harga_menu: "",
            foto_menu: "",
            tersedia: true,
            rekomendasi: false,
            best_seller: false,
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        // Load categories
        fetch("/api/categories")
            .then((r) => (r.ok ? r.json() : Promise.reject(r)))
            .then((data) => setCategories(data))
            .catch(() => setCategories([]));

        // Load existing menus
        fetch("/api/menus")
            .then((r) => (r.ok ? r.json() : Promise.reject(r)))
            .then((data) => {
                const mapped = data.map((m: any) => ({
                    id: m.id,
                    foto_menu: m.foto_menu || "",
                    kategori: m.category?.nama || "",
                    kategori_id: m.kategori_id ?? m.category?.id ?? undefined,
                    nama_menu: m.nama_menu,
                    harga_menu: m.harga_menu,
                    tersedia: !!m.tersedia,
                    rekomendasi: !!m.rekomendasi,
                    best_seller: !!m.best_seller,
                }));
                setItems(mapped);
            })
            .catch(() => {});
    }, []);

    // File upload handler
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);

            const token = localStorage.getItem("admin_token");
            const res = await fetch("/api/uploads", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: fd,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Upload failed");
            }

            const data = await res.json();
            setForm((f) => ({ ...f, foto_menu: data.url }));
            
            toast({
                title: "Uploaded",
                description: "Foto berhasil diunggah",
            });
        } catch (err: any) {
            toast({
                title: "Upload error",
                description: err?.message || "Gagal mengunggah file",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
            // Reset input so same file can be selected again
            e.target.value = "";
        }
    };

    const handleChange = (key: string, value: any) =>
        setForm((f) => ({ ...f, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!form.kategori_id || !form.nama_menu || !form.harga_menu) {
            toast({
                title: "Error",
                description: "Lengkapi kategori, nama, dan harga",
                variant: "destructive",
            });
            return;
        }

        const payload = {
            kategori_id: Number(form.kategori_id),
            nama_menu: form.nama_menu,
            harga_menu: Number(form.harga_menu),
            foto_menu: form.foto_menu || null,
            tersedia: !!form.tersedia,
            rekomendasi: !!form.rekomendasi,
            best_seller: !!form.best_seller,
        };

        try {
            let res;
            const token = localStorage.getItem("admin_token");
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            };

            if (editingId) {
                res = await fetch(`/api/menus/${editingId}`, {
                    method: "PUT",
                    headers: headers,
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch("/api/menus", {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(payload),
                });
            }

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Failed to save menu");
            }

            const raw = await res.json();
            const created = raw?.data ?? raw;

            const newItem: MenuRow = {
                id: created.id,
                foto_menu: created.foto_menu || "",
                kategori: created.category?.nama || categories.find((c) => c.id === Number(created.kategori_id))?.nama || "",
                kategori_id: created.kategori_id ?? created.category?.id ?? undefined,
                nama_menu: created.nama_menu,
                harga_menu: created.harga_menu,
                tersedia: !!created.tersedia,
                rekomendasi: !!created.rekomendasi,
                best_seller: !!created.best_seller,
            };

            setItems((prev) => {
                if (editingId) {
                    return prev.map((p) => (p.id === editingId ? newItem : p));
                }
                return [newItem, ...prev];
            });

            toast({
                title: "Berhasil",
                description: editingId ? "Menu berhasil diupdate" : "Menu berhasil ditambahkan",
            });

            setShowForm(false);
            setForm({
                kategori_id: "",
                nama_menu: "",
                harga_menu: "",
                foto_menu: "",
                tersedia: true,
                rekomendasi: false,
                best_seller: false,
            });
            setEditingId(null);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Gagal menyimpan menu",
                variant: "destructive",
            });
        }
    };

    const handleEdit = (item: MenuRow) => {
        setEditingId(item.id);
        setForm({
            kategori_id: String(item.kategori_id ?? ""),
            nama_menu: item.nama_menu,
            harga_menu: String(item.harga_menu || ""),
            foto_menu: item.foto_menu || "",
            tersedia: !!item.tersedia,
            rekomendasi: !!item.rekomendasi,
            best_seller: !!item.best_seller,
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async () => {
        if (!deleteDialog.id) return;

        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`/api/menus/${deleteDialog.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Gagal menghapus menu");

            // update tampilan
            setItems((prev) => prev.filter((p) => p.id !== deleteDialog.id));

            toast({
                title: "Deleted",
                description: `${deleteDialog.name} berhasil dihapus`,
            });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Gagal menghapus menu",
                variant: "destructive",
            });
        }

        // tutup modal
        setDeleteDialog({ open: false, id: null, name: "" });
    };


    const handleExportCSV = () => {
        if (items.length === 0) {
            toast({
                title: "Tidak ada data",
                description: "Menu kosong, tidak dapat diexport",
                variant: "destructive"
            });
            return;
        }

        const header = ["ID", "Kategori", "Nama Menu", "Harga", "Tersedia", "Rekomendasi", "Best Seller"];
        const rows = items.map(it => [
            it.id,
            it.kategori,
            it.nama_menu,
            it.harga_menu,
            it.tersedia ? "Ya" : "Tidak",
            it.rekomendasi ? "Ya" : "Tidak",
            it.best_seller ? "Ya" : "Tidak",
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [header, ...rows].map(e => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = "menu_cifos.csv";
        link.click();
    };

    return (
        <div className="w-full">

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
                    Apakah Anda yakin ingin menghapus menu <b>{deleteDialog.name}</b>?  
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
                    <h1 className="text-2xl font-semibold">Daftar Menu</h1>
                </div>
                <div className="flex items-center gap-3">
                    
                    {/* Search */}
                    <div className="flex items-center bg-white border rounded-md px-2 py-1">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari menu..."
                            className="outline-none text-sm w-48"
                            maxLength={50}
                        />
                    </div>

                    {/* Filter Category */}
                    <select
                        className="border rounded-md px-2 py-1 text-sm bg-white"
                        value={filterCategory}
                        onChange={(e) =>
                            setFilterCategory(e.target.value === "all" ? "all" : Number(e.target.value))
                        }
                    >
                        <option value="all">Semua Kategori</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nama}
                            </option>
                        ))}
                    </select>

                    <Button onClick={openCreateForm}>Tambah</Button>

                    <Button onClick={handleExportCSV}>
                        Export CSV
                    </Button>

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
                    <div className="relative bg-white w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto rounded-md shadow-lg p-6 z-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-lg font-semibold">
                                {editingId ? `Mengedit menu #${editingId}` : "Tambah menu"}
                            </div>
                            <div className="flex items-center gap-2">
                                {editingId && !form.tersedia && (
                                    <div className="inline-block px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md">
                                        Tidak tersedia
                                    </div>
                                )}
                                <button
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Foto Section */}
                                <div>
                                    <Label>Foto Menu</Label>
                                    <div className="space-y-3">
                                        {/* Upload Button */}
                                        <div className="flex items-center gap-3">
                                            <input
                                                id="menu-file-input"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileSelect}
                                                disabled={uploading}
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    const el = document.getElementById("menu-file-input") as HTMLInputElement | null;
                                                    el?.click();
                                                }}
                                                disabled={uploading}
                                            >
                                                {uploading ? "Uploading..." : form.foto_menu ? "Ganti Foto" : "Tambah Foto"}
                                            </Button>
                                        </div>

                                        {/* Preview */}
                                        {form.foto_menu && (
                                            <div className="relative w-full h-40 overflow-hidden rounded-md border bg-gray-50">
                                                <img
                                                    src={form.foto_menu}
                                                    alt="preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        console.error("Image load error:", form.foto_menu);
                                                        e.currentTarget.src = "https://via.placeholder.com/300x200?text=Image+Error";
                                                    }}
                                                />
                                                {/* Remove button */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setForm(f => ({ ...f, foto_menu: "" }));
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                                                    title="Hapus foto"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}

                                        {/* Info/Loading */}
                                        {!form.foto_menu && !uploading && (
                                            <p className="text-xs text-gray-500">
                                                {editingId ? "Belum ada foto. Upload foto baru?" : "Upload foto menu (opsional)"}
                                            </p>
                                        )}
                                        
                                        {uploading && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                <span>Uploading...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Kategori */}
                                <div>
                                    <Label>Kategori</Label>
                                    <select
                                        className="w-full border rounded-md p-2"
                                        value={form.kategori_id}
                                        onChange={(e) => handleChange("kategori_id", e.target.value)}
                                    >
                                        <option value="">Pilih kategori</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Nama Menu */}
                                <div>
                                    <Label>Nama Menu</Label>
                                    <Input
                                        value={form.nama_menu}
                                        onChange={(e) => handleChange("nama_menu", e.target.value)}
                                        maxLength={50}
                                    />
                                </div>

                                {/* Harga */}
                                <div>
                                    <Label>Harga</Label>
                                    <Input
                                        type="text"
                                        value={form.harga_menu}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*$/.test(val)) {
                                            setForm({ ...form, harga_menu: val });
                                            }
                                        }}
                                        maxLength={15}
                                    />
                                </div>

                                {/* Checkboxes */}
                                <div className="flex items-center gap-4 md:col-span-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={form.tersedia}
                                            onChange={(e) => handleChange("tersedia", e.target.checked)}
                                        />
                                        Tersedia
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={form.rekomendasi}
                                            onChange={(e) => handleChange("rekomendasi", e.target.checked)}
                                        />
                                        Rekomendasi
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={form.best_seller}
                                            onChange={(e) => handleChange("best_seller", e.target.checked)}
                                        />
                                        Best Seller
                                    </label>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <Button type="submit" disabled={uploading}>
                                    Simpan
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                        setForm({
                                            kategori_id: "",
                                            nama_menu: "",
                                            harga_menu: "",
                                            foto_menu: "",
                                            tersedia: true,
                                            rekomendasi: false,
                                            best_seller: false,
                                        });
                                    }}
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white border rounded-lg overflow-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-900 text-white">
                            <th className="p-3 text-left">Foto</th>
                            <th className="p-3 text-left">Kategori</th>
                            <th className="p-3 text-left">Nama</th>
                            <th className="p-3 text-left">Harga</th>
                            <th className="p-3 text-left">Tersedia</th>
                            <th className="p-3 text-left">Rekomendasi</th>
                            <th className="p-3 text-left">Best Seller</th>
                            <th className="p-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items
                            .filter((it) => {
                                // Filter category
                                if (filterCategory !== "all" && it.kategori_id !== filterCategory) return false;

                                // Filter search text
                                if (!search) return true;
                                const q = search.toLowerCase();
                                return (
                                    String(it.nama_menu).toLowerCase().includes(q) ||
                                    String(it.kategori).toLowerCase().includes(q)
                                );
                            })
                            .map((it) => (
                                <tr key={it.id} className="border-t even:bg-gray-50">
                                    <td className="p-3 w-20">
                                        {it.foto_menu ? (
                                            <img
                                                src={it.foto_menu}
                                                alt={it.nama_menu}
                                                className="w-16 h-12 object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-16 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
                                                No Image
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3">{it.kategori}</td>
                                    <td className="p-3">{it.nama_menu}</td>
                                    <td className="p-3">
                                        Rp {Number(it.harga_menu || 0).toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-3">
                                        {it.tersedia ? (
                                            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                Tersedia
                                            </span>
                                        ) : (
                                            <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                                Tidak tersedia
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {it.rekomendasi ? (
                                            <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                                Yes
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {it.best_seller ? (
                                            <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                                Yes
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
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
                                                    name: it.nama_menu,
                                                })
                                            }
                                        >
                                            Hapus
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={8} className="p-4 text-center text-sm text-muted-foreground">
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="p-3 bg-gray-50 text-sm text-muted-foreground">
                    Menampilkan {items.length} menu
                </div>
            </div>
        </div>
    );
};

export default MenuAdmin;