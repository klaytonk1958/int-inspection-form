"use client";

import React, { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const BEHAVIOR_OPTIONS = [
  "Safe Behavior",
  "At Risk Behavior",
  "Handling Material",
  "Work Place Exam",
  "Lifting or Pulling",
  "Use of PPE",
  "Body Positioning",
  "Equipment Use",
] as const;

export default function NearMissForm() {
  const [operatorName, setOperatorName] = useState("");
  const [dateOfIncident, setDateOfIncident] = useState("");
  const [nearMissIncident, setNearMissIncident] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [selectedBehaviors, setSelectedBehaviors] = useState<Set<string>>(new Set());
  const [otherBehavior, setOtherBehavior] = useState("");
  const [otherComments, setOtherComments] = useState("");

  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  function toggleBehavior(behavior: string) {
    setSelectedBehaviors((prev) => {
      const next = new Set(prev);
      if (next.has(behavior)) {
        next.delete(behavior);
      } else {
        next.add(behavior);
      }
      return next;
    });
  }

  function resetForm() {
    setOperatorName("");
    setDateOfIncident("");
    setNearMissIncident("");
    setActionTaken("");
    setSelectedBehaviors(new Set());
    setOtherBehavior("");
    setOtherComments("");
    setSubmitMessage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitMessage(null);
    setLoading(true);

    // Validation
    if (!operatorName.trim()) {
      setSubmitMessage("Please fill required field: Operator Name");
      setLoading(false);
      return;
    }
    if (!dateOfIncident.trim()) {
      setSubmitMessage("Please fill required field: Date of Incident");
      setLoading(false);
      return;
    }
    if (!nearMissIncident.trim()) {
      setSubmitMessage("Please fill required field: Near Miss Incident");
      setLoading(false);
      return;
    }
    if (!actionTaken.trim()) {
      setSubmitMessage("Please fill required field: Action Taken");
      setLoading(false);
      return;
    }
    if (selectedBehaviors.size === 0 && !otherBehavior.trim()) {
      setSubmitMessage("Please select at least one Critical Behavior (or fill in Other)");
      setLoading(false);
      return;
    }

    try {
      setSubmitMessage("Submitting report...");

      // Combine selected behaviors into comma-separated string
      const behaviorsValue = [
        ...Array.from(selectedBehaviors),
        ...(otherBehavior.trim() ? [`Other: ${otherBehavior.trim()}`] : []),
      ].join(", ");

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
        "Operator Name:": operatorName,
        "Date of Incident:": dateOfIncident,
        "Near Miss Incident:": nearMissIncident,
        "Action Taken:": actionTaken,
        "Critical Behaviors:": behaviorsValue,
        "Other:": otherBehavior,
        "Other Comments & Concerns:": otherComments,
      };

      const res = await fetch(`${API_URL}/api/near-miss`, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ task: "init", data: payload }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Submission failed");
      }

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
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Report Submitted</h2>
          <p className="text-slate-600 text-center mb-6">
            The Near Miss entry has been recorded successfully. Thank you for keeping the site safe.
          </p>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowThankYou(false);
            }}
            className="bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow hover:bg-slate-700 transition"
          >
            Submit Another Report
          </button>
        </div>
      )}

      {/* Main Form */}
      {!showThankYou && (
        <div className="bg-white rounded-2xl shadow-md p-4">
          {/* Header */}
          <header className="mb-6 border-b border-slate-100 pb-5">
            <div className="bg-slate-900 text-white rounded-xl p-4 text-center mb-4">
              <h1 className="text-xl font-bold tracking-wider font-sans uppercase">
                EPM Near Miss Entry
              </h1>
              <p className="text-xs text-slate-400 tracking-widest uppercase mt-1">
                Even Par Mine ID# 38-00774
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center mb-4">
              <span className="text-xs font-semibold text-amber-800 block">
                Complete this form to document &amp; report any Near Miss events.
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>
                Support:{" "}
                <a
                  href="tel:8033007596"
                  className="text-slate-600 hover:text-slate-800 underline font-medium"
                >
                  Klayton (803-300-7596)
                </a>
              </span>
              <span>
                <span className="text-red-500">*</span> Required field
              </span>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Operator Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Operator Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            {/* Date of Incident */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Date of Incident: <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={dateOfIncident}
                onChange={(e) => setDateOfIncident(e.target.value)}
                required
              />
            </div>

            {/* Near Miss Incident */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Near Miss Incident: <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                rows={4}
                value={nearMissIncident}
                onChange={(e) => setNearMissIncident(e.target.value)}
                placeholder="Details of incident..."
                required
              />
            </div>

            {/* Action Taken */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Action Taken: <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                rows={4}
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                placeholder="Details of action taken..."
                required
              />
            </div>

            {/* Critical Behaviors */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Critical Behaviors: <span className="text-red-500">*</span>
              </label>
              <p className="text-[11px] text-slate-400 -mt-1">
                Select all that apply
              </p>
              <div className="grid grid-cols-2 gap-2">
                {BEHAVIOR_OPTIONS.map((behavior) => {
                  const active = selectedBehaviors.has(behavior);
                  return (
                    <button
                      key={behavior}
                      type="button"
                      onClick={() => toggleBehavior(behavior)}
                      className={`text-xs px-3 py-2 rounded-lg border text-left transition-all ${
                        active
                          ? "bg-slate-800 text-white border-slate-800"
                          : "bg-white text-slate-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {active && <span className="mr-1">✓</span>}
                      {behavior}
                    </button>
                  );
                })}
              </div>

              {/* Other behavior text */}
              <div className="flex flex-col gap-1 mt-1">
                <label className="text-xs font-medium text-slate-500">Other:</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-slate-400 focus:outline-none"
                  value={otherBehavior}
                  onChange={(e) => setOtherBehavior(e.target.value)}
                  placeholder="Describe other behavior..."
                />
              </div>
            </div>

            {/* Other Comments & Concerns */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Other Comments &amp; Concerns:
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                rows={3}
                value={otherComments}
                onChange={(e) => setOtherComments(e.target.value)}
                placeholder="Any additional comments or concerns..."
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-slate-800 text-white py-3 rounded-xl text-sm font-medium shadow hover:bg-slate-700 transition"
              >
                Submit Near Miss Report
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
