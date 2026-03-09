import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trash2, Plus, Check, Lock, LogOut, Edit, X, Mail } from "lucide-react";
import { userAPI, adminAPI, bookingAPI, authAPI } from "@/services/api";

const Admin = () => {
    const {
        media,
        addMedia,
        removeMedia,
        categories,
        addService,
        removeService,
        updateServicePrice,
        updateServiceDetails,
        bookings,
        updateBookingStatus,
        updateBooking,
        offers,
        addOffer,
        removeOffer,
        updateOffer,
        users,
        loginUser,
        logoutUser,
    } = useStore();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [loginError, setLoginError] = useState("");
    const [backendUsers, setBackendUsers] = useState<any[]>([]);
    const [backendBookings, setBackendBookings] = useState<any[]>([]);

    const [newMedia, setNewMedia] = useState({ src: "", label: "", type: "photo" as "photo" | "video", category: "Makeup" });
    const [newService, setNewService] = useState({ name: "", price: "", categoryId: "hair" });
    const [newOffer, setNewOffer] = useState({ title: "", price: "", originalPrice: "", desc: "", iconName: "Star", tag: "", tagColor: "bg-primary", isMembership: false });
    const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
    const [editServiceForm, setEditServiceForm] = useState({ name: "", price: "" });

    const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
    const [editBookingForm, setEditBookingForm] = useState({ date: "", time: "" });
    const [editingOfferId, setEditingOfferId] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("styloria-jwt-token");
        const role = localStorage.getItem("styloria-role");
        if (token && role === "admin") {
            setIsAuthenticated(true);
            fetchUsers();
            fetchBookings();
        }
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await bookingAPI.getAllBookings();
            setBackendBookings(res.data);
        } catch (err) {
            console.error("Failed to fetch bookings");
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await userAPI.getAllUsers();
            setBackendUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users");
        }
    };

    const handleSendFeedbackEmail = async (email: string) => {
        const message = window.prompt(`Compose feedback reply for ${email}:`);
        if (!message) return;

        try {
            await adminAPI.sendFeedbackEmail({ to: email, subject: "Styloria Admin - Feedback Response", text: message });
            alert("Feedback sent successfully.");
        } catch (err) {
            alert("Failed to send feedback email.");
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");

        try {
            const loginRes = await authAPI.login({
                email: loginForm.username,
                password: loginForm.password,
            });

            const { token, user } = loginRes.data;
            if (user.role !== "admin") {
                setLoginError("Access denied: You are not an admin.");
                return;
            }

            localStorage.setItem("styloria-jwt-token", token);
            localStorage.setItem("styloria-role", user.role);
            loginUser(user);
            setIsAuthenticated(true);
            fetchUsers();
            fetchBookings();
        } catch (err: any) {
            setLoginError(err.response?.data?.message || "Invalid credentials. Are you an admin?");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("styloria-jwt-token");
        localStorage.removeItem("styloria-role");
        logoutUser();
        setLoginForm({ username: "", password: "" });
    };

    const handleAddMedia = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMedia.src || !newMedia.label) return;
        addMedia(newMedia);
        setNewMedia({ src: "", label: "", type: "photo", category: "Makeup" });
    };

    const handleAddService = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newService.name || !newService.price) return;
        addService(newService.categoryId, { name: newService.name, price: newService.price });
        setNewService({ name: "", price: "", categoryId: "hair" });
    };

    const handleAddOffer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newOffer.title || !newOffer.price) return;
        if (editingOfferId) {
            updateOffer(editingOfferId, newOffer);
            setEditingOfferId(null);
        } else {
            addOffer({ ...newOffer });
        }
        setNewOffer({ title: "", price: "", originalPrice: "", desc: "", iconName: "Star", tag: "", tagColor: "bg-primary", isMembership: false });
    };

    const handleSaveEditService = (categoryId: string, serviceId: string) => {
        if (!editServiceForm.name || !editServiceForm.price) return;
        updateServiceDetails(categoryId, serviceId, editServiceForm.name, editServiceForm.price);
        setEditingServiceId(null);
        setEditServiceForm({ name: "", price: "" });
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-4 pt-28">
                    <div className="glass-card w-full max-w-md p-8 rounded-3xl animate-in fade-in zoom-in duration-500">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground shadow-lg">
                                <Lock size={32} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-center mb-2">Admin Access</h1>
                        <p className="text-muted-foreground text-center mb-8">Please log in to manage your site</p>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={loginForm.username}
                                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                                    placeholder="Enter username"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            {loginError && (
                                <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{loginError}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full gradient-primary text-primary-foreground py-3.5 rounded-xl text-base font-semibold hover:opacity-90 transition-opacity mt-4"
                            >
                                Log In
                            </button>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-28 pb-16 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>

                    <Tabs defaultValue="bookings" className="w-full">
                        <TabsList className="grid w-full grid-cols-5 mb-8">
                            <TabsTrigger value="bookings">Bookings</TabsTrigger>
                            <TabsTrigger value="services">Services</TabsTrigger>
                            <TabsTrigger value="gallery">Gallery</TabsTrigger>
                            <TabsTrigger value="offers">Offers</TabsTrigger>
                            <TabsTrigger value="users">Users</TabsTrigger>
                        </TabsList>

                        {/* Bookings Tab */}
                        <TabsContent value="bookings" className="space-y-4">
                            <div className="glass-card p-6 rounded-2xl">
                                <h2 className="text-xl font-semibold mb-4">Manage Bookings</h2>
                                {backendBookings.length === 0 ? (
                                    <p className="text-muted-foreground">No bookings yet.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-border/50 text-muted-foreground">
                                                    <th className="p-3 font-medium">Name</th>
                                                    <th className="p-3 font-medium">Phone</th>
                                                    <th className="p-3 font-medium">Service</th>
                                                    <th className="p-3 font-medium">Date & Time</th>
                                                    <th className="p-3 font-medium">Beautician</th>
                                                    <th className="p-3 font-medium">Status</th>
                                                    <th className="p-3 font-medium text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {backendBookings.map((b) => (
                                                    <tr key={b._id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                                                        <td className="p-3 font-medium">{b.name}</td>
                                                        <td className="p-3 text-muted-foreground">{b.phone}</td>
                                                        <td className="p-3">{b.service}</td>
                                                        <td className="p-3">
                                                            {editingBookingId === b.id ? (
                                                                <div className="flex gap-2 min-w-[200px]">
                                                                    <input type="date" value={editBookingForm.date} onChange={e => setEditBookingForm({ ...editBookingForm, date: e.target.value })} className="border rounded px-2 w-full text-sm bg-background border-input" />
                                                                    <input type="time" value={editBookingForm.time} onChange={e => setEditBookingForm({ ...editBookingForm, time: e.target.value })} className="border rounded px-2 w-full text-sm bg-background border-input" />
                                                                </div>
                                                            ) : (
                                                                <span className="whitespace-nowrap">{new Date(b.date).toLocaleDateString()} at {b.time}</span>
                                                            )}
                                                        </td>
                                                        <td className="p-3">{b.beautician}</td>
                                                        <td className="p-3">
                                                            <span
                                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${b.status === "Confirmed"
                                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                    : b.status === "Declined" || b.status === "Cancelled"
                                                                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                                        : b.status === "Pending"
                                                                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                                            : "bg-secondary text-secondary-foreground"
                                                                    }`}
                                                            >
                                                                {b.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {editingBookingId === b._id ? (
                                                                    <>
                                                                        <button onClick={() => { updateBooking(b._id, editBookingForm.date, editBookingForm.time); setEditingBookingId(null); }} className="text-green-600 hover:text-green-700 bg-green-100 p-2 rounded-full transition-colors" title="Save Booking">
                                                                            <Check size={16} />
                                                                        </button>
                                                                        <button onClick={() => setEditingBookingId(null)} className="text-red-500 bg-red-100 p-2 rounded-full transition-colors" title="Cancel">
                                                                            <X size={16} />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <button onClick={() => { setEditingBookingId(b._id); setEditBookingForm({ date: b.date, time: b.time }); }} className="text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition-colors" title="Edit Booking Date/Time">
                                                                        <Edit size={16} />
                                                                    </button>
                                                                )}
                                                                {b.status === "Pending" && (
                                                                    <>
                                                                        <button onClick={async () => { await bookingAPI.updateBookingStatus(b._id, "Confirmed"); fetchBookings(); }} className="text-green-600 hover:text-green-700 bg-green-100 hover:bg-green-200 p-2 rounded-full transition-colors" title="Confirm Booking">
                                                                            <Check size={16} />
                                                                        </button>
                                                                        <button onClick={async () => { await bookingAPI.updateBookingStatus(b._id, "Declined"); fetchBookings(); }} className="text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 p-2 rounded-full transition-colors" title="Decline Booking">
                                                                            <X size={16} />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Services Tab */}
                        <TabsContent value="services" className="space-y-6">
                            <div className="glass-card p-6 rounded-2xl">
                                <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
                                <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <input
                                        placeholder="Service Name"
                                        value={newService.name}
                                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border bg-background"
                                        required
                                    />
                                    <input
                                        placeholder="Price (e.g. ₹999)"
                                        value={newService.price}
                                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border bg-background"
                                        required
                                    />
                                    <select
                                        value={newService.categoryId}
                                        onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border bg-background"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.label}</option>
                                        ))}
                                    </select>
                                    <button type="submit" className="gradient-primary text-white rounded-xl py-2 flex items-center justify-center gap-2">
                                        <Plus size={18} /> Add
                                    </button>
                                </form>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {categories.map((c) => (
                                    <div key={c.id} className="glass-card p-6 rounded-2xl">
                                        <h3 className="text-lg font-bold mb-4">{c.label}</h3>
                                        <ul className="space-y-3">
                                            {c.services.map((s) => (
                                                <li key={s.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                                    <div>
                                                        <p className="font-medium">{s.name}</p>
                                                        {editingServiceId === s.id ? (
                                                            <div className="flex flex-col gap-2 mt-1">
                                                                <input
                                                                    className="border border-input rounded-md px-2 py-0.5 text-sm bg-background w-full max-w-[150px]"
                                                                    value={editServiceForm.name}
                                                                    onChange={(e) => setEditServiceForm({ ...editServiceForm, name: e.target.value })}
                                                                />
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        className="border border-input rounded-md px-2 py-0.5 text-sm w-24 bg-background"
                                                                        value={editServiceForm.price}
                                                                        onChange={(e) => setEditServiceForm({ ...editServiceForm, price: e.target.value })}
                                                                    />
                                                                    <button
                                                                        onClick={() => handleSaveEditService(c.id, s.id)}
                                                                        className="text-green-600 bg-green-100 p-1 rounded-md"
                                                                    >
                                                                        <Check size={14} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditingServiceId(null)}
                                                                        className="text-red-500 bg-red-100 p-1 rounded-md"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-primary font-semibold text-sm cursor-pointer hover:underline" onClick={() => {
                                                                setEditingServiceId(s.id);
                                                                setEditServiceForm({ name: s.name, price: s.price });
                                                            }}>
                                                                {s.price} <Edit size={12} className="inline ml-1" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => removeService(c.id, s.id)}
                                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Gallery Tab */}
                        <TabsContent value="gallery" className="space-y-6">
                            <div className="glass-card p-6 rounded-2xl">
                                <h2 className="text-xl font-semibold mb-4">Add New Media</h2>
                                <form onSubmit={handleAddMedia} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <input
                                        placeholder="Image URL"
                                        value={newMedia.src}
                                        onChange={(e) => setNewMedia({ ...newMedia, src: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border bg-background lg:col-span-2"
                                        required
                                    />
                                    <input
                                        placeholder="Label / Title"
                                        value={newMedia.label}
                                        onChange={(e) => setNewMedia({ ...newMedia, label: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border bg-background"
                                        required
                                    />
                                    <select
                                        value={newMedia.category}
                                        onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border bg-background"
                                    >
                                        {["Makeup", "Bridal", "Hair", "Nails", "Skincare", "Studio"].map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <button type="submit" className="gradient-primary text-white rounded-xl py-2 flex items-center justify-center gap-2">
                                        <Plus size={18} /> Add
                                    </button>
                                </form>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {media.map((m) => (
                                    <div key={m.id} className="relative group rounded-xl overflow-hidden aspect-square border">
                                        <img src={m.src} alt={m.label} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => removeMedia(m.id)}
                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Offers Tab */}
                        <TabsContent value="offers" className="space-y-6">
                            <div className="glass-card p-6 rounded-2xl">
                                <h2 className="text-xl font-semibold mb-4">Add New Offer / Membership</h2>
                                <form onSubmit={handleAddOffer} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        placeholder="Title (e.g. Summer Glow)"
                                        value={newOffer.title}
                                        onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border bg-background"
                                        required
                                    />
                                    <input
                                        placeholder="Price (e.g. ₹2,499)"
                                        value={newOffer.price}
                                        onChange={(e) => setNewOffer({ ...newOffer, price: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border bg-background"
                                        required
                                    />
                                    <input
                                        placeholder="Original Price (optional)"
                                        value={newOffer.originalPrice}
                                        onChange={(e) => setNewOffer({ ...newOffer, originalPrice: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border bg-background"
                                    />
                                    <input
                                        placeholder="Tag (e.g. Summer Special)"
                                        value={newOffer.tag}
                                        onChange={(e) => setNewOffer({ ...newOffer, tag: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border bg-background"
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={newOffer.desc}
                                        onChange={(e) => setNewOffer({ ...newOffer, desc: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border bg-background sm:col-span-2"
                                        rows={2}
                                    />
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isMembership"
                                            checked={newOffer.isMembership}
                                            onChange={(e) => setNewOffer({ ...newOffer, isMembership: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="isMembership" className="text-sm">Is this a Membership? (Shows on homepage)</label>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:col-span-2">
                                        <button type="submit" className="flex-1 gradient-primary text-white rounded-xl py-2 flex items-center justify-center gap-2">
                                            {editingOfferId ? <><Check size={18} /> Update Offer</> : <><Plus size={18} /> Add Offer</>}
                                        </button>
                                        {editingOfferId && (
                                            <button type="button" onClick={() => { setEditingOfferId(null); setNewOffer({ title: "", price: "", originalPrice: "", desc: "", iconName: "Star", tag: "", tagColor: "bg-primary", isMembership: false }); }} className="flex-1 border border-input bg-secondary text-foreground hover:bg-secondary/50 rounded-xl py-2 flex items-center justify-center gap-2 transition-colors">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {offers.map((o) => (
                                    <div key={o.id} className="glass-card p-6 rounded-2xl relative">
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingOfferId(o.id);
                                                    setNewOffer({ title: o.title, price: o.price, originalPrice: o.originalPrice || "", desc: o.desc || "", iconName: o.iconName || "Star", tag: o.tag || "", tagColor: o.tagColor || "bg-primary", isMembership: o.isMembership || false });
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => removeOffer(o.id)}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <h3 className="text-lg font-bold pr-8">{o.title}</h3>
                                        <p className="text-primary font-semibold text-xl my-2">{o.price} {o.originalPrice && <span className="text-muted-foreground line-through text-sm">{o.originalPrice}</span>}</p>
                                        <p className="text-sm text-muted-foreground mb-3">{o.desc}</p>
                                        {o.tag && <span className="text-xs bg-secondary px-2 py-1 rounded inline-block mb-2">{o.tag}</span>}
                                        <p className="text-xs font-medium text-amber-600">{o.isMembership ? "Membership (Homepage)" : "Standard Offer"}</p>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Users Tab */}
                        <TabsContent value="users" className="space-y-4">
                            <div className="glass-card p-6 rounded-2xl">
                                <h2 className="text-xl font-semibold mb-4">Registered Users</h2>
                                {backendUsers.length === 0 ? (
                                    <p className="text-muted-foreground">No users registered yet.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-border/50 text-muted-foreground">
                                                    <th className="p-3 font-medium">Name</th>
                                                    <th className="p-3 font-medium">Email Address</th>
                                                    <th className="p-3 font-medium">Phone Number</th>
                                                    <th className="p-3 font-medium text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {backendUsers.map((u, i) => (
                                                    <tr key={u._id || i} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                                                        <td className="p-3 font-medium flex items-center gap-2">
                                                            {u.profileImage ? (
                                                                <img src={u.profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover shrink-0" />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                                                                    {u.name.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                            {u.name}
                                                        </td>
                                                        <td className="p-3 text-muted-foreground">{u.email}</td>
                                                        <td className="p-3 text-muted-foreground">{u.phone || "-"}</td>
                                                        <td className="p-3 text-right">
                                                            <button onClick={() => handleSendFeedbackEmail(u.email)} className="text-sm bg-blue-100/50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ml-auto">
                                                                <Mail size={14} /> Send Reply
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                    </Tabs>
                </div>
            </div>
            <Footer />
        </div >
    );
};

export default Admin;
