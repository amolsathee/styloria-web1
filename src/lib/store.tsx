import React, { createContext, useContext, useEffect, useState } from "react";
import galleryMakeup from "@/assets/gallery-makeup.jpg";
import galleryHair from "@/assets/gallery-hair.jpg";
import galleryNails from "@/assets/gallery-nails.jpg";
import galleryFacial from "@/assets/gallery-facial.jpg";
import bridalImg from "@/assets/bridal-1.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import { Scissors, Sparkles, Heart, Flower2 } from "lucide-react";

export type MediaItem = {
    id: string;
    src: string;
    type: "photo" | "video";
    label: string;
    category: string;
};

export type Service = {
    id: string;
    name: string;
    price: string;
};

export type ServiceCategory = {
    id: string;
    label: string;
    iconName: string; // Storing string for lucide icon
    services: Service[];
};

export type Booking = {
    id: string;
    name: string;
    phone: string;
    email?: string;
    service: string;
    date: string;
    time: string;
    beautician: string;
    status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
};

export type Offer = {
    id: string;
    iconName: string;
    title: string;
    price: string;
    originalPrice?: string;
    desc: string;
    tag?: string;
    tagColor?: string;
    isMembership?: boolean;
};

export type User = {
    name: string;
    email: string;
    phone?: string;
};

type StoreContextType = {
    media: MediaItem[];
    addMedia: (item: Omit<MediaItem, "id">) => void;
    removeMedia: (id: string) => void;
    categories: ServiceCategory[];
    addService: (categoryId: string, service: Omit<Service, "id">) => void;
    removeService: (categoryId: string, serviceId: string) => void;
    updateServicePrice: (categoryId: string, serviceId: string, newPrice: string) => void;
    updateServiceDetails: (categoryId: string, serviceId: string, name: string, price: string) => void;
    bookings: Booking[];
    addBooking: (booking: Omit<Booking, "id" | "status">) => void;
    updateBookingStatus: (id: string, status: Booking["status"]) => void;
    updateBooking: (id: string, date: string, time: string) => void;
    offers: Offer[];
    addOffer: (offer: Omit<Offer, "id">) => void;
    removeOffer: (id: string) => void;
    updateOffer: (id: string, offer: Partial<Offer>) => void;
    currentUser: User | null;
    users: User[];
    loginUser: (user: User) => void;
    logoutUser: () => void;
    updateUser: (email: string, name: string, phone?: string) => void;
};

const initialMedia: MediaItem[] = [
    { id: "1", src: galleryMakeup, type: "photo", label: "Bridal Glam Makeup", category: "Makeup" },
    { id: "2", src: bridalImg, type: "photo", label: "Bridal Elegance", category: "Bridal" },
    { id: "3", src: galleryHair, type: "photo", label: "Hair Styling", category: "Hair" },
    { id: "4", src: galleryNails, type: "photo", label: "Nail Art Design", category: "Nails" },
    { id: "5", src: galleryFacial, type: "photo", label: "Skincare Glow", category: "Skincare" },
    { id: "6", src: heroBg, type: "photo", label: "Studio Ambience", category: "Studio" },
    { id: "7", src: galleryMakeup, type: "photo", label: "Party Makeup", category: "Makeup" },
    { id: "8", src: galleryHair, type: "photo", label: "Colour & Highlights", category: "Hair" },
    { id: "9", src: bridalImg, type: "photo", label: "Engagement Look", category: "Bridal" },
];

const initialCategories: ServiceCategory[] = [
    {
        id: "hair",
        label: "💇‍♀️ Hair",
        iconName: "Scissors",
        services: [
            { id: "s1", name: "Haircut", price: "₹499" },
            { id: "s2", name: "Hair Spa", price: "₹1,299" },
            { id: "s3", name: "Hair Smoothening", price: "₹4,999" },
            { id: "s4", name: "Hair Coloring", price: "₹2,499" },
            { id: "s5", name: "Keratin Treatment", price: "₹5,999" },
        ],
    },
    {
        id: "makeup",
        label: "💄 Makeup",
        iconName: "Sparkles",
        services: [
            { id: "s6", name: "Party Makeup", price: "₹2,999" },
            { id: "s7", name: "Engagement Makeup", price: "₹4,999" },
            { id: "s8", name: "Bridal HD Makeup", price: "₹9,999" },
            { id: "s9", name: "Airbrush Bridal", price: "₹12,999" },
        ],
    },
    {
        id: "nails",
        label: "💅 Nails",
        iconName: "Heart",
        services: [
            { id: "s10", name: "Manicure", price: "₹799" },
            { id: "s11", name: "Pedicure", price: "₹999" },
            { id: "s12", name: "Nail Extensions", price: "₹1,999" },
            { id: "s13", name: "Gel Polish", price: "₹699" },
        ],
    },
    {
        id: "skin",
        label: "🌸 Skin & Facial",
        iconName: "Flower2",
        services: [
            { id: "s14", name: "Cleanup", price: "₹899" },
            { id: "s15", name: "Fruit Facial", price: "₹1,299" },
            { id: "s16", name: "Gold Facial", price: "₹1,999" },
            { id: "s17", name: "Hydra Facial", price: "₹3,999" },
        ],
    },
];

const initialOffers: Offer[] = [
    { id: "o1", iconName: "Gem", title: "Monthly Glow Membership", price: "₹1,999/mo", originalPrice: "₹2,800/mo", desc: "1 Facial + 1 Hair Spa + 10% off all services", tag: "Membership", tagColor: "bg-primary", isMembership: true },
    { id: "o2", iconName: "Gift", title: "Bridal Membership", price: "₹9,999", desc: "Complete pre-bridal care package over 3 months", tag: "Festival Offer", tagColor: "bg-primary", isMembership: true },
    { id: "o3", iconName: "Percent", title: "First Visit Offer", price: "20% OFF", desc: "Flat 20% discount on your first appointment", tag: "New Clients", tagColor: "bg-accent", isMembership: true },
    { id: "o4", iconName: "Users", title: "Refer & Earn", price: "₹500 OFF", desc: "Get ₹500 off for every friend you refer", tag: "Always Active", tagColor: "bg-emerald-500", isMembership: true },
    { id: "o5", iconName: "Sparkles", title: "Summer Glow Package", price: "₹2,499", originalPrice: "₹3,500", desc: "Facial + Hair Spa + Manicure — Beat the heat with radiant skin & hair", tag: "Summer Special", tagColor: "bg-amber-500", isMembership: false },
    { id: "o6", iconName: "Heart", title: "Valentine's Duo", price: "₹3,999", originalPrice: "₹5,500", desc: "Couple makeover — Makeup + Hair styling for two", tag: "Limited Time", tagColor: "bg-rose-500", isMembership: false },
];

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [media, setMedia] = useState<MediaItem[]>(() => {
        const saved = localStorage.getItem("styloria-media");
        return saved ? JSON.parse(saved) : initialMedia;
    });

    const [categories, setCategories] = useState<ServiceCategory[]>(() => {
        const saved = localStorage.getItem("styloria-categories");
        return saved ? JSON.parse(saved) : initialCategories;
    });

    const [bookings, setBookings] = useState<Booking[]>(() => {
        const saved = localStorage.getItem("styloria-bookings");
        return saved ? JSON.parse(saved) : [];
    });

    const [offers, setOffers] = useState<Offer[]>(() => {
        const saved = localStorage.getItem("styloria-offers");
        return saved ? JSON.parse(saved) : initialOffers;
    });

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const saved = localStorage.getItem("styloria-current-user");
        return saved ? JSON.parse(saved) : null;
    });

    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem("styloria-users");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("styloria-media", JSON.stringify(media));
    }, [media]);

    useEffect(() => {
        localStorage.setItem("styloria-categories", JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem("styloria-bookings", JSON.stringify(bookings));
    }, [bookings]);

    useEffect(() => {
        localStorage.setItem("styloria-offers", JSON.stringify(offers));
    }, [offers]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("styloria-current-user", JSON.stringify(currentUser));
        } else {
            localStorage.removeItem("styloria-current-user");
        }
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem("styloria-users", JSON.stringify(users));
    }, [users]);

    const addMedia = (item: Omit<MediaItem, "id">) => {
        setMedia((prev) => [...prev, { ...item, id: Date.now().toString() }]);
    };

    const removeMedia = (id: string) => {
        setMedia((prev) => prev.filter((m) => m.id !== id));
    };

    const addService = (categoryId: string, service: Omit<Service, "id">) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.id === categoryId
                    ? { ...c, services: [...c.services, { ...service, id: Date.now().toString() }] }
                    : c
            )
        );
    };

    const removeService = (categoryId: string, serviceId: string) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.id === categoryId
                    ? { ...c, services: c.services.filter((s) => s.id !== serviceId) }
                    : c
            )
        );
    };

    const updateServicePrice = (categoryId: string, serviceId: string, newPrice: string) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.id === categoryId
                    ? {
                        ...c,
                        services: c.services.map((s) =>
                            s.id === serviceId ? { ...s, price: newPrice } : s
                        ),
                    }
                    : c
            )
        );
    };

    const updateServiceDetails = (categoryId: string, serviceId: string, name: string, price: string) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.id === categoryId
                    ? {
                        ...c,
                        services: c.services.map((s) =>
                            s.id === serviceId ? { ...s, name, price } : s
                        ),
                    }
                    : c
            )
        );
    };

    const addBooking = (booking: Omit<Booking, "id" | "status">) => {
        setBookings((prev) => [
            ...prev,
            { ...booking, id: Date.now().toString(), status: "Pending" },
        ]);
    };

    const updateBookingStatus = (id: string, status: Booking["status"]) => {
        setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status } : b))
        );
    };

    const updateBooking = (id: string, date: string, time: string) => {
        setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, date, time } : b))
        );
    };

    const addOffer = (offer: Omit<Offer, "id">) => {
        setOffers((prev) => [...prev, { ...offer, id: Date.now().toString() }]);
    };

    const removeOffer = (id: string) => {
        setOffers((prev) => prev.filter((o) => o.id !== id));
    };

    const updateOffer = (id: string, updatedFields: Partial<Offer>) => {
        setOffers((prev) =>
            prev.map((o) => (o.id === id ? { ...o, ...updatedFields } : o))
        );
    };

    const loginUser = (user: User) => {
        setCurrentUser(user);
        setUsers((prev) => {
            if (!prev.some((u) => u.email === user.email)) {
                return [...prev, user];
            }
            return prev;
        });
    };

    const logoutUser = () => setCurrentUser(null);

    const updateUser = (email: string, name: string, phone?: string) => {
        setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, name, phone } : u)));
        if (currentUser?.email === email) {
            setCurrentUser({ ...currentUser, name, phone });
        }
    };

    return (
        <StoreContext.Provider
            value={{
                media,
                addMedia,
                removeMedia,
                categories,
                addService,
                removeService,
                updateServicePrice,
                updateServiceDetails,
                bookings,
                addBooking,
                updateBookingStatus,
                updateBooking,
                offers,
                addOffer,
                removeOffer,
                updateOffer,
                currentUser,
                users,
                loginUser,
                logoutUser,
                updateUser,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error("useStore must be used within StoreProvider");
    return context;
};
