"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_EXAM_ROWS, ExamRow, ExamOption, OPTION_COLORS } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function WorkplaceExamForm() {
  const [supervisorName, setSupervisorName] = useState("");
  const [expectedDateCorrection, setExpectedDateCorrection] = useState("");
  const [rows, setRows] = useState<ExamRow[]>(INITIAL_EXAM_ROWS);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  function setRowValue(id: string, value: ExamOption) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, value } : r))
    );
  }

  function setRowComments(id: string, comments: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, comments } : r))
    );
  }

  function setRowMitigation(id: string, mitigation: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, mitigation } : r))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitMessage(null);
    setLoading(true);

    // 1. Basic validation: Supervisor Name
    if (!supervisorName.trim()) {
      setSubmitMessage("Please fill required field: Supervisor Name");
      setLoading(false);
      return;
    }

    // 2. Validation: All 9 checklist items must have OK or Not OK selected
    const unselected = rows.filter((r) => !r.value);
    if (unselected.length > 0) {
      setSubmitMessage(
        `Please select OK or Not OK for all checklist items. (Missing: ${unselected
          .map((r) => r.label.replace(":", ""))
          .join(", ")})`
      );
      setLoading(false);
      return;
    }

    // 3. Validation: If any item is "Not OK", mitigation must be filled.
    // Also, "Mitigation D:" (Drainage) has an asterisk, but we make it required specifically if Drainage is Not OK.
    const missingMitigation = rows.filter((r) => r.value === "Not OK" && !r.mitigation.trim());
    if (missingMitigation.length > 0) {
      setSubmitMessage(
        `Please describe the actions taken/to be taken (Mitigation) for items marked "Not OK": ${missingMitigation
          .map((r) => r.label.replace(":", ""))
          .join(", ")}`
      );
      setLoading(false);
      return;
    }

    try {
      setSubmitMessage("Submitting Workplace Exam...");

      // Prepare payload to match columns of sheet exactly
      const payload: Record<string, any> = {
        "Timestamp": new Date().toLocaleString("en-US", {
          timeZone: "America/New_York",
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false,
        }).replace(",", ""),
        "Supervisor Name:": supervisorName,
        "Expected Date Correction:": expectedDateCorrection || "",
      };

      // Fill in all checklist values, comments, and mitigations
      rows.forEach((r) => {
        payload[r.label] = r.value;
        payload[r.commentsLabel] = r.comments || "";
        payload[r.mitigationLabel] = r.mitigation || "";
      });

      const res = await fetch(`${API_URL}/api/workplace-exam`, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ task: "init", data: payload }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Submission failed");
      }

      setSubmitMessage("Workplace Exam submitted ✓");
      setLoading(false);
      setShowThankYou(true);
    } catch (err: any) {
      setSubmitMessage(`Error: ${err.message || err}`);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 text-slate-800 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-6"></div>
          <span className="text-lg text-slate-800 font-medium">Submitting...</span>
        </div>
      )}

      {/* Thank You Screen */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank you!</h2>
          <p className="text-slate-600 text-center mb-6">
            Your Workplace Exam has been submitted successfully.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={() => {
                setSupervisorName("");
                setExpectedDateCorrection("");
                setRows(INITIAL_EXAM_ROWS);
                setShowThankYou(false);
              }}
              className="w-full bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow hover:bg-slate-700 transition"
            >
              Submit Another Exam
            </button>
            <Link
              href="/"
              className="w-full text-center bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              ← Main Menu
            </Link>
          </div>
        </div>
      )}

      {/* Main Form */}
      {!showThankYou && (
        <div className="bg-white rounded-2xl shadow-md p-4">
          <header className="mb-6 border-b border-slate-100 pb-5">
            <Link href="/" className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 mb-3 transition">
              ← Main Menu
            </Link>
            <div className="bg-slate-900 text-white rounded-xl p-4 text-center mb-4">
              <h1 className="text-xl font-bold tracking-wider font-sans uppercase">
                EPM Workplace Exam
              </h1>
              <p className="text-xs text-slate-400 tracking-widest uppercase mt-1">
                Even Par Mine ID# 38-00774
              </p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed text-center mb-4">
              Complete this form at the beginning of each workday to document all Workplace Exams for Main Office documentation and MSHA recordkeeping requirements.
            </p>

            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>
                Support: <a href="tel:8033007596" className="text-slate-600 hover:text-slate-800 underline font-medium">Klayton (803-300-7596)</a>
              </span>
              <span>
                <span className="text-red-500">*</span> Required field
              </span>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Info */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                  Supervisor Name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  placeholder="Enter name"
                  required
                />
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-slate-900 border-b pb-2 uppercase tracking-wide">
                Workplace Checklist
              </h2>

              <div className="space-y-4">
                {rows.map((r) => (
                  <div key={r.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-semibold text-slate-800">
                        {r.label.replace(":", "")} <span className="text-red-500">*</span>
                      </div>

                      {/* OK / Not OK toggle buttons */}
                      <div className="flex gap-1.5">
                        {(["OK", "Not OK"] as ExamOption[]).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setRowValue(r.id, opt)}
                            className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                              r.value === opt
                                ? OPTION_COLORS[opt]
                                : "bg-white text-slate-700 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comments block */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">
                        {r.commentsLabel.replace(":", "")}
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs focus:border-slate-400 focus:outline-none"
                        value={r.comments}
                        onChange={(e) => setRowComments(r.id, e.target.value)}
                        placeholder={`Enter comment for ${r.label.replace(":", "").toLowerCase()}`}
                      />
                    </div>

                    {/* Mitigation block */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-slate-500">
                          {r.mitigationLabel.replace(":", "")}{" "}
                          {(r.value === "Not OK" || r.id === "drainage") && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                      </div>
                      <textarea
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs focus:border-slate-400 focus:outline-none"
                        rows={2}
                        value={r.mitigation}
                        onChange={(e) => setRowMitigation(r.id, e.target.value)}
                        placeholder="Describe what actions are being taken (or will be taken) to correct or minimize the hazard."
                        required={r.value === "Not OK" || r.id === "drainage"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Date Correction */}
            <div className="flex flex-col gap-1 border-t pt-4">
              <label className="text-sm font-medium text-slate-700">
                Expected Date Correction:
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={expectedDateCorrection}
                onChange={(e) => setExpectedDateCorrection(e.target.value)}
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-slate-800 text-white py-3 rounded-xl text-sm font-medium shadow hover:bg-slate-700 transition"
              >
                Submit Workplace Exam
              </button>
              {submitMessage && (
                <p className="text-sm mt-3 text-center text-red-600 font-medium">
                  {submitMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
