"use client";
import { useParams } from "next/navigation";
import { mockShelters } from "@/data/mockData";
import { ArrowLeft, Printer, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function getCityForShelter(city: string): string {
  if (city === "Gdańsk") return "Gmina Miasto Gdańsk";
  if (city === "Gdynia") return "Gmina Miasto Gdynia";
  if (city === "Sopot") return "Gmina Miasto Sopot";
  return `Gmina ${city}`;
}

function getContractAmount(shelterName: string, isPrimary: boolean): string {
  if (isPrimary) return "85 000,00";
  if (shelterName.toLowerCase().includes("toz") || shelterName.toLowerCase().includes("towarzystwo")) return "42 000,00";
  if (shelterName.toLowerCase().includes("fundacja")) return "38 000,00";
  return "31 500,00";
}

export default function UmowaPage() {
  const params = useParams();
  const id = params?.id as string;
  const shelter = mockShelters.find((s) => s.id === id);

  if (!shelter) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <FileText size={48} style={{ color: "var(--text-muted)" }} />
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Nie znaleziono dokumentu</p>
        <Link href="/" style={{ color: "var(--yellow)", textDecoration: "none", fontSize: "0.9rem" }}>
          ← Powrót do mapy
        </Link>
      </div>
    );
  }

  const city = shelter.address.city;
  const gmina = getCityForShelter(city);
  const contractAmount = getContractAmount(shelter.name, shelter.isPrimaryShelter);
  const contractNumber = `UM-${city.substring(0, 3).toUpperCase()}-${shelter.id.padStart(3, "0")}/2025`;
  const contractDate = "15 stycznia 2025 roku";
  const contractEnd = "31 grudnia 2026 roku";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-doc { box-shadow: none !important; margin: 0 !important; }
        }
        .umowa-section { margin-bottom: 28px; }
        .umowa-section h3 { font-size: 0.95rem; font-weight: 700; margin-bottom: 12px; color: #1a1a2e; border-bottom: 1px solid #ddd; padding-bottom: 6px; }
        .umowa-section p { font-size: 0.9rem; color: #2d2d2d; line-height: 1.75; margin-bottom: 8px; }
        .umowa-section ul { padding-left: 20px; }
        .umowa-section ul li { font-size: 0.9rem; color: #2d2d2d; line-height: 1.75; margin-bottom: 4px; }
      `}</style>

      {/* Top nav bar */}
      <div
        className="no-print"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text)",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} style={{ color: "var(--yellow)" }} />
          Powrót do mapy
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FileText size={16} style={{ color: "var(--yellow)" }} />
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Dokument umowy schroniska
          </span>
        </div>

        <button
          onClick={() => window.print()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--yellow)",
            color: "#000",
            border: "none",
            borderRadius: "10px",
            padding: "9px 18px",
            fontWeight: 700,
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          <Printer size={15} />
          Drukuj / Zapisz jako PDF
        </button>
      </div>

      {/* Document container */}
      <div style={{ padding: "32px 24px", maxWidth: "860px", margin: "0 auto" }}>

        {/* Status badge */}
        <div
          className="no-print"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: "12px",
            padding: "10px 16px",
            width: "fit-content",
          }}
        >
          <CheckCircle2 size={16} style={{ color: "#22c55e" }} />
          <span style={{ fontSize: "0.85rem", color: "#22c55e", fontWeight: 600 }}>
            Dokument zarchiwizowany · Nr {contractNumber}
          </span>
        </div>

        {/* The legal document */}
        <div
          className="print-doc"
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "56px 64px",
            boxShadow: "0 4px 40px rgba(0,0,0,0.15)",
            color: "#1a1a2e",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontSize: "0.75rem", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
              Dokument urzędowy
            </p>
            <h1 style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#1a1a2e",
              lineHeight: "1.4",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              marginBottom: "16px",
            }}>
              UMOWA O ŚWIADCZENIE USŁUG<br />W ZAKRESIE OPIEKI NAD BEZDOMNYMI ZWIERZĘTAMI
            </h1>
            <div style={{ width: "60px", height: "3px", background: "#1a1a2e", margin: "0 auto 20px" }} />
            <p style={{ fontSize: "0.875rem", color: "#444" }}>
              Numer umowy: <strong>{contractNumber}</strong>
            </p>
            <p style={{ fontSize: "0.875rem", color: "#444" }}>
              zawarta w {city} dnia <strong>{contractDate}</strong>
            </p>
          </div>

          {/* Parties */}
          <div className="umowa-section">
            <h3>STRONY UMOWY</h3>
            <p>
              <strong>Zamawiający:</strong><br />
              {gmina}, reprezentowana przez Prezydenta Miasta,<br />
              ul. Nowe Ogrody 8/12, {shelter.address.postalCode} {city},<br />
              NIP: 583-000-00-{shelter.id.padStart(2, "0")}, REGON: 1912{shelter.id.padStart(6, "0")},<br />
              zwana dalej <em>„Zamawiającym"</em>
            </p>
            <p style={{ marginTop: "16px" }}>
              <strong>Wykonawca:</strong><br />
              {shelter.name},<br />
              {shelter.address.street} {shelter.address.streetNumber}, {shelter.address.postalCode} {shelter.address.city},<br />
              {shelter.phone && <>Tel.: {shelter.phone}<br /></>}
              {shelter.email && <>E-mail: {shelter.email}<br /></>}
              zwany dalej <em>„Wykonawcą"</em>
            </p>
          </div>

          {/* §1 */}
          <div className="umowa-section">
            <h3>§ 1. Przedmiot umowy</h3>
            <p>
              1. Zamawiający zleca, a Wykonawca przyjmuje do realizacji świadczenie usług w zakresie opieki nad bezdomnymi zwierzętami z terenu {gmina}, w tym ich przyjmowania, utrzymania, leczenia oraz organizacji adopcji.
            </p>
            <p>
              2. Wykonawca zobowiązuje się do prowadzenia działalności schroniskowej zgodnie z obowiązującymi przepisami ustawy z dnia 21 sierpnia 1997 r. o ochronie zwierząt (Dz.U. z 2022 r. poz. 572 ze zm.) oraz aktami wykonawczymi.
            </p>
            <p>
              3. Wykonawca dysponuje obiektem przy {shelter.address.street} {shelter.address.streetNumber}, {shelter.address.postalCode} {shelter.address.city}, posiadającym {shelter.capacity ?? "N/A"} miejsc dla zwierząt.
            </p>
          </div>

          {/* §2 */}
          <div className="umowa-section">
            <h3>§ 2. Obowiązki schroniska</h3>
            <p>Wykonawca zobowiązuje się w szczególności do:</p>
            <ul>
              <li>przyjmowania bezdomnych zwierząt z terenu {city} przez całą dobę, 7 dni w tygodniu,</li>
              <li>zapewnienia zwierzętom odpowiedniej opieki weterynaryjnej, wyżywienia i warunków bytowych,</li>
              <li>prowadzenia ewidencji przyjmowanych i wydawanych zwierząt w systemie informatycznym,</li>
              <li>organizacji i realizacji procesu adopcji z przestrzeganiem procedury weryfikacji adoptujących,</li>
              <li>przeprowadzania obowiązkowych zabiegów sterylizacji i kastracji zwierząt,</li>
              <li>wykonywania szczepień profilaktycznych i czipowania każdego przyjętego zwierzęcia,</li>
              <li>prowadzenia programu wolontariackiego i współpracy z organizacjami pozarządowymi,</li>
              <li>udostępniania Zamawiającemu sprawozdań kwartalnych z działalności schroniska,</li>
              <li>umożliwienia Zamawiającemu przeprowadzenia kontroli w dowolnym terminie.</li>
            </ul>
          </div>

          {/* §3 */}
          <div className="umowa-section">
            <h3>§ 3. Wynagrodzenie</h3>
            <p>
              1. Za realizację przedmiotu umowy Zamawiający zobowiązuje się do zapłaty miesięcznego wynagrodzenia ryczałtowego w wysokości <strong>{contractAmount} zł brutto</strong> (słownie: {contractAmount.replace(",00", "")} złotych brutto).
            </p>
            <p>
              2. Wynagrodzenie płatne jest do 15. dnia każdego miesiąca na podstawie prawidłowo wystawionej faktury VAT, przelewem na rachunek bankowy Wykonawcy wskazany na fakturze.
            </p>
            <p>
              3. W przypadku opóźnienia w płatności Zamawiający zobowiązuje się do zapłaty odsetek ustawowych za opóźnienie.
            </p>
            <p>
              4. Wynagrodzenie może ulec zmianie w przypadku udokumentowanego wzrostu liczby przyjętych zwierząt powyżej 120% zakładanej normy miesięcznej, na podstawie aneksu do umowy.
            </p>
          </div>

          {/* §4 */}
          <div className="umowa-section">
            <h3>§ 4. Czas trwania umowy</h3>
            <p>
              1. Umowa zawarta jest na czas określony od dnia podpisania do <strong>{contractEnd}</strong>.
            </p>
            <p>
              2. Każda ze stron może wypowiedzieć umowę z zachowaniem 3-miesięcznego okresu wypowiedzenia, ze skutkiem na koniec miesiąca kalendarzowego.
            </p>
            <p>
              3. Zamawiający może rozwiązać umowę ze skutkiem natychmiastowym w przypadku rażącego naruszenia przez Wykonawcę przepisów o ochronie zwierząt lub warunków niniejszej umowy.
            </p>
          </div>

          {/* §5 */}
          <div className="umowa-section">
            <h3>§ 5. Postanowienia końcowe</h3>
            <p>
              1. Wszelkie zmiany niniejszej umowy wymagają formy pisemnej pod rygorem nieważności.
            </p>
            <p>
              2. W sprawach nieuregulowanych niniejszą umową stosuje się przepisy Kodeksu cywilnego oraz ustawy o ochronie zwierząt.
            </p>
            <p>
              3. Spory wynikłe z realizacji umowy strony będą rozstrzygać polubownie, a w przypadku braku porozumienia — przed sądem właściwym miejscowo dla siedziby Zamawiającego.
            </p>
            <p>
              4. Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze stron.
            </p>
          </div>

          {/* Signatures */}
          <div style={{ marginTop: "56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ borderTop: "1px solid #999", paddingTop: "12px" }}>
                <p style={{ fontSize: "0.8rem", color: "#444", fontWeight: 600 }}>ZAMAWIAJĄCY</p>
                <p style={{ fontSize: "0.8rem", color: "#444", marginTop: "4px" }}>{gmina}</p>
                <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "4px" }}>Prezydent Miasta</p>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ borderTop: "1px solid #999", paddingTop: "12px" }}>
                <p style={{ fontSize: "0.8rem", color: "#444", fontWeight: 600 }}>WYKONAWCA</p>
                <p style={{ fontSize: "0.8rem", color: "#444", marginTop: "4px" }}>{shelter.name}</p>
                <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "4px" }}>Dyrektor / Prezes</p>
              </div>
            </div>
          </div>

          {/* Footer stamp */}
          <div style={{ marginTop: "48px", paddingTop: "20px", borderTop: "1px solid #eee", textAlign: "center" }}>
            <p style={{ fontSize: "0.7rem", color: "#aaa", letterSpacing: "0.05em" }}>
              Dokument wygenerowany przez system Animal Helper · {contractNumber} · {city} {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Bottom print button */}
        <div className="no-print" style={{ display: "flex", justifyContent: "center", marginTop: "24px", gap: "12px" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "12px 24px",
              color: "var(--text)",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={15} />
            Powrót do mapy
          </Link>
          <button
            onClick={() => window.print()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--yellow)",
              color: "#000",
              border: "none",
              borderRadius: "12px",
              padding: "12px 24px",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            <Printer size={15} />
            Drukuj / Zapisz jako PDF
          </button>
        </div>
      </div>
    </div>
  );
}
