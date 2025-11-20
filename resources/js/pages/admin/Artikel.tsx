import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
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
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        id: null as number | null,
        name: "",
    });

    const [form, setForm] = useState<{
        judul: string;
        foto: string;
        isi: string;
    }>({
        judul: "",
        foto: "",
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
            foto: "",
            isi: "",
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleChange = (key: string, value: any) =>
        setForm((f) => ({ ...f, [key]: value }));

    // File upload handler - sama seperti Menu.tsx
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);

            const token = localStorage.getItem("admin_token");
            const res = await fetch("/api/uploads/artikel", {
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
            setForm((f) => ({ ...f, foto: data.url }));
            
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!form.judul || !form.isi) {
            toast({
                title: "Error",
                description: "Lengkapi judul dan isi artikel",
                variant: "destructive",
            });
            return;
        }

        const payload = {
            judul: form.judul,
            isi: form.isi,
            foto: form.foto || null,
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
                res = await fetch(`/api/articles/${editingId}`, {
                    method: "PUT",
                    headers: headers,
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch("/api/articles", {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(payload),
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
                foto: "",
                isi: "",
            });
            setEditingId(null);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Gagal menyimpan artikel",
                variant: "destructive",
            });
        }
    };

    const handleEdit = (item: ArtikelRow) => {
        setEditingId(item.id);
        setForm({
            judul: item.judul,
            foto: item.foto || "",
            isi: item.isi,
        });
        setShowForm(true);
        // scroll to form
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: number) => {
        if (!deleteDialog.id) return;

        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`/api/articles/${deleteDialog.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Gagal menghapus artikel");

            setItems((prev) => prev.filter((p) => p.id !== deleteDialog.id));

            toast({
                title: "Deleted",
                description: `${deleteDialog.name} berhasil dihapus`,
            });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Gagal menghapus artikel",
                variant: "destructive",
            });
        }
        
        // tutup modal
        setDeleteDialog({ open: false, id: null, name: "" });

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
                        Apakah Anda yakin ingin menghapus Artikel <b>{deleteDialog.name}</b>?  
                        Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="w-full border border-gray-300">
                            Batal
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={() => handleDelete(deleteDialog.id!)}
                            className="w-full bg-red-600 hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">Daftar Artikel</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border rounded-md px-2 py-1">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari artikel..."
                            className="outline-none text-sm w-48"
                            maxLength={255}
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
                    <div className="relative bg-white w-11/12 md:w-3/4 lg:w-2/3 rounded-md shadow-lg p-6 z-10 max-h-[90vh] overflow-y-auto">
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
                                {/* Foto Section */}
                                <div>
                                    <Label>Foto Artikel</Label>
                                    <div className="space-y-3">
                                        {/* Upload Button */}
                                        <div className="flex items-center gap-3">
                                            <input
                                                id="artikel-file-input"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileSelect}
                                                disabled={uploading}
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    const el = document.getElementById("artikel-file-input") as HTMLInputElement | null;
                                                    el?.click();
                                                }}
                                                disabled={uploading}
                                            >
                                                {uploading ? "Uploading..." : form.foto ? "Ganti Foto" : "Tambah Foto"}
                                            </Button>
                                        </div>

                                        {/* Preview */}
                                        {form.foto && (
                                            <div className="relative w-full h-40 overflow-hidden rounded-md border bg-gray-50">
                                                <img
                                                    src={form.foto}
                                                    alt="preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        console.error("Image load error:", form.foto);
                                                        e.currentTarget.src = "https://via.placeholder.com/300x200?text=Image+Error";
                                                    }}
                                                />
                                                {/* Remove button */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setForm(f => ({ ...f, foto: "" }));
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
                                        {!form.foto && !uploading && (
                                            <p className="text-xs text-gray-500">
                                                Upload foto artikel (opsional)
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
                                        maxLength={255}
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <Label>Isi Artikel</Label>
                                    <ReactQuill
                                        theme="snow"
                                        value={form.isi}
                                        onChange={(content) => handleChange("isi", content)}
                                        className="bg-white"
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                                [{ 'font': [] }],
                                                [{ 'size': ['small', false, 'large', 'huge'] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'color': [] }, { 'background': [] }],
                                                [{ 'script': 'sub'}, { 'script': 'super' }],
                                                [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
                                                [{ 'direction': 'rtl' }, { 'align': [] }],
                                                ['link', 'image', 'video'],
                                                ['blockquote', 'code-block'],
                                                ['clean']
                                            ]
                                        }}
                                        style={{ minHeight: '200px' }}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <Button type="submit" disabled={uploading}>
                                    Simpan
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                        setForm({
                                            judul: "",
                                            foto: "",
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

            <div className="bg-white border rounded-lg overflow-auto mt-4 max-w-4xl mx-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-900 text-white">
                            <th className="p-2 text-left">Foto</th>
                            <th className="p-2 text-left">Judul</th>
                            <th className="p-2 text-center">Aksi</th>
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
                                    <td className="p-2">
                                        {it.foto ? (
                                            <img
                                                src={it.foto}
                                                alt={it.judul}
                                                className="w-12 h-10 object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-12 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
                                                No Image
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-2">{it.judul}</td>
                                    <td className="p-2 text-center">
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
                                                    name: it.judul,
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
                    Menampilkan {items.length} artikel
                </div>
            </div>
        </div>
    );
};

export default ArtikelAdmin;