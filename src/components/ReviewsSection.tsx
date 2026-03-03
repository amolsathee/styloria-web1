import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Priya Sharma",
    text: "Absolutely loved my bridal makeup! The team at Styloria made me feel like a queen on my special day. Highly recommend their platinum package.",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    text: "Best hair spa experience ever! My hair has never felt so silky and healthy. The ambiance is so luxurious and calming.",
    rating: 5,
  },
  {
    name: "Meera Kulkarni",
    text: "The hydra facial treatment was incredible. My skin was glowing for weeks! The staff is so professional and friendly.",
    rating: 5,
  },
  {
    name: "Sneha Deshmukh",
    text: "I'm a regular for their nail art services. Always creative, clean, and on-trend designs. Love this place!",
    rating: 5,
  },
];

const ReviewsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-secondary/30" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-body font-medium text-primary tracking-widest uppercase text-base mb-3">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            What Our <span className="text-gradient-primary italic">Clients Say</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="glass-card rounded-2xl p-8 relative"
            >
              <Quote size={32} className="text-primary/20 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={16} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed italic">"{review.text}"</p>
              <p className="font-heading font-semibold">{review.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
