import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  Sparkles,
  Terminal,
  X,
  Youtube,
} from "lucide-react";
import { createRegistration } from "../services/registration";
import { AnimatePresence, motion } from "framer-motion";
import { Laptop } from "lucide-react";

type Course = {
  id: string;
  title: string;
  color: string;
  price: number;
  points: string[];
  syllabus: string[];
};

type Session = {
  id: string;
  title: string;
  courseId: string;
  dateText: string;
  timeText: string;
};

type FormMode = "course" | "session";

type FormState = {
  name: string;
  email: string;
  phone: string;
  education: string;
  address: string;
  courseId: string;
};

function RegistrationModal({
  open,
  onClose,
  mode: _mode,
  courses,
  defaultCourseId,
  heading,
  subHeading,
}: {
  open: boolean;
  onClose: () => void;
  mode: FormMode;
  courses: Course[];
  defaultCourseId: string;
  heading: string;
  subHeading?: string;
}) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    education: "",
    address: "",
    courseId: defaultCourseId,
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setForm((prev) => ({ ...prev, courseId: defaultCourseId }));
    }
  }, [open, defaultCourseId]);

  // 👇 ADD THIS RIGHT BELOW (DO NOT PUT ANYWHERE ELSE)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const formEl = e.currentTarget;
    if (!formEl.checkValidity()) {
      setFormError(true);
      formEl.reportValidity();
      setTimeout(() => setFormError(false), 400);
      return;
    }

    const registrationData = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      education: form.education.trim(),
      address: form.address.trim(),
      courseId: form.courseId,
      registrationDate: new Date().toISOString(),
    };

    try {
      setSubmitting(true);

      const saved = await createRegistration(registrationData);
      console.log("Saved in Firebase:", saved);      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error("API Error:", err);
      alert("Failed to submit. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCourse =
    courses.find((c) => c.id === form.courseId) ||
    courses.find((c) => c.id === defaultCourseId) ||
    courses[0];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header with color */}
            <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4 text-white">
              <div className="space-y-1">
    
                {/* Heading + FREE badge */}
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold">
                    {heading || "Enroll"}
                  </h3>

                  {_mode === "session" && (
                   <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-blue-600 shadow-sm">
  FREE
</span>
                  )}
                </div>

                {/* Subheading */}
                {subHeading && (
                  <p className="text-xs text-white/85">
                    {subHeading}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-white/10 p-1.5 text-white transition hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mx-4 mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Registration successful!
              </motion.div>
            )}

            <div className="flex-1 px-0 pb-4 pt-3 md:pb-5">
              <div className="flex h-full flex-col gap-4 px-4 md:flex-row md:gap-0">
                {/* Left: syllabus, scrollable */}
               { _mode === "course" && (
                <div className="md:w-1/2 md:border-r md:border-slate-100 md:pr-4 md:pl-1">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Course syllabus
                  </div>
                  {selectedCourse && (
                    <>
                      <div className="text-sm font-semibold text-slate-900">
                        {selectedCourse.title}
                      </div>
                      {/* <div className="mt-0.5 text-xs text-slate-600">
                        ₹{selectedCourse.price} · {selectedCourse.points[0]}
                      </div> */}
                      <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1 text-xs text-slate-700">
                        <ul className="space-y-2">
                          {selectedCourse.syllabus.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 leading-snug"
                            >
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
               ) } 

                {/* Right: form, kept fixed width */}
                <div className="mt-4 flex-1 md:mt-0 md:pl-4">
                  <form
                    onSubmit={handleSubmit}
                    className={formError ? "animate-shake" : ""}
                    noValidate
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-700">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            value={form.name}
                            onChange={onChange("name")}
                            required
                            placeholder="Your name"
                            className="input-field w-full"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-700">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            value={form.email}
                            onChange={onChange("email")}
                            type="email"
                            required
                            placeholder="you@email.com"
                            className="input-field w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-700">
                            Education <span className="text-red-500">*</span>
                          </label>
                          <input
                            value={form.education}
                            onChange={onChange("education")}
                            required
                            placeholder="e.g. BE / BCS / 12th"
                            className="input-field w-full"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-700">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <input
                            value={form.phone}
                            onChange={onChange("phone")}
                            inputMode="tel"
                            required
                            placeholder="10-digit number"
                            className="input-field w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Course
                        </label>
                        <div className="relative">
                          <select
                            value={form.courseId}
                            onChange={onChange("courseId")}
                            required
                            disabled
                            aria-readonly
                            className="input-field w-full cursor-not-allowed bg-slate-50 pr-9"
                          >
                            {courses
                              .filter((c) => c.id === form.courseId)
                              .map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.title}
                                </option>
                              ))}
                          </select>
                          <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.address}
                          onChange={onChange("address")}
                          required
                          placeholder="City, area"
                          className="input-field w-full"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary flex-1"
                      >
                        {submitting ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Submitting...
                          </span>
                        ) : (
                          <>
                            { _mode === "course" ? "Submit" : "Register"} {" "}
                            <ArrowRight className="ml-1 inline h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Dashboard() {
  const courses: Course[] = useMemo(
    () => [
      {
        id: "flutter",
        title: "Flutter Development",
        color: "from-blue-500 to-cyan-400",
        price: 3000,
        points: [
          "Mobile App Development",
          "Firebase Integration",
          "Backend-API integration",
          "3 Live Projects(GitHub)",
        ],
        syllabus: [
          "Dart basics & OOP",
          "Widgets: Stateless & Stateful",
          "Navigation & routing",
          "State management (Provider/Bloc)",
          "HTTP & REST API integration",
          "Firebase Auth & Firestore",
          "Local storage (SharedPreferences, SQLite)",
          "Live project: Build a full app",
          "Play Store deployment basics",
        ],
      },
      {
        id: "python",
        title: "Python Programming",
        color: "from-green-500 to-emerald-400",
        price: 3000,
        points: [
          "Basics of Python",
          "File Handling",
          "API development",
          "Python - Data Science",
        ],
        syllabus: [
          "Variables, data types, operators",
          "Control flow & loops",
          "Functions & modules",
          "Data structures: list, dict, set, tuple",
          "OOP: classes, inheritance",
          "File handling & exceptions",
          "Libraries: requests, pandas basics",
          "Projects & logic building",
          "Interview prep & problem solving",
        ],
      },
      {
        id: "c-programming",
        title: "C Programming",
        color: "from-orange-500 to-amber-400",
        price: 2000,
        points: [
          "C Basics & Core Concepts",
          "DSA Foundation",
          "Pointers & Memory Concepts",
          "2 Projects"
        ],
        syllabus: [
          "C basics: variables, operators, I/O",
          "Control structures & loops",
          "Functions & recursion",
          "Arrays & strings",
          "Pointers & memory concepts",
          "Structures & unions",
          "DSA foundation: arrays, linked list basics",
          "Problem solving & practice",
        ],
      },
    ],
    []
  );

  const freeCourses: Course[] = useMemo(
    () => [
      {
        id: "flutter",
        title: "Flutter Session",
        color: "from-blue-500 to-cyan-400",
        price: 3000,
        points: [
          "Introduction to Mobile Apps",
          "Firebase Introduction",
          "Dart Concepts"
        ],
        syllabus: [
          "Dart basics & OOP",
          "Widgets: Stateless & Stateful",
          "Navigation & routing",
          "State management (Provider/Bloc)",
          "HTTP & REST API integration",
          "Firebase Auth & Firestore",
          "Local storage (SharedPreferences, SQLite)",
          "Live project: Build a full app",
          "Play Store deployment basics",
        ],
      },
      {
        id: "python",
        title: "Python Programming",
        color: "from-green-500 to-emerald-400",
        price: 3000,
        points: [
          "Python basics",
          "Python libraries",
          "AI-ML Concepts"
        ],
        syllabus: [
          "Variables, data types, operators",
          "Control flow & loops",
          "Functions & modules",
          "Data structures: list, dict, set, tuple",
          "OOP: classes, inheritance",
          "File handling & exceptions",
          "Libraries: requests, pandas basics",
          "Projects & logic building",
          "Interview prep & problem solving",
        ],
      },
      {
        id: "c-programming",
        title: "C Programming",
        color: "from-orange-500 to-amber-400",
        price: 2000,
        points: [
          "C Basics",
          "Memory Management",
          "DSA"
        ],
        syllabus: [
          "C basics: variables, operators, I/O",
          "Control structures & loops",
          "Functions & recursion",
          "Arrays & strings",
          "Pointers & memory concepts",
          "Structures & unions",
          "DSA foundation: arrays, linked list basics",
          "Problem solving & practice",
        ],
      },
    ],
    []
  );

  const sessions: Session[] = useMemo(
    () => [
      {
        id: "free-flutter",
        title: "Flutter Session",
        courseId: "flutter",
        dateText: "15-02-2026",
        timeText: "10 Am to 11 Am",
      },
      {
        id: "free-python",
        title: "Python Session",
        courseId: "python",
        dateText: "15-02-2026",
        timeText: "10 Am to 11 Am",
      },
      {
        id: "free-c",
        title: "C Programming Session",
        courseId: "c-programming",
        dateText: "15-02-2026",
        timeText: "10 Am to 11 Am",
      },
    ],
    []
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("course");
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0].id);
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  // const [testimonialIndex, setTestimonialIndex] = useState(0);

  // const testimonials = useMemo(
  //   () => [
  //     {
  //       id: 1,
  //       name: "Akshay Patil",
  //       title: "Flutter Developer",
  //       quote:
  //         "The Programmers Academy helped me go from zero to publishing my first app on the Play Store.",
  //     },
  //     {
  //       id: 2,
  //       name: "Sneha Kulkarni",
  //       title: "Python & Data Enthusiast",
  //       quote:
  //         "The teaching style is very practical and project-focused. It boosted my confidence in coding interviews.",
  //     },
  //     {
  //       id: 3,
  //       name: "Rohit Deshmukh",
  //       title: "C Programming Student",
  //       quote:
  //         "DSA and pointers finally made sense. The small batch size and personal guidance really helped.",
  //     },
  //   ],
  //   []
  // );

  const openCourseForm = (course: Course) => {
    setMode("course");
    setSelectedCourseId(course.id);
    setHeading(course.title);
    setSubHeading(`Course Fees: ₹${course.price}`);
    setModalOpen(true);
  };

  const openSessionForm = (s: Session) => {
    const course = courses.find((c) => c.id === s.courseId);
    setMode("session");
    setSelectedCourseId(s.courseId);
    setHeading(s.title);
    setSubHeading(`${course?.title ?? ""} • ${s.dateText} • ${s.timeText}`);
    setModalOpen(true);
  };

  const handleExploreClick = () => {
    const el = document.getElementById("courses-section");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // const currentTestimonial = testimonials[testimonialIndex];

  // const goNextTestimonial = () => {
  //   setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  // };

  // const goPrevTestimonial = () => {
  //   setTestimonialIndex((prev) =>
  //     prev === 0 ? testimonials.length - 1 : prev - 1
  //   );
  // };

  return (
    <div className="flex flex-1 flex-col gap-10">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-glass relative overflow-hidden px-5 py-6 sm:px-8 sm:py-8"
      >
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-b from-blue-100/60 to-cyan-100/40 sm:block" />

        <div className="relative grid gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,0.85fr)] items-center">
          <div className="space-y-3 sm:space-y-4">
            {/* <div className="inline-flex items-center gap-2 rounded-full bg-blue-50/80 px-3 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Learn · Build · Grow</span>
            </div> */}

            <h1 className="bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl md:text-4xl">
              The Programmers Academy
            </h1>

            <p className="max-w-xl text-xs text-slate-600 sm:text-sm">
              आम्ही{" "}
              <span className="font-semibold text-blue-700">Programmers</span>{" "}
              घडवतो
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 sm:pt-2">
              <button onClick={handleExploreClick} className="btn-primary">
                <span className="inline-flex items-center gap-1.5">
                  Explore Courses
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>

              {/* <div className="flex items-center gap-2 text-[11px] text-slate-600 sm:text-xs">
                <div className="flex items-center -space-x-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-[10px] font-bold text-white shadow-md flex items-center justify-center">
                    A
                  </div>
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-[10px] font-bold text-white shadow-md flex items-center justify-center">
                    S
                  </div>
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-[10px] font-bold text-white shadow-md flex items-center justify-center">
                    R
                  </div>
                </div>
                <span>500+ students already learning with us</span>
              </div> */}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="card-glass relative hidden h-full min-h-[180px] items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 p-4 text-white shadow-2xl sm:flex"
          >
            <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-white/20 blur-xl" />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {/* Flutter pill */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Flutter</span>
                </div>

                {/* FREE pill */}
                <div className="inline-flex items-center rounded-full bg-emerald-400/20 px-3 py-1 text-[12px] font-semibold text-emerald-100">
                  FREE
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-blue-50/90">
                  Next Free Demo Session
                </p>
                <p className="text-sm font-semibold">
                  {sessions[0]?.title ?? "Programming Demo Session"}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-blue-50">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{sessions[0]?.dateText}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-blue-50">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{sessions[0]?.timeText}</span>
                </div>
              </div>

              <div className="flex items-center justify-center pt-2 min-h-[48px]">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-[11px] font-medium text-blue-50">
                  <Laptop className="h-4 w-4" />
                  <span>Mode: Online</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* STATS */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        {[
          { label: "Students Enrolled", value: "75+" },
          { label: "Courses Available", value: "3" },
          { label: "Placement Support", value: "Yes" },
        ].map((item) => (
          <motion.div
            key={item.label}
            whileHover={{ y: -4, scale: 1.01 }}
            className="card-glass flex flex-col items-center justify-center px-4 py-3 text-center"
          >
            <div className="text-sm font-extrabold text-blue-700 sm:text-base">
              {item.value}
            </div>
            <div className="mt-1 text-[11px] font-medium text-slate-600 sm:text-xs">
              {item.label}
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* COURSES: syllabus first, then enroll */}
      <section id="courses-section" className="space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl font-bold text-slate-800"
        >
          Courses
        </motion.h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => {
            const Icon =
              course.id === "flutter"
                ? Smartphone
                : course.id === "python"
                  ? Code2
                  : Terminal;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.06 }}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${course.color}`} />
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r ${course.color} text-white`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {course.title}
                        </h3>
                        <p className="text-sm font-medium text-slate-600">
                          ₹{course.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1 text-xs text-slate-600">
                    {course.points.slice(0, 4).map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        {p}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => openCourseForm(course)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
                  >
                    Enroll now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FREE DEMO SESSIONS: syllabus first, then register */}
      <section className="space-y-4">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl font-bold text-slate-800"
        >
          Free demo sessions
        </motion.h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((s, i) => {
            const course = freeCourses.find((c) => c.id === s.courseId);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.06 }}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div
                  className={`h-1.5 w-full bg-gradient-to-r ${course?.color ?? "from-blue-500 to-cyan-400"}`}
                />
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">{s.title}</h3>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      FREE
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {s.dateText}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {s.timeText}
                    </span>
                  </div>

                  {course && (
                    <ul className="mt-3 space-y-1 text-xs text-slate-600">
                      {course.points.slice(0, 3).map((p, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    type="button"
                    onClick={() => openSessionForm(s)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
                  >
                    Register for session
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      {/* <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="card-glass overflow-hidden px-5 py-5 sm:px-7 sm:py-6"
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h2 className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-lg font-extrabold text-transparent">
              ⭐ Student Stories
            </h2>
            <p className="mt-1 text-[11px] text-slate-600 sm:text-xs">
              Real feedback from learners at The Programmers Academy.
            </p>
          </div>

          <div className="hidden text-[11px] text-slate-500 sm:block">
            Swipe through to see more
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl bg-white/70 p-4 shadow-sm"
            >
              <p className="text-[11px] leading-relaxed text-slate-700 sm:text-sm">
                “{currentTestimonial.quote}”
              </p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-900 sm:text-sm">
                    {currentTestimonial.name}
                  </div>
                  <div className="text-[10px] text-slate-500 sm:text-[11px]">
                    {currentTestimonial.title}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={goPrevTestimonial}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={goNextTestimonial}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                  >
                    ›
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-3 flex justify-center gap-1.5">
            {testimonials.map((t, index) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTestimonialIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  testimonialIndex === index
                    ? "w-4 bg-blue-600"
                    : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.section> */}

      {/* CONTACT + SOCIAL */}
      <footer className="mt-auto">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="card-glass px-5 py-5 sm:px-7 sm:py-6"
        >
          <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                Contact Us
              </h2>
              <p className="mt-1 text-[11px] text-slate-600 sm:text-xs">
                Have questions about a course or batch schedule? Reach out any
                time.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 text-center shadow-sm"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 shadow-sm">
                <Phone className="h-4 w-4" />
              </span>
              <div className="text-[11px] font-semibold text-slate-500">
                Phone
              </div>
              <div className="text-sm font-bold text-slate-900">
                9878 881818
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 text-center shadow-sm"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 text-blue-700 shadow-sm">
                <Mail className="h-4 w-4" />
              </span>
              <div className="text-[11px] font-semibold text-slate-500">
                Email
              </div>
              <div className="text-[11px] font-bold text-slate-900 sm:text-xs break-all">
                theprogrammersacademy1@gmail.com
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 text-center shadow-sm"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 text-indigo-700 shadow-sm">
                <MapPin className="h-4 w-4" />
              </span>
              <div className="text-[11px] font-semibold text-slate-500">
                Location
              </div>
              <div className="text-sm font-bold text-slate-900">
                Pune, Maharashtra
              </div>
            </motion.div>
          </div>

          <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-3 text-center sm:flex-row">
            <div className="text-[10px] text-slate-500 sm:text-[11px]">
              © {new Date().getFullYear()} The Programmers Academy · All rights
              reserved.
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-600">
                Follow us
              </span>
              <div className="flex items-center gap-2">
                {[
                  { Icon: Instagram, label: "Instagram" },
                  { Icon: Linkedin, label: "LinkedIn" },
                  { Icon: Youtube, label: "YouTube" },
                ].map(({ Icon, label }) => (
                  <motion.button
                    key={label}
                    type="button"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-100"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <RegistrationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          mode={mode}
          courses={courses}
          defaultCourseId={selectedCourseId}
          heading={heading}
          subHeading={subHeading}
        />
      </footer>
    </div>
  );
}
