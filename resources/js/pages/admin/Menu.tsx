import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
    const [categories, setCategories] = useState<
        Array<{ id: number; nama: string }>
    >([]);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        kategori_id: "",
        nama_menu: "",
        harga_menu: "",
        foto_menu: "",
        tersedia: true,
        rekomendasi: false,
        best_seller: false,
    });
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

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
        // load categories
        fetch("/api/categories")
            .then((r) => (r.ok ? r.json() : Promise.reject(r)))
            .then((data) => setCategories(data))
            .catch(() => setCategories([]));

        // load existing menus for admin view
        fetch("/api/menus")
            .then((r) => (r.ok ? r.json() : Promise.reject(r)))
            .then((data) => {
                const mapped = data.map((m: any) => ({
                    id: m.id,
                    foto_menu: m.foto_menu || m.foto || "",
                    kategori: m.category?.nama || "",
                    kategori_id:
                        m.kategori_id ??
                        m.kategori_id ??
                        m.category?.id ??
                        undefined,
                    nama_menu: m.nama_menu,
                    harga_menu: m.harga_menu,
                    tersedia: !!m.tersedia,
                    rekomendasi: !!m.rekomendasi,
                    best_seller: !!m.best_seller,
                }));
                setItems(mapped);
            })
            .catch(() => {
                // fallback: keep empty
            });
    }, []);

    // Attach file input listener for uploads
    useEffect(() => {
        const input = document.getElementById(
            "menu-file-input"
        ) as HTMLInputElement | null;
        if (!input) return;

        const handler = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (!target.files || target.files.length === 0) return;
            const file = target.files[0];
            setUploading(true);
            try {
                const fd = new FormData();
                fd.append("file", file);

                const res = await fetch("/api/uploads", {
                    method: "POST",
                    body: fd,
                    credentials: "include",
                });

                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.message || "Upload failed");
                }

                const data = await res.json();
                // data.url contains storage path (e.g., /storage/menus/xxx.jpg)
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
                // reset input value so same file can be re-selected
                if (input) input.value = "";
            }
        };

        input.addEventListener("change", handler);
        return () => input.removeEventListener("change", handler);
    }, [toast, showForm]);

    const handleChange = (key: string, value: any) =>
        setForm((f) => ({ ...f, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
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
            // API returns different shapes for create (menu object) and update ({ message, data: menu })
            const created = raw?.data ?? raw;

            // Update local list
            const newItem: MenuRow = {
                id: created.id,
                foto_menu: created.foto_menu || "",
                kategori:
                    created.category?.nama ||
                    categories.find((c) => c.id === Number(created.kategori_id))
                        ?.nama ||
                    "",
                kategori_id:
                    created.kategori_id ?? created.category?.id ?? undefined,
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
                description: editingId
                    ? "Menu berhasil diupdate"
                    : "Menu berhasil ditambahkan",
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
        // scroll to form
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus menu ini?")) return;
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`/api/menus/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Gagal menghapus menu");
            setItems((prev) => prev.filter((p) => p.id !== id));
            toast({ title: "Deleted", description: "Menu berhasil dihapus" });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Gagal menghapus menu",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">Menu</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola daftar menu — foto, kategori, harga, dan status
                        ketersediaan
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border rounded-md px-2 py-1">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search menu..."
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
                    <div className="relative bg-white w-11/12 md:w-3/4 lg:w-2/3 rounded-md shadow-lg p-6 z-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-lg font-semibold">
                                {editingId
                                    ? `Mengedit menu #${editingId}`
                                    : "Tambah menu"}
                            </div>
                            <div className="flex items-center gap-2">
                                {editingId && !form.tersedia && (
                                    <div className="inline-block px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md">
                                        Tidak tersedia
                                    </div>
                                )}
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
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label>Foto</Label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            id="menu-file-input"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                const el =
                                                    document.getElementById(
                                                        "menu-file-input"
                                                    ) as HTMLInputElement | null;
                                                el?.click();
                                            }}
                                        >
                                            Tambah Foto
                                        </Button>
                                        {form.foto_menu && (
                                            <div className="w-28 h-20 overflow-hidden rounded-md border">
                                                <img
                                                    src={form.foto_menu}
                                                    alt="preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label>Kategori</Label>
                                    <select
                                        className="w-full border rounded-md p-2"
                                        value={form.kategori_id}
                                        onChange={(e) =>
                                            handleChange(
                                                "kategori_id",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">Pilih kategori</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label>Nama Menu</Label>
                                    <Input
                                        value={form.nama_menu}
                                        onChange={(e) =>
                                            handleChange(
                                                "nama_menu",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Harga</Label>
                                    <Input
                                        type="number"
                                        value={form.harga_menu}
                                        onChange={(e) =>
                                            handleChange(
                                                "harga_menu",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-4 md:col-span-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={form.tersedia}
                                            onChange={(e) =>
                                                handleChange(
                                                    "tersedia",
                                                    e.target.checked
                                                )
                                            }
                                        />{" "}
                                        Tersedia
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={form.rekomendasi}
                                            onChange={(e) =>
                                                handleChange(
                                                    "rekomendasi",
                                                    e.target.checked
                                                )
                                            }
                                        />{" "}
                                        Rekomendasi
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={form.best_seller}
                                            onChange={(e) =>
                                                handleChange(
                                                    "best_seller",
                                                    e.target.checked
                                                )
                                            }
                                        />{" "}
                                        Best Seller
                                    </label>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <Button type="submit">Simpan</Button>
                                <Button
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
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items
                            .filter((it) => {
                                if (!search) return true;
                                const q = search.toLowerCase();
                                return (
                                    String(it.nama_menu)
                                        .toLowerCase()
                                        .includes(q) ||
                                    String(it.kategori)
                                        .toLowerCase()
                                        .includes(q)
                                );
                            })
                            .map((it) => (
                                <tr
                                    key={it.id}
                                    className="border-t even:bg-gray-50"
                                >
                                    <td className="p-3 w-20">
                                        {it.foto_menu ? (
                                            <img
                                                src={it.foto_menu}
                                                alt={it.nama_menu}
                                                className="w-16 h-12 object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-16 h-12 bg-gray-100 rounded-md" />
                                        )}
                                    </td>
                                    <td className="p-3">{it.kategori}</td>
                                    <td className="p-3">{it.nama_menu}</td>
                                    <td className="p-3">
                                        Rp{" "}
                                        {Number(
                                            it.harga_menu || 0
                                        ).toLocaleString("id-ID")}
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

export default MenuAdmin;
