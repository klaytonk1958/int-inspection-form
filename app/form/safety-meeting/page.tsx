"use client";

import React, { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function SafetyMeetingForm() {
  const [safetyLeader, setSafetyLeader] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [safetySubject, setSafetySubject] = useState("");
  const [topicsDiscussed, setTopicsDiscussed] = useState("");
  // Attendees: one per line, rendered as individual rows
  const [attendeesRaw, setAttendeesRaw] = useState("");

  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  function resetForm() {
    setSafetyLeader("");
    setMeetingDate("");
    setSafetySubject("");
    setTopicsDiscussed("");
    setAttendeesRaw("");
    setSubmitMessage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitMessage(null);
    setLoading(true);

    // Validation
    if (!safetyLeader.trim()) {
      setSubmitMessage("Please fill required field: Safety Leader");
      setLoading(false);
      return;
    }
    if (!meetingDate.trim()) {
      setSubmitMessage("Please fill required field: Date");
      setLoading(false);
      return;
    }
    if (!safetySubject.trim()) {
      setSubmitMessage("Please fill required field: Safety Subject");
      setLoading(false);
      return;
    }
    if (!topicsDiscussed.trim()) {
      setSubmitMessage("Please fill required field: Topics Discussed");
      setLoading(false);
      return;
    }
    if (!attendeesRaw.trim()) {
      setSubmitMessage("Please fill required field: Employee Attendees");
      setLoading(false);
      return;
    }

    try {
      setSubmitMessage("Submitting record...");

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
        "Safety Leader:": safetyLeader,
        "Date:": meetingDate,
        "Safety Subject:": safetySubject,
        "Topics Discussed:": topicsDiscussed,
        "Employee Attendees:": attendeesRaw.trim(),
      };

      const res = await fetch(`${API_URL}/api/safety-meeting`, {
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
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank you!</h2>
          <p className="text-slate-600 text-center mb-6">
            The Safety Meeting record has been submitted successfully.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowThankYou(false);
              }}
              className="w-full bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow hover:bg-slate-700 transition"
            >
              Submit Another Record
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
          {/* Header */}
          <header className="mb-6 border-b border-slate-100 pb-5">
            <Link href="/" className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 mb-3 transition">
              ← Main Menu
            </Link>
            <div className="bg-slate-900 text-white rounded-xl p-4 text-center mb-4">
              <h1 className="text-xl font-bold tracking-wider font-sans uppercase">
                EPM Safety Meeting
              </h1>
              <p className="text-xs text-slate-400 tracking-widest uppercase mt-1">
                Even Par Mine ID# 38-00774
              </p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed text-center mb-4">
              Complete this form every Monday, or on the first day of the workweek, to document Safety Meetings for Main Office documentation and MSHA recordkeeping requirements.
            </p>

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
            {/* Safety Leader */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Safety Leader: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={safetyLeader}
                onChange={(e) => setSafetyLeader(e.target.value)}
                placeholder="Name of person leading the meeting"
                required
              />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Date: <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                required
              />
            </div>

            {/* Safety Subject */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Safety Subject: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={safetySubject}
                onChange={(e) => setSafetySubject(e.target.value)}
                placeholder="e.g. Haul Road Safety, PPE Usage"
                required
              />
            </div>

            {/* Topics Discussed */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Topics Discussed: <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                rows={4}
                value={topicsDiscussed}
                onChange={(e) => setTopicsDiscussed(e.target.value)}
                placeholder="Describe the topics covered during the safety meeting..."
                required
              />
            </div>

            {/* Employee Attendees */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Employee Attendees: <span className="text-red-500">*</span>
              </label>
              <p className="text-[11px] text-slate-400 -mt-0.5">
                List names, one per line
              </p>
              <textarea
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                rows={5}
                value={attendeesRaw}
                onChange={(e) => setAttendeesRaw(e.target.value)}
                placeholder={"John Smith\nJane Doe\nMike Johnson"}
                required
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-slate-800 text-white py-3 rounded-xl text-sm font-medium shadow hover:bg-slate-700 transition"
              >
                Submit Safety Meeting
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
