import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Calendar, Clock, User, CheckCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { bridalPackages } from "./BridalSection";

const beauticians = ["Any Available", "Pooja", "Sonali"];

const BookingSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { categories, addBooking, offers, currentUser, selectedServiceToBook, setSelectedServiceToBook } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [submittedPhone, setSubmittedPhone] = useState("");
  const allServices = categories.map((c) => c.services.map((s) => `${s.name} (${s.price})`)).flat();
  const allOffers = offers.filter(o => o.title !== "Bridal Membership").map((o) => `${o.title} (${o.price})`);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addBooking({
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      service: formData.get("service") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      beautician: formData.get("beautician") as string,
      email: currentUser?.email,
    });
    setSubmittedPhone(formData.get("phone") as string);
    setSubmitted(true);
  };

  return (
    <section id="booking" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="font-body font-medium text-primary tracking-widest uppercase text-base mb-3">Schedule Visit</p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Book Your <span className="text-gradient-primary italic">Appointment</span>
          </h2>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-12 text-center"
          >
            <CheckCircle size={64} className="text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-heading font-bold mb-3">Booking Confirmed!</h3>
            <p className="text-muted-foreground">
              We'll send you a confirmation via SMS & email shortly. See you at Styloria! 💕
            </p>
            <div className="mt-4 p-4 bg-secondary/50 rounded-xl text-sm">
              <p className="font-semibold text-foreground mb-1">Confirmation Details Sent To:</p>
              <p>Phone: {submittedPhone}</p>
              {currentUser?.email && <p>Email: {currentUser.email}</p>}
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedServiceToBook(null);
              }}
              className="mt-6 gradient-primary text-primary-foreground px-8 py-3 rounded-full font-semibold"
            >
              Book Another
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="glass-card rounded-3xl p-8 md:p-10 space-y-6"
          >
            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="name"
                    required
                    type="text"
                    defaultValue={currentUser?.name || ""}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Phone</label>
                <input
                  name="phone"
                  required
                  type="tel"
                  defaultValue={currentUser?.phone || ""}
                  placeholder="+91 90114 93241"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                />
              </div>
            </div>

            {/* Service */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Select Service</label>
              <select
                name="service"
                required
                value={selectedServiceToBook || ""}
                onChange={(e) => setSelectedServiceToBook(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all appearance-none"
              >
                <option value="">Choose a service</option>
                <optgroup label="Standard Services">
                  {allServices.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </optgroup>
                <optgroup label="Memberships & Offers">
                  {allOffers.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </optgroup>
                <optgroup label="Bridal Packages">
                  {bridalPackages.map((pkg) => (
                    <option key={pkg.name} value={`${pkg.name} (${pkg.price})`}>{pkg.name} - {pkg.price}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="date"
                    required
                    type="date"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Time</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="time"
                    required
                    type="time"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Beautician */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Choose Beautician</label>
              <select name="beautician" className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-primary/30 outline-none transition-all appearance-none">
                {beauticians.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full gradient-primary text-primary-foreground py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
            >
              Confirm Booking
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
};

export default BookingSection;
