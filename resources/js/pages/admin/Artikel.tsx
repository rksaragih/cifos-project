import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useToast } from "@/hooks/use-toast";

type ArtikelRow = {
    id: number;
    foto: string;
    judul: string;
    isi: string;
};

const ArtikelAdmin = () => {
    const { toast } = useToast();
    const [items, setItems] = useState<ArtikelRow[]>([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState<{
        judul: string;
        foto: File | string | null;
        isi: string;
    }>({
        judul: "",
        foto: null,
        isi: "",
    });
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showFullContent, setShowFullContent] = useState<
        Record<number, boolean>
    >({});

    const toggleShowMore = (id: number) => {
        setShowFullContent((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const fetchArticles = async () => {
        try {
            const res = await fetch("/api/articles");
            if (!res.ok) throw new Error("Failed to fetch articles");
            const data = await res.json();
            const mapped = data.map((m: any) => ({
                id: m.id,
                foto: m.foto || "",
                judul: m.judul,
                isi: m.isi,
            }));
            setItems(mapped);
        } catch (error) {
            console.error("Error fetching articles:", error);
        }
    };

    useEffect(() => {
        fetchArticles(); // Initial fetch

        const intervalId = setInterval(fetchArticles, 5000); // Poll every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    const openCreateForm = () => {
        setEditingId(null);
        setForm({
            judul: "",
            foto: null,
            isi: "",
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleChange = (key: string, value: any) =>
        setForm((f) => ({ ...f, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!form.judul) {
            toast({
                title: "Error",
                description: "Lengkapi judul",
                variant: "destructive",
            });
            return;
        }

        setUploading(true); // Indicate that an upload is in progress

        const formData = new FormData();
        formData.append("judul", form.judul);
        formData.append("isi", form.isi);

        if (form.foto instanceof File) {
            formData.append("foto", form.foto);
        } else if (typeof form.foto === "string" && form.foto) {
            // If it's an existing image URL, send it as a string
            formData.append("foto_url", form.foto); // Backend should handle this
        }

        try {
            let res;
            const token = localStorage.getItem("admin_token");
            const headers = {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                // Do NOT set Content-Type for FormData, browser sets it automatically
            };

            if (editingId) {
                // For PUT requests with FormData, use _method=PUT
                formData.append("_method", "PUT");
                res = await fetch(`/api/articles/${editingId}`, {
                    method: "POST", // Use POST for FormData with _method=PUT
                    headers: headers,
                    body: formData,
                });
            } else {
                res = await fetch("/api/articles", {
                    method: "POST",
                    headers: headers,
                    body: formData,
                });
            }

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Failed to save article");
            }

            const raw = await res.json();
            const created = raw?.data ?? raw;

            const newItem: ArtikelRow = {
                id: created.id,
                foto: created.foto || "",
                judul: created.judul,
                isi: created.isi,
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
                    ? "Artikel berhasil diupdate"
                    : "Artikel berhasil ditambahkan",
            });
            setShowForm(false);
            setForm({
                judul: "",
                foto: null,
                isi: "",
            });
            setEditingId(null);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Gagal menyimpan artikel",
                variant: "destructive",
            });
        } finally {
            setUploading(false); // Reset uploading state
        }
    };

    const handleEdit = (item: ArtikelRow) => {
        setEditingId(item.id);
        setForm({
            judul: item.judul,
            foto: item.foto || null, // Ensure foto is string or null for existing images
            isi: item.isi,
        });
        setShowForm(true);
        // scroll to form
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus artikel ini?")) return;
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`/api/articles/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Gagal menghapus artikel");
            setItems((prev) => prev.filter((p) => p.id !== id));
            toast({
                title: "Deleted",
                description: "Artikel berhasil dihapus",
            });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Gagal menghapus artikel",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">Daftar Artikel</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border rounded-md px-2 py-1">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search artikel..."
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
                                    ? `Mengedit artikel #${editingId}`
                                    : "Tambah Artikel"}
                            </div>
                            <div className="flex items-center gap-2">
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
                                    <Label>Foto Artikel</Label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            id="artikel-file-input"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleChange(
                                                    "foto",
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                const el =
                                                    document.getElementById(
                                                        "artikel-file-input"
                                                    ) as HTMLInputElement | null;
                                                el?.click();
                                            }}
                                        >
                                            Tambah Foto
                                        </Button>
                                        {form.foto && (
                                            <div className="w-28 h-20 overflow-hidden rounded-md border">
                                                <img
                                                    src={
                                                        typeof form.foto ===
                                                        "string"
                                                            ? form.foto
                                                            : URL.createObjectURL(
                                                                  form.foto
                                                              )
                                                    }
                                                    alt="preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <Label>Judul</Label>
                                    <Input
                                        value={form.judul}
                                        onChange={(e) =>
                                            handleChange(
                                                "judul",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <Label>Isi Artikel</Label>
                                    <textarea
                                        value={form.isi}
                                        onChange={(e) =>
                                            handleChange("isi", e.target.value)
                                        }
                                        className="w-full border rounded-md p-2 h-32"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <Button type="submit" disabled={uploading}>
                                    Simpan
                                </Button>
                                {uploading && (
                                    <span className="text-sm text-gray-500">
                                        Uploading...
                                    </span>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                        setForm({
                                            judul: "",
                                            foto: null,
                                            isi: "",
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

            <div className="bg-white border rounded-lg overflow-auto mt-4">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-900 text-white">
                            <th className="p-3 text-left w-1/8">Foto</th>
                            <th className="p-3 text-left w-1/4">Judul</th>
                            <th className="p-3 text-left w-1/2">Isi</th>
                            <th className="p-3 text-right w-1/8">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items
                            .filter((it) => {
                                if (!search) return true;
                                const q = search.toLowerCase();
                                return (
                                    String(it.judul)
                                        .toLowerCase()
                                        .includes(q) ||
                                    String(it.isi).toLowerCase().includes(q)
                                );
                            })
                            .map((it) => (
                                <tr
                                    key={it.id}
                                    className="border-t even:bg-gray-50"
                                >
                                    <td className="p-3 w-20">
                                        {it.foto ? (
                                            <img
                                                src={it.foto}
                                                alt={it.judul}
                                                className="w-16 h-12 object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-16 h-12 bg-gray-100 rounded-md" />
                                        )}
                                    </td>
                                    <td className="p-3">{it.judul}</td>
                                    <td className="p-3">
                                        {showFullContent[it.id] ? (
                                            <p>{it.isi}</p>
                                        ) : (
                                            <p className="line-clamp-2">
                                                {it.isi}
                                            </p>
                                        )}
                                        {it.isi.length > 100 && (
                                            <button
                                                onClick={() =>
                                                    toggleShowMore(it.id)
                                                }
                                                className="text-blue-500 hover:underline text-xs mt-1"
                                            >
                                                {showFullContent[it.id]
                                                    ? "Show Less"
                                                    : "Show More"}
                                            </button>
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
                        {items.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-4 text-center text-sm text-muted-foreground"
                                >
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="p-3 bg-gray-50 text-sm text-muted-foreground">
                    Showing {items.length} items
                </div>
            </div>
        </div>
    );
};

export default ArtikelAdmin;
