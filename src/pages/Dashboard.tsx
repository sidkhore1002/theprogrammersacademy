import React, { useEffect, useMemo, useState } from "react";
import { Code2, Calendar, Phone, Mail, X } from "lucide-react";
import { createRegistration } from "../services/registration";
import { motion } from "framer-motion";

type Course = {
  id: string;
  title: string;
  color: string;
  price: number;
  points: string[]; // max 4
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
  mode,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // ✅ Keep payload minimal (matches most backend service types)
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
      console.log("Saved:", saved);

      alert("Registration saved successfully!");
      onClose();
    } catch (err) {
      console.error("API Error:", err);
      alert("Failed to submit. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3">
      {/* <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
      /> */}

      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-lg h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col">
        <div className="relative border-b bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4">
          <h3 className="text-lg font-bold text-white">
            {heading || "Registration Form"}
          </h3>

          {subHeading ? (
            <p className="mt-1 text-xs font-semibold text-white/90">
              {subHeading}
            </p>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">

        <form onSubmit={handleSubmit} className="space-y-3 p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={onChange("name")}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                value={form.email}
                onChange={onChange("email")}
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">
                Education <span className="text-red-500">*</span>
              </label>
              <input
                value={form.education}
                onChange={onChange("education")}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="BE / BCS / 12th"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                value={form.phone}
                onChange={onChange("phone")}
                inputMode="tel"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="10-digit phone"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              value={form.courseId}
              onChange={onChange("courseId")}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              value={form.address}
              onChange={onChange("address")}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="City, area"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
        </div>

        {/* (Optional) Debug info, remove later */}
        <div className="px-5 pb-4 text-[10px] text-gray-400">
          <div>Mode: {mode}</div>
        </div>
      </div>
    </div>
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
          "Mobile Apps",
          "Firebase + API Basics",
          "Live Project Practice",
          "Play Store Deployment Basics",
        ],
      },
      {
        id: "python",
        title: "Python Programming",
        color: "from-green-500 to-emerald-400",
        price: 3000,
        points: [
          "Basic to Advanced",
          "Projects + Logic Building",
          "Interview Preparation",
          "Real-world Problem Solving",
        ],
      },
      {
        id: "c-programming",
        title: "C Programming",
        color: "from-orange-500 to-amber-400",
        price: 2000,
        points: [
          "C Basics",
          "DSA Foundation",
          "Problem Solving Skills",
          "Pointers & Memory Concepts",
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

  return (
    // <div className="min-h-dvh">

    <div className="h-screen flex flex-col bg-gradient-to-b from-blue-50/50 via-white to-white">
        <header className="shrink-0 px-3 pt-2 pb-2 text-center sm:px-6">
          <h1 className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
            The Programmers Academy
          </h1>

          <p className="mt-0.5 text-xs font-semibold text-gray-700">
            आम्ही{"  "}
            <span className="font-extrabold text-blue-600 text-base sm:text-sm">
              Programmers
            </span>{"  "}
            घडवतो...
          </p>
        </header>

{/* <div className="h-screen flex flex-col bg-gradient-to-b from-blue-50/60 via-white to-white">
  <header
    className="shrink-0 px-4 pt-3 pb-3 sm:px-6 text-center
               bg-white/40 backdrop-blur-xl border-b border-white/50"
  >
    <h1
      className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700
                 bg-clip-text text-2xl sm:text-3xl font-extrabold
                 tracking-tight text-transparent"
    >
      The Programmers Academy
    </h1>

    <p className="mt-1 text-xs sm:text-sm font-medium text-gray-700">
      आम्ही{" "}
      <span className="font-extrabold text-blue-600">
        Programmers
      </span>{" "}
      घडवतो...
    </p>
  </header> */}

<main className="flex-1 px-3 py-3 sm:px-6 overflow-y-auto bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
  <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-20">

    {/* ================= COURSES ================= */}
    <motion.section
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-2 rounded-3xl border border-white/40
                 bg-white/40 backdrop-blur-xl shadow-xl p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          🎓 Courses
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((course, i) => (
          <motion.button
            key={course.id}
            onClick={() => openCourseForm(course)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-3xl
                       bg-white/60 backdrop-blur-xl p-4 text-left
                       border border-white/50 shadow-lg"
          >
            {/* Gradient top bar */}
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${course.color}`} />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 font-bold text-gray-900">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl
                                 bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700">
                  <Code2 className="h-4 w-4" />
                </span>
                <span className="text-sm leading-tight">
                  {course.title}
                </span>
              </div>

              <span className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500
                               px-3 py-1 text-xs font-bold text-white shadow">
                ₹{course.price}
              </span>
            </div>

            <ul className="mt-3 space-y-1 text-[11px] text-gray-700">
              {course.points.slice(0, 4).map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-center">
              <span className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500
                               px-4 py-1.5 text-[11px] font-bold text-white
                               shadow-md group-hover:shadow-lg">
                Enroll Now →
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.section>

    {/* ================= FREE SESSIONS ================= */}
    <motion.section
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-white/40
                 bg-white/40 backdrop-blur-xl shadow-xl p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          🗓 Free Sessions
        </h2>
      </div>

      <div className="space-y-4">
        {sessions.map((s, i) => {
          const course = courses.find((c) => c.id === s.courseId);

          return (
            <motion.button
              key={s.id}
              onClick={() => openSessionForm(s)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              className="group relative w-full overflow-hidden rounded-3xl
                         bg-white/60 backdrop-blur-xl p-4 text-left
                         border border-white/50 shadow-lg"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                  course?.color ?? "from-blue-600 to-cyan-500"
                }`}
              />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 font-bold text-gray-900">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl
                                   bg-gradient-to-br from-cyan-100 to-blue-100 text-blue-700">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <span className="text-sm leading-tight">{s.title}</span>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  FREE
                </span>
              </div>

              <div className="mt-3 space-y-1 text-[11px] font-bold text-gray-700">
                <div>Date : {s.dateText}</div>

                <div className="flex items-center justify-between pt-1">
                  <span>Time : {s.timeText}</span>
                  <span className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500
                                   px-4 py-1 text-[11px] font-bold text-white shadow">
                    Register →
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.section>

  </div>
</main>


        {/* FOOTER */}
        <footer className="shrink-0 border-t border-gray-300 bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-3 sm:px-6">
            {/* <div className="h-1 w-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 opacity-90" /> */}

            <div className="flex flex-col items-center text-center pt-1 sm:pt-1 pb-2 sm:pb-3">
              <div className="text-base sm:text-xl font-extrabold text-gray-900 tracking-wide">
                Contact Us
              </div>

              {/* <div className="mt-2 h-[2px] w-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" /> */}

              <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 sm:h-7 sm:w-7 items-center justify-center rounded-lg sm:rounded-xl bg-blue-50 ring-1 ring-blue-100">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </span>
                  <span className="text-sm sm:text-sm font-bold text-gray-900 tracking-wide">
                    9878 881818
                  </span>
                </div>

                {/* <div className="hidden sm:block h-8 w-px bg-gray-300" /> */}

                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-50 ring-1 ring-cyan-100">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </span>
                  <span className="text-base sm:text-sm font-bold text-gray-900 break-all">
                    theprogrammersacademy1@gmail.com
                  </span>
                </div>
              </div>

              {/* <div className="mt-4 text-[11px] sm:text-xs font-semibold text-gray-500">
                © {new Date().getFullYear()} The Programmers Academy • All Rights
                Reserved
              </div> */}
            </div>
          </div>
        </footer>

        <RegistrationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          mode={mode}
          courses={courses}
          defaultCourseId={selectedCourseId}
          heading={heading}
          subHeading={subHeading}
        />
      </div>
    //</div>
  );
}
