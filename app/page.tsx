import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100dvh",
        width: "100%",
        background: "#111111",
        overflow: "hidden",
        padding: "0 24px",
        boxSizing: "border-box",
      }}
    >
      {/* Logo */}
      <Image
        src="/White No BG.png"
        alt="Even Par Mine Logo"
        width={200}
        height={200}
        style={{ objectFit: "contain", marginBottom: "32px" }}
        priority
      />

      {/* Title */}
      <h1
        style={{
          color: "#ffffff",
          fontSize: "1.15rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: "6px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        Mine Safety and Health Administration
      </h1>

      <p
        style={{
          color: "#666666",
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: "48px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        Even Par Mine · ID# 38-00774
      </p>

      {/* CTA Links */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
          maxWidth: "320px",
        }}
      >
        <Link
          href="/form/pre-shift"
          style={{
            display: "block",
            width: "100%",
            background: "#ffffff",
            color: "#111111",
            textAlign: "center",
            padding: "14px 0",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          Pre-Shift Inspection
        </Link>
        
        <Link
          href="/form/workplace-exam"
          style={{
            display: "block",
            width: "100%",
            background: "transparent",
            color: "#ffffff",
            border: "2px solid #ffffff",
            textAlign: "center",
            padding: "12px 0",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          Workplace Exam
        </Link>

        <Link
          href="/form/task-training"
          style={{
            display: "block",
            width: "100%",
            background: "transparent",
            color: "#ffffff",
            border: "2px solid #ffffff",
            textAlign: "center",
            padding: "12px 0",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          Task Training Record
        </Link>

        <Link
          href="/form/safety-meeting"
          style={{
            display: "block",
            width: "100%",
            background: "transparent",
            color: "#ffffff",
            border: "2px solid #ffffff",
            textAlign: "center",
            padding: "12px 0",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          Safety Meeting
        </Link>

        <Link
          href="/form/near-miss"
          style={{
            display: "block",
            width: "100%",
            background: "transparent",
            color: "#ffffff",
            border: "2px solid #ffffff",
            textAlign: "center",
            padding: "12px 0",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          Near Miss Entry
        </Link>
      </div>

    </main>
  );
}
