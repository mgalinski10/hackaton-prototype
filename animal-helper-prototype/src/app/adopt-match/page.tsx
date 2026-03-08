"use client";
import { useState } from "react";
import Link from "next/link";
import { mockAnimals, mockShelters } from "@/data/mockData";
import { Animal } from "@/types";
import { ArrowLeft, PawPrint, ArrowRight, Sparkles, Heart, MapPin, RefreshCw, CheckCircle2 } from "lucide-react";

type Answer = string | number;

interface Question {
  id: string;
  question: string;
  options: { value: Answer; label: string; emoji: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "living",
    question: "Gdzie mieszkasz?",
    options: [
      { value: "apartment_small", label: "Małe mieszkanie", emoji: "🏠" },
      { value: "apartment_big", label: "Duże mieszkanie", emoji: "🏢" },
      { value: "house", label: "Dom z ogrodem", emoji: "🏡" },
    ],
  },
  {
    id: "activity",
    question: "Jak aktywny tryb życia prowadzisz?",
    options: [
      { value: "low", label: "Spokojny, lubię relaks", emoji: "🛋️" },
      { value: "medium", label: "Umiarkowany", emoji: "🚶" },
      { value: "high", label: "Bardzo aktywny", emoji: "🏃" },
    ],
  },
  {
    id: "time",
    question: "Ile czasu dziennie możesz poświęcić zwierzęciu?",
    options: [
      { value: "low", label: "Mniej niż 1h", emoji: "⏱️" },
      { value: "medium", label: "1–3 godziny", emoji: "🕐" },
      { value: "high", label: "Ponad 3 godziny", emoji: "🕒" },
    ],
  },
  {
    id: "experience",
    question: "Masz doświadczenie ze zwierzętami?",
    options: [
      { value: "none", label: "Brak doświadczenia", emoji: "🌱" },
      { value: "some", label: "Miałem/am wcześniej", emoji: "🐾" },
      { value: "expert", label: "Doświadczony opiekun", emoji: "⭐" },
    ],
  },
  {
    id: "children",
    question: "Czy masz dzieci w domu?",
    options: [
      { value: "yes_small", label: "Tak, małe dzieci", emoji: "👶" },
      { value: "yes_older", label: "Tak, starsze dzieci", emoji: "👧" },
      { value: "no", label: "Nie", emoji: "🧑" },
    ],
  },
  {
    id: "preference",
    question: "Jaki rodzaj zwierzęcia preferujesz?",
    options: [
      { value: "dog", label: "Pies", emoji: "🐕" },
      { value: "cat", label: "Kot", emoji: "🐈" },
      { value: "any", label: "Obojętne", emoji: "❤️" },
    ],
  },
];

function matchAnimals(answers: Record<string, Answer>): Animal[] {
  const available = mockAnimals.filter((a) => a.status === "available");

  const scored = available.map((animal) => {
    let score = 0;

    // Species preference
    if (answers.preference === animal.species) score += 30;
    if (answers.preference === "any") score += 15;

    // Living situation
    if (answers.living === "apartment_small") {
      if (animal.species === "cat") score += 20;
      if (animal.species === "dog" && animal.age > 24) score += 10; // older dogs ok
      if (animal.species === "dog" && animal.breed.includes("Jack Russell")) score += 5;
    } else if (answers.living === "apartment_big") {
      score += 15;
    } else if (answers.living === "house") {
      if (animal.species === "dog" && animal.age < 36) score += 20;
      else score += 10;
    }

    // Activity level
    if (answers.activity === "low") {
      if (animal.species === "cat") score += 20;
      if (animal.age > 48) score += 15;
    } else if (answers.activity === "medium") {
      score += 10;
    } else if (answers.activity === "high") {
      if (animal.species === "dog" && animal.age < 36) score += 20;
    }

    // Time
    if (answers.time === "low") {
      if (animal.species === "cat") score += 15;
    } else if (answers.time === "high") {
      if (animal.species === "dog") score += 10;
    }

    // Experience
    if (answers.experience === "none") {
      if (animal.age > 24 && animal.sterilized) score += 10;
    } else if (answers.experience === "expert") {
      score += 5; // Can handle any
    }

    // Children
    if (answers.children === "yes_small") {
      if (animal.species === "dog" && animal.breed.toLowerCase().includes("labrador")) score += 15;
      if (animal.species === "dog" && animal.breed.toLowerCase().includes("golden")) score += 15;
      if (animal.age > 12 && animal.sterilized) score += 10;
    } else if (answers.children === "yes_older") {
      score += 8;
    }

    return { animal, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.animal);
}

export default function AdoptMatchPage() {
  const [step, setStep] = useState(0); // 0 = intro, 1-6 = questions, 7 = results
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [results, setResults] = useState<Animal[]>([]);
  const [adoptSent, setAdoptSent] = useState<string | null>(null);
  const [adoptLoading, setAdoptLoading] = useState(false);

  const currentQ = QUESTIONS[step - 1];
  const progress = step === 0 ? 0 : Math.round((step / QUESTIONS.length) * 100);

  const handleAnswer = (value: Answer) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    if (step < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setResults(matchAnimals(newAnswers));
      setStep(QUESTIONS.length + 1);
    }
  };

  const handleAdopt = async (animalId: string) => {
    setAdoptLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setAdoptLoading(false);
    setAdoptSent(animalId);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResults([]);
    setAdoptSent(null);
  };

  const getShelterName = (shelterId: string) => mockShelters.find((s) => s.id === shelterId)?.name ?? "";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Top bar */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "14px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem" }}>
          <ArrowLeft size={16} /> Mapa
        </Link>
        <div style={{ width: "1px", height: "16px", background: "var(--border)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <PawPrint size={18} style={{ color: "var(--yellow)" }} />
          <span style={{ color: "var(--yellow)", fontWeight: 700 }}>Animal Helper</span>
        </div>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>· Dopasowanie AI</span>
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}>

        {/* INTRO */}
        {step === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(250,204,21,0.2), rgba(6,182,212,0.15))", border: "2px solid rgba(250,204,21,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Sparkles size={36} style={{ color: "var(--yellow)" }} />
            </div>
            <h1 style={{ fontWeight: 800, fontSize: "2rem", color: "var(--text)", marginBottom: "12px" }}>
              Znajdź idealne zwierzę
            </h1>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.7", marginBottom: "8px", fontSize: "1rem" }}>
              Odpowiedz na kilka pytań, a nasz algorytm AI dopasuje do Ciebie zwierzęta ze schronisk Trójmiasta.
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "36px" }}>
              {QUESTIONS.length} pytań · ~2 minuty
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "36px" }}>
              {[
                { icon: "🐕", label: "Psy", count: mockAnimals.filter(a => a.species === "dog" && a.status === "available").length },
                { icon: "🐈", label: "Koty", count: mockAnimals.filter(a => a.species === "cat" && a.status === "available").length },
                { icon: "🏠", label: "Schronisk", count: new Set(mockAnimals.map(a => a.shelterId)).size },
              ].map((item) => (
                <div key={item.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", textAlign: "center" }}>
                  <p style={{ fontSize: "1.8rem", marginBottom: "4px" }}>{item.icon}</p>
                  <p style={{ fontWeight: 800, fontSize: "1.4rem", color: "var(--yellow)" }}>{item.count}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              style={{ background: "var(--yellow)", color: "#000", border: "none", borderRadius: "16px", padding: "14px 40px", fontWeight: 700, fontSize: "1.05rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px" }}
            >
              Zacznij dopasowanie <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* QUESTIONS */}
        {step >= 1 && step <= QUESTIONS.length && (
          <div>
            {/* Progress */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Pytanie {step} z {QUESTIONS.length}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--yellow)", fontWeight: 600 }}>{progress}%</span>
              </div>
              <div style={{ height: "6px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, var(--yellow), #06B6D4)", borderRadius: "99px", transition: "width 0.4s ease" }} />
              </div>
            </div>

            <h2 style={{ fontWeight: 800, fontSize: "1.4rem", color: "var(--text)", marginBottom: "28px", lineHeight: "1.3" }}>
              {currentQ.question}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {currentQ.options.map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() => handleAnswer(opt.value)}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "16px 20px",
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "16px", cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--yellow)"; e.currentTarget.style.background = "rgba(250,204,21,0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface)"; }}
                >
                  <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>{opt.emoji}</span>
                  <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text)" }}>{opt.label}</span>
                  <ArrowRight size={16} style={{ color: "var(--text-muted)", marginLeft: "auto" }} />
                </button>
              ))}
            </div>

            {step > 1 && (
              <button onClick={() => setStep(step - 1)} style={{ marginTop: "20px", background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                <ArrowLeft size={14} /> Wróć
              </button>
            )}
          </div>
        )}

        {/* RESULTS */}
        {step === QUESTIONS.length + 1 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(250,204,21,0.12)", border: "2px solid rgba(250,204,21,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Sparkles size={28} style={{ color: "var(--yellow)" }} />
              </div>
              <h2 style={{ fontWeight: 800, fontSize: "1.6rem", color: "var(--text)", marginBottom: "8px" }}>
                Twoje dopasowania! 🎉
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Na podstawie Twoich odpowiedzi wybraliśmy {results.length} zwierząt idealnych dla Ciebie.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
              {results.map((animal, idx) => {
                const shelterName = getShelterName(animal.shelterId);
                const isAdopted = adoptSent === animal.id;
                return (
                  <div
                    key={animal.id}
                    style={{
                      background: "var(--surface)", border: idx === 0 ? "1px solid rgba(250,204,21,0.4)" : "1px solid var(--border)",
                      borderRadius: "20px", overflow: "hidden",
                    }}
                  >
                    {idx === 0 && (
                      <div style={{ background: "rgba(250,204,21,0.1)", padding: "6px 16px", fontSize: "0.75rem", fontWeight: 700, color: "var(--yellow)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Sparkles size={12} /> NAJLEPSZE DOPASOWANIE
                      </div>
                    )}
                    <div style={{ display: "flex", gap: "14px", padding: "16px" }}>
                      <img src={animal.imageUrl} alt={animal.name} style={{ width: "90px", height: "90px", borderRadius: "14px", objectFit: "cover", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                          <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text)" }}>{animal.name}</h3>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", flexShrink: 0, marginLeft: "8px" }}>
                            {animal.species === "dog" ? "🐕 Pies" : "🐈 Kot"}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>{animal.breed}</p>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {animal.description}
                        </p>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", marginBottom: "10px" }}>
                          <MapPin size={11} /> {shelterName}
                        </p>
                        {isAdopted ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#22c55e", fontSize: "0.82rem", fontWeight: 600 }}>
                            <CheckCircle2 size={15} /> Wniosek wysłany!
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAdopt(animal.id)}
                            disabled={adoptLoading}
                            style={{ display: "flex", alignItems: "center", gap: "6px", background: idx === 0 ? "var(--yellow)" : "var(--surface-2)", color: idx === 0 ? "#000" : "var(--text)", border: `1px solid ${idx === 0 ? "var(--yellow)" : "var(--border)"}`, borderRadius: "10px", padding: "7px 14px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
                          >
                            {adoptLoading ? <div style={{ width: "12px", height: "12px", border: "2px solid currentColor", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : <Heart size={13} />}
                            Wyślij wniosek
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={reset}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "12px", color: "var(--text)", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}
              >
                <RefreshCw size={15} /> Zacznij od nowa
              </button>
              <Link href="/" style={{ flex: 1, textDecoration: "none" }}>
                <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--yellow)", border: "none", borderRadius: "14px", padding: "12px", color: "#000", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
                  <MapPin size={15} /> Znajdź na mapie
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
