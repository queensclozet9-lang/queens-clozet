import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { galleryAdminCategories } from "@/lib/gallery";
import { timeSlots, SLOT_MAX_CAPACITY } from "@/lib/site";
import { Plus, Trash2, Edit3, Image as ImageIcon, Check, X, Upload, Clock, Users, AlertCircle, CheckCircle2 } from "lucide-react";


type Status = "pending" | "confirmed" | "completed" | "cancelled";

type Appointment = {
  id: string;
  full_name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  service: string;
  preferred_date: string;
  preferred_time: string;
  people_count: number;
  message: string | null;
  status: Status;
  created_at: string;
};

type CollectionDbItem = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  src: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
};

const statuses: Status[] = ["pending", "confirmed", "completed", "cancelled"];

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Portal — Queens Clozet" },
      { name: "description", content: "Queens Clozet management dashboard for appointments and collection items." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"appointments" | "collections">("collections");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Appointments State
  const [rows, setRows] = useState<Appointment[]>([]);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  // Collection Items State
  const [collectionItems, setCollectionItems] = useState<CollectionDbItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Form State for Collection Item
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CollectionDbItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<string>(galleryAdminCategories[0]);
  const [formDescription, setFormDescription] = useState("");
  const [formAlt, setFormAlt] = useState("");
  const [formSrc, setFormSrc] = useState("");
  const [formWidth, setFormWidth] = useState(1200);
  const [formHeight, setFormHeight] = useState(1000);
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadAppointments = useCallback(async () => {
    const { data, error: queryError } = await supabase
      .from("appointments")
      .select("*")
      .order("preferred_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (queryError) {
      setError(queryError.message);
      return;
    }
    setRows((data ?? []) as Appointment[]);
  }, []);

  const loadCollectionItems = useCallback(async () => {
    const { data, error: queryError } = await supabase
      .from("collection_items")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (queryError) {
      setError(queryError.message);
      return;
    }
    setCollectionItems((data ?? []) as CollectionDbItem[]);
  }, []);

  useEffect(() => {
    void (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate({ to: "/auth", replace: true });
        return;
      }
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      const admin = Boolean(roleData);
      setIsAdmin(admin);
      setChecking(false);
      if (admin) {
        await Promise.all([loadAppointments(), loadCollectionItems()]);
      }
    })();
  }, [loadAppointments, loadCollectionItems, navigate]);

  const filteredAppointments = useMemo(
    () =>
      rows.filter(
        (row) =>
          (!dateFilter || row.preferred_date === dateFilter) &&
          (statusFilter === "all" || row.status === statusFilter),
      ),
    [rows, dateFilter, statusFilter],
  );

  const filteredCollectionItems = useMemo(
    () =>
      collectionItems.filter(
        (item) => categoryFilter === "all" || item.category === categoryFilter,
      ),
    [collectionItems, categoryFilter],
  );

  async function updateStatus(id: string, status: Status) {
    setError("");
    const { error: updateError } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
  }

  async function removeAppointment(id: string) {
    if (!window.confirm("Delete this appointment request permanently?")) return;
    setError("");
    const { error: deleteError } = await supabase.from("appointments").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  function resetCollectionForm() {
    setEditingItem(null);
    setFormTitle("");
    setFormCategory(galleryAdminCategories[0]);
    setFormDescription("");
    setFormAlt("");
    setFormSrc("");
    setFormWidth(1200);
    setFormHeight(1000);
    setFormDisplayOrder(collectionItems.length + 1);
    setSelectedFile(null);
    setFilePreview("");
    setIsFormOpen(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  }

  function openEditItem(item: CollectionDbItem) {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormDescription(item.description ?? "");
    setFormAlt(item.alt ?? "");
    setFormSrc(item.src);
    setFormWidth(item.width ?? 1200);
    setFormHeight(item.height ?? 1000);
    setFormDisplayOrder(item.display_order ?? 0);
    setSelectedFile(null);
    setFilePreview(item.src);
    setIsFormOpen(true);
  }

  async function handleSaveCollectionItem(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSaving(true);

    try {
      let finalSrc = formSrc;

      if (selectedFile) {
        setUploading(true);
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `items/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("collections")
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("collections")
          .getPublicUrl(filePath);

        finalSrc = publicUrlData.publicUrl;
        setUploading(false);
      }

      if (!finalSrc) {
        throw new Error("Please select an image file to upload or enter an Image URL.");
      }

      if (editingItem) {
        const { error: updateError } = await supabase
          .from("collection_items")
          .update({
            title: formTitle,
            category: formCategory,
            description: formDescription,
            alt: formAlt || formTitle,
            src: finalSrc,
            width: formWidth,
            height: formHeight,
            display_order: formDisplayOrder,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingItem.id);

        if (updateError) throw updateError;
        setSuccessMsg("Collection item updated successfully!");
      } else {
        const { error: insertError } = await supabase.from("collection_items").insert({
          title: formTitle,
          category: formCategory,
          description: formDescription,
          alt: formAlt || formTitle,
          src: finalSrc,
          width: formWidth,
          height: formHeight,
          display_order: formDisplayOrder,
        });

        if (insertError) throw insertError;
        setSuccessMsg("New collection item added successfully!");
      }

      await loadCollectionItems();
      resetCollectionForm();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save collection item.";
      setError(msg);
    } finally {
      setUploading(false);
      setSaving(false);
    }
  }

  async function removeCollectionItem(id: string) {
    if (!window.confirm("Are you sure you want to delete this collection piece?")) return;
    setError("");
    setSuccessMsg("");
    const { error: deleteError } = await supabase
      .from("collection_items")
      .delete()
      .eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setSuccessMsg("Item removed from collections.");
    setCollectionItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (checking) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <p className="text-sm text-muted-foreground">Checking access…</p>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-md px-5 py-24 sm:px-8">
        <h1 className="font-serif text-3xl text-primary">No access</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This account is signed in but does not have admin access.
        </p>
        <button
          type="button"
          onClick={signOut}
          className="mt-8 rounded-sm border border-primary px-6 py-3 text-xs uppercase tracking-[0.18em] text-primary"
        >
          Sign out
        </button>
      </section>
    );
  }

  const inputClass =
    "w-full rounded-sm border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent";

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
      {/* Header Bar */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border pb-6">
        <div>
          <p className="eyebrow text-accent-foreground/70">Staff Admin Dashboard</p>
          <h1 className="mt-2 font-serif text-3xl text-primary">Queens Clozet Management</h1>

        </div>
        <button
          type="button"
          onClick={signOut}
          className="shrink-0 rounded-sm border border-primary px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="mt-8 flex border-b border-border gap-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab("collections");
            setError("");
            setSuccessMsg("");
          }}
          className={`pb-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors border-b-2 ${
            activeTab === "collections"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-primary"
          }`}
        >
          Collection Items ({collectionItems.length})
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("appointments");
            setError("");
            setSuccessMsg("");
          }}
          className={`pb-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors border-b-2 ${
            activeTab === "appointments"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-primary"
          }`}
        >
          Appointment Requests ({rows.length})
        </button>
      </div>

      {/* Status Notifications */}
      {error ? (
        <div className="mt-6 rounded-sm bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      {successMsg ? (
        <div className="mt-6 rounded-sm bg-primary/10 border border-primary/30 p-4 text-sm text-primary">
          {successMsg}
        </div>
      ) : null}

      {/* TAB 1: COLLECTIONS MANAGER */}
      {activeTab === "collections" ? (
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Filter Category:
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-sm border border-input bg-card px-3 py-1.5 text-xs text-foreground outline-none"
              >
                <option value="all">All Categories</option>
                {galleryAdminCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {!isFormOpen ? (
              <button
                type="button"
                onClick={() => {
                  resetCollectionForm();
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground hover:bg-forest-deep transition-colors"
              >
                <Plus className="h-4 w-4" /> Add New Piece
              </button>
            ) : null}
          </div>

          {/* Add / Edit Form Drawer/Card */}
          {isFormOpen ? (
            <form
              onSubmit={handleSaveCollectionItem}
              className="mt-8 rounded-sm border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="font-serif text-xl text-primary">
                  {editingItem ? "Edit Collection Piece" : "Add New Collection Piece"}
                </h2>
                <button
                  type="button"
                  onClick={resetCollectionForm}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* Left Column: Image Upload & Preview */}
                <div className="space-y-4">
                  <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold">
                    Upload Image File
                  </label>
                  <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-border bg-muted/20 p-6 text-center hover:border-accent">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="max-h-48 rounded object-cover shadow-sm"
                      />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-muted-foreground/60" />
                    )}
                    <label className="mt-4 cursor-pointer rounded-sm bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
                      <Upload className="mr-1.5 inline-block h-3.5 w-3.5" />
                      Browse File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      PNG, JPG, WEBP up to 5MB (Uploaded directly to Supabase storage)
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-1">
                      Or Direct Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formSrc}
                      onChange={(e) => setFormSrc(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Right Column: Metadata Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bridal Aari Blouse"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-1">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className={inputClass}
                    >
                      {galleryAdminCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Brief detail about handcrafted technique, fabric, or finish..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-1">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        placeholder="Image description"
                        value={formAlt}
                        onChange={(e) => setFormAlt(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formDisplayOrder}
                        onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="mt-8 flex justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={resetCollectionForm}
                  className="rounded-sm border border-border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground hover:bg-forest-deep disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {saving ? "Saving..." : editingItem ? "Update Piece" : "Save Piece"}
                </button>
              </div>
            </form>
          ) : null}

          {/* Collection Items Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCollectionItems.map((item) => (
              <article
                key={item.id}
                className="group relative rounded-sm border border-border bg-card overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={item.src}
                      alt={item.alt ?? item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-forest-deep/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-ivory backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl text-primary">{item.title}</h3>
                    {item.description ? (
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border p-4 bg-muted/10">
                  <span className="text-[11px] text-muted-foreground">
                    Order: {item.display_order ?? 0}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditItem(item)}
                      className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                      title="Edit Item"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeCollectionItem(item.id)}
                      className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredCollectionItems.length === 0 && !isFormOpen ? (
            <div className="mt-12 rounded-sm border border-dashed border-border p-12 text-center">
              <p className="text-sm text-muted-foreground">
                No collection items found in this category. Click &quot;Add New Piece&quot; to upload your first image!
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        /* TAB 2: APPOINTMENT REQUESTS */
        <div className="mt-8">
          {/* Time Slot Occupancy Matrix */}
          <div className="mb-8 rounded-sm border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h3 className="font-serif text-lg text-primary flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent-foreground" /> 1-Hour Time Slot Occupancy
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Showing slot utilization for {dateFilter ? dateFilter : "today (" + new Date().toISOString().slice(0, 10) + ")"}. Max capacity is 3 bookings per hour slot.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Open (0-2)
                </span>
                <span className="inline-flex items-center gap-1 text-destructive font-medium">
                  <span className="h-2 w-2 rounded-full bg-destructive"></span> Filled (3/3)
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {timeSlots.map((slot) => {
                const targetDate = dateFilter || new Date().toISOString().slice(0, 10);
                const bookedInSlot = rows.filter(
                  (row) => row.preferred_date === targetDate && row.preferred_time === slot && row.status !== "cancelled"
                );
                const count = bookedInSlot.length;
                const isFull = count >= SLOT_MAX_CAPACITY;

                return (
                  <div
                    key={slot}
                    className={`rounded-sm border p-3 transition-colors ${
                      isFull
                        ? "border-destructive/50 bg-destructive/5"
                        : count > 0
                        ? "border-amber-500/50 bg-amber-500/5"
                        : "border-border bg-background"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{slot}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isFull
                            ? "bg-destructive text-destructive-foreground"
                            : count > 0
                            ? "bg-amber-500 text-white"
                            : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {count}/{SLOT_MAX_CAPACITY} {isFull ? "FULL" : ""}
                      </span>
                    </div>

                    <div className="mt-2.5">
                      {bookedInSlot.length === 0 ? (
                        <p className="text-[11px] text-muted-foreground italic">No bookings</p>
                      ) : (
                        <ul className="space-y-1">
                          {bookedInSlot.map((b) => (
                            <li key={b.id} className="truncate text-[11px] text-foreground font-medium" title={`${b.full_name} (${b.service})`}>
                              • {b.full_name} <span className="text-muted-foreground">({b.service})</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Date Filter
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="mt-2 block rounded-sm border border-input bg-card px-3 py-2 text-sm text-foreground outline-none"
              />
            </label>
            <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Status Filter
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | Status)}
                className="mt-2 block rounded-sm border border-input bg-card px-3 py-2 text-sm text-foreground outline-none"
              >
                <option value="all">All</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            {dateFilter || statusFilter !== "all" ? (
              <button
                type="button"
                onClick={() => {
                  setDateFilter("");
                  setStatusFilter("all");
                }}
                className="pb-2 text-xs uppercase tracking-[0.14em] text-primary underline underline-offset-4"
              >
                Clear Filters
              </button>
            ) : null}
            <p className="pb-2 text-xs text-muted-foreground">{filteredAppointments.length} request(s)</p>
          </div>

          <div className="mt-8 space-y-4">
            {filteredAppointments.map((row) => (
              <article key={row.id} className="rounded-sm border border-border bg-card p-6">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate font-serif text-2xl text-primary">{row.full_name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {row.service} · {row.preferred_date} · {row.preferred_time} · {row.people_count}{" "}
                      person(s)
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {row.status}
                  </span>
                </div>

                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Phone</dt>
                    <dd className="mt-1 text-foreground">{row.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">WhatsApp</dt>
                    <dd className="mt-1 text-foreground">{row.whatsapp ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Email</dt>
                    <dd className="mt-1 break-words text-foreground">{row.email ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Requested</dt>
                    <dd className="mt-1 text-foreground">
                      {new Date(row.created_at).toLocaleString()}
                    </dd>
                  </div>
                  {row.message ? (
                    <div className="sm:col-span-2">
                      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Message</dt>
                      <dd className="mt-1 leading-relaxed text-foreground">{row.message}</dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-6 flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => void updateStatus(row.id, status)}
                      disabled={row.status === status}
                      className="rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-primary transition-colors hover:border-primary disabled:opacity-40"
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => void removeAppointment(row.id)}
                    className="rounded-full border border-destructive/40 px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-destructive hover:bg-destructive/10"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}

            {filteredAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No appointment requests match these filters.</p>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
