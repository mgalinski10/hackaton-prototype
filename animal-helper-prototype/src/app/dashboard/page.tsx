"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { mockShelters } from "@/data/mockData";
import { InspectionTask, FlaggedReview } from "@/types";
import ReviewForm from "@/components/Review/ReviewForm";

// Local volunteer shift data (no longer in mockData)
const mockVolunteerShifts = [
  { id: "vs1", date: "2026-03-10", startHour: 9, endHour: 13, shelterName: "Schronisko Miejskie Gdańsk – ul. Przyrodnicza", task: "Spacery z psami i socjalizacja", status: "upcoming" as const },
  { id: "vs2", date: "2026-03-14", startHour: 14, endHour: 18, shelterName: "Schronisko Miejskie Gdynia – Małokacka", task: "Karmienie i czyszczenie boksów", status: "upcoming" as const },
  { id: "vs3", date: "2026-03-17", startHour: 10, endHour: 14, shelterName: "Schronisko Miejskie Gdańsk – ul. Przyrodnicza", task: "Asystowanie przy adopcjach", status: "upcoming" as const },
  { id: "vs4", date: "2026-02-24", startHour: 9, endHour: 13, shelterName: "TOZ – Gdańsk Oliwa", task: "Spacery i rehabilitacja psów", status: "completed" as const },
  { id: "vs5", date: "2026-02-17", startHour: 14, endHour: 17, shelterName: "Schronisko Miejskie Gdańsk – ul. Przyrodnicza", task: "Fotografowanie zwierząt do adopcji", status: "completed" as const },
  { id: "vs6", date: "2026-02-10", startHour: 9, endHour: 12, shelterName: "Schronisko Miejskie Gdynia – Małokacka", task: "Karmienie i monitoring kotów", status: "completed" as const },
  { id: "vs7", date: "2026-01-27", startHour: 10, endHour: 14, shelterName: "Schronisko Miejskie Gdańsk – ul. Przyrodnicza", task: "Spacery i socjalizacja", status: "completed" as const },
  { id: "vs8", date: "2026-01-13", startHour: 14, endHour: 18, shelterName: "Fundacja Cztery Łapy – Sopot", task: "Asystowanie przy zabiegach weterynaryjnych", status: "completed" as const },
];
import {
  PawPrint, ArrowLeft, Clock, Star, Heart, Calendar,
  TrendingUp, Award, CheckCircle2, MapPin, ChevronRight,
  AlertTriangle, TrendingDown, ClipboardCheck, Flag,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [inspectionTasks, setInspectionTasks] = useState<InspectionTask[]>([]);
  const [reviewTask, setReviewTask] = useState<InspectionTask | null>(null);
  const [myFlags, setMyFlags] = useState<FlaggedReview[]>([]);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/tasks`)
      .then((r) => r.json())
      .then((data: InspectionTask[]) => setInspectionTasks(data))
      .catch(() => {});
    fetch(`/api/flagged-reviews?flaggedBy=${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((data: FlaggedReview[]) => setMyFlags(data))
      .catch(() => {});
  }, [user]);

  const handleAcceptTask = async (taskId: string) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ACCEPTED" }),
    });
    if (res.ok) {
      const updated: InspectionTask = await res.json();
      setInspectionTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    }
  };

  const handleReviewSubmitted = () => {
    setReviewTask(null);
    if (user) {
      fetch(`/api/tasks`)
        .then((r) => r.json())
        .then((data: InspectionTask[]) => setInspectionTasks(data))
        .catch(() => {});
    }
  };

  if (!user) return null;

  const upcoming = mockVolunteerShifts.filter((s) => s.status === "upcoming");
  const completed = mockVolunteerShifts.filter((s) => s.status === "completed");
  const totalHours = completed.reduce((acc, s) => acc + (s.endHour - s.startHour), 0);
  const totalAnimalsHelped = mockShelters.reduce((acc, s) => acc + s.animalsAdoptedThisYear, 0);
  const uniqueShelters = new Set(mockVolunteerShifts.map((s) => s.shelterName)).size;

  const isVolunteer = user.role === "VOLUNTEER" || user.role === "ADMIN";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Top bar */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem" }}>
            <ArrowLeft size={16} /> Mapa
          </Link>
          <div style={{ width: "1px", height: "16px", background: "var(--border)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <PawPrint size={18} style={{ color: "var(--yellow)" }} />
            <span style={{ color: "var(--yellow)", fontWeight: 700 }}>Animal Helper</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--yellow)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#000", fontSize: "0.9rem" }}>
            {user.name[0]}{user.surname[0]}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)" }}>{user.name} {user.surname}</p>
            <p style={{ fontSize: "0.7rem", color: isVolunteer ? "#06B6D4" : "var(--text-muted)", fontWeight: 600 }}>
              {user.role === "ADMIN" ? "Administrator" : user.role === "VOLUNTEER" ? "Wolontariusz" : "Użytkownik"}
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 20px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontWeight: 800, fontSize: "1.8rem", color: "var(--text)", marginBottom: "6px" }}>
            Cześć, {user.name}! 👋
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            {isVolunteer
              ? "Twoje centrum wolontariatu. Sprawdź nadchodzące dyżury i swój wpływ."
              : "Zaaplikuj na wolontariusza, aby odblokować pełne możliwości."}
          </p>
        </div>

        {/* Inspection tasks */}
        {isVolunteer && inspectionTasks.filter((t) => t.status !== "COMPLETED").length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertTriangle size={18} style={{ color: "#ef4444" }} />
              Zlecone kontrole
              <span style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>
                {inspectionTasks.filter((t) => t.status !== "COMPLETED").length} aktywne
              </span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {inspectionTasks.filter((t) => t.status !== "COMPLETED").map((task) => {
                const isDrop = task.anomalyType === "SUDDEN_DROP";
                const accentColor = isDrop ? "#ef4444" : "#f59e0b";
                const accentBg = isDrop ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)";
                const accentBorder = isDrop ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)";
                const isPending = task.status === "PENDING_ACCEPT";

                return (
                  <div
                    key={task.id}
                    style={{ background: "var(--surface)", border: `1px solid ${accentBorder}`, borderRadius: "16px", padding: "16px 18px" }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: accentBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {isDrop ? <TrendingDown size={18} style={{ color: accentColor }} /> : <TrendingUp size={18} style={{ color: accentColor }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>{task.shelterName}</span>
                          <span style={{ background: accentBg, color: accentColor, fontSize: "0.62rem", fontWeight: 700, padding: "2px 7px", borderRadius: "20px" }}>
                            {isDrop ? "NAGŁY SPADEK" : "NAGŁY WZROST"}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                          Algorytm wykrył podejrzaną zmianę ocen: ★ {task.avgBefore} → <strong style={{ color: accentColor }}>★ {task.avgAfter}</strong>
                          {" · "}Wykryto {new Date(task.detectedAt).toLocaleDateString("pl-PL", { day: "numeric", month: "short" })}
                        </p>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {isPending ? (
                            <button
                              onClick={() => handleAcceptTask(task.id)}
                              style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.35)", borderRadius: "10px", padding: "7px 14px", color: "#06B6D4", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
                            >
                              <CheckCircle2 size={14} /> Przyjmij zlecenie
                            </button>
                          ) : (
                            <button
                              onClick={() => setReviewTask(task)}
                              style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(250,204,21,0.12)", border: "1px solid rgba(250,204,21,0.35)", borderRadius: "10px", padding: "7px 14px", color: "var(--yellow)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
                            >
                              <ClipboardCheck size={14} /> Przeprowadź kontrolę
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isVolunteer && (
          <div style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.25)", borderRadius: "16px", padding: "20px 24px", marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
            <div>
              <p style={{ fontWeight: 700, color: "#06B6D4", marginBottom: "4px", fontSize: "1rem" }}>Zostań wolontariuszem</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.5" }}>
                Zarejestruj się jako wolontariusz i zacznij pomagać zwierzętom w Trójmieście.
              </p>
            </div>
            <Link href="/volunteer-apply">
              <button style={{ background: "#06B6D4", color: "#000", border: "none", borderRadius: "12px", padding: "10px 20px", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", whiteSpace: "nowrap" }}>
                Aplikuj teraz
              </button>
            </Link>
          </div>
        )}

        {/* Stats grid */}
        {isVolunteer && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }}>
              {[
                { icon: <Clock size={20} style={{ color: "var(--yellow)" }} />, value: `${totalHours}h`, label: "Godzin wolontariatu", color: "var(--yellow)" },
                { icon: <PawPrint size={20} style={{ color: "#22c55e" }} />, value: totalAnimalsHelped, label: "Zwierząt pomogłeś", color: "#22c55e" },
                { icon: <MapPin size={20} style={{ color: "#06B6D4" }} />, value: uniqueShelters, label: "Schronisk odwiedzonych", color: "#06B6D4" },
                { icon: <Star size={20} style={{ color: "#f59e0b" }} />, value: completed.length, label: "Dyżurów zrealizowanych", color: "#f59e0b" },
              ].map((stat, i) => (
                <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
                  <div style={{ marginBottom: "10px" }}>{stat.icon}</div>
                  <p style={{ fontWeight: 800, fontSize: "1.6rem", color: stat.color, lineHeight: 1, marginBottom: "4px" }}>{stat.value}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "1.3" }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Achievement badge */}
            <div style={{ background: "linear-gradient(135deg, rgba(250,204,21,0.1), rgba(245,158,11,0.05))", border: "1px solid rgba(250,204,21,0.25)", borderRadius: "16px", padding: "16px 20px", marginBottom: "32px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(250,204,21,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Award size={24} style={{ color: "var(--yellow)" }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "var(--yellow)", marginBottom: "2px" }}>Odznaka: Stały Opiekun 🏅</p>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  Zrealizowałeś ponad {totalHours - 5}h wolontariatu. Następna odznaka za {Math.max(0, 30 - totalHours)}h: <strong style={{ color: "var(--text)" }}>Mistrz Wolontariatu</strong>
                </p>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>{totalHours}/30h</p>
                <div style={{ width: "80px", height: "6px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, (totalHours / 30) * 100)}%`, background: "var(--yellow)", borderRadius: "99px" }} />
                </div>
              </div>
            </div>
          </>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isVolunteer ? "1fr 1fr" : "1fr", gap: "20px" }}>
          {/* Upcoming shifts */}
          {isVolunteer && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "20px" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={18} style={{ color: "var(--yellow)" }} /> Nadchodzące dyżury
              </h2>
              {upcoming.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center", padding: "20px 0" }}>Brak zaplanowanych dyżurów</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {upcoming.map((shift) => (
                    <div key={shift.id} style={{ background: "var(--surface-2)", borderRadius: "12px", padding: "12px", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                        <p style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--text)", flex: 1, paddingRight: "8px" }}>{shift.shelterName}</p>
                        <span style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", flexShrink: 0 }}>
                          {new Date(shift.date).toLocaleDateString("pl-PL", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "4px" }}>{shift.task}</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={11} /> {shift.startHour}:00 – {shift.endHour}:00 ({shift.endHour - shift.startHour}h)
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Completed shifts history */}
          {isVolunteer && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "20px" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={18} style={{ color: "#22c55e" }} /> Historia dyżurów
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {completed.map((shift) => (
                  <div key={shift.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "var(--surface-2)", borderRadius: "10px" }}>
                    <CheckCircle2 size={14} style={{ color: "#22c55e", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {shift.task}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {new Date(shift.date).toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" })} · {shift.endHour - shift.startHour}h
                      </p>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", flexShrink: 0 }}>{shift.shelterName.split(" – ")[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Completed inspections history */}
        {isVolunteer && inspectionTasks.filter((t) => t.status === "COMPLETED").length > 0 && (
          <div style={{ marginTop: "20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "20px" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ClipboardCheck size={18} style={{ color: "#22c55e" }} /> Historia kontroli
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {inspectionTasks.filter((t) => t.status === "COMPLETED").map((task) => (
                <div key={task.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "var(--surface-2)", borderRadius: "10px" }}>
                  <CheckCircle2 size={14} style={{ color: "#22c55e", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.shelterName}</p>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      Kontrola {task.anomalyType === "SUDDEN_DROP" ? "spadku" : "wzrostu"} ocen · {task.completedAt ? new Date(task.completedAt).toLocaleDateString("pl-PL") : ""}
                    </p>
                  </div>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "2px 8px", borderRadius: "20px", flexShrink: 0 }}>UKOŃCZONA</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My flagged reviews */}
        {isVolunteer && myFlags.length > 0 && (
          <div style={{ marginTop: "20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "20px" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Flag size={18} style={{ color: "#a855f7" }} /> Moje zgłoszenia recenzji
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {myFlags.map((flag) => {
                const statusColor = flag.status === "PENDING" ? "#f59e0b" : flag.status === "HIDDEN" ? "#ef4444" : "#22c55e";
                const statusLabel = flag.status === "PENDING" ? "Oczekuje" : flag.status === "HIDDEN" ? "Recenzja ukryta" : "Odrzucono";
                return (
                  <div key={flag.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "var(--surface-2)", borderRadius: "10px" }}>
                    <Flag size={13} style={{ color: "#a855f7", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{flag.shelterName}</p>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {flag.reviewAuthorName} · ★{flag.reviewRating} · {new Date(flag.flaggedAt).toLocaleDateString("pl-PL")}
                      </p>
                    </div>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, background: `${statusColor}18`, color: statusColor, padding: "2px 8px", borderRadius: "20px", flexShrink: 0 }}>{statusLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: isVolunteer ? "1fr 1fr" : "1fr 1fr 1fr", gap: "12px" }}>
          {[
            { href: "/", label: "Mapa schronisk", desc: "Przeglądaj i oceniaj schroniska", icon: <MapPin size={20} style={{ color: "#06B6D4" }} />, color: "#06B6D4" },
            ...(!isVolunteer ? [{ href: "/volunteer-apply", label: "Aplikacja wolontariusza", desc: "Złóż lub uzupełnij wniosek", icon: <Heart size={20} style={{ color: "var(--yellow)" }} />, color: "var(--yellow)" }] : []),
            { href: "/", label: "Zwierzęta do adopcji", desc: "Przeglądaj zwierzęta na mapie", icon: <PawPrint size={20} style={{ color: "#22c55e" }} />, color: "#22c55e" },
          ].map((link) => (
            <Link key={link.href + link.label} href={link.href} style={{ textDecoration: "none" }}>
              <div
                style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = link.color)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <div style={{ marginBottom: "8px" }}>{link.icon}</div>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)", marginBottom: "3px" }}>{link.label}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Inspection review modal */}
      {reviewTask && (() => {
        const shelter = mockShelters.find((s) => s.id === reviewTask.shelterId);
        if (!shelter) return null;
        return (
          <ReviewForm
            shelter={shelter}
            taskId={reviewTask.id}
            onClose={() => setReviewTask(null)}
            onSubmitted={handleReviewSubmitted}
          />
        );
      })()}
    </div>
  );
}
