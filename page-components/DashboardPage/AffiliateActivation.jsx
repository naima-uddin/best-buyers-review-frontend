"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, AlertTriangle } from "lucide-react";

// Only this hidden super-admin may access the affiliate-activation route.
const ALLOWED_EMAIL = "secret@gmail.com";

export default function AffiliateActivation() {
  const router = useRouter();
  // "checking" -> verifying token, "allowed" -> render, otherwise redirect
  const [status, setStatus] = useState("checking");

  const [enabled, setEnabled] = useState(false);
  const [dailyCount, setDailyCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- Access gate ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const email = (payload.email || "").toLowerCase();
      const isExpired = payload.exp && Date.now() >= payload.exp * 1000;
      if (!isExpired && email === ALLOWED_EMAIL) {
        setStatus("allowed");
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Error parsing token:", error);
      router.replace("/login");
    }
  }, [router]);

  // --- Load current config once access is granted ---
  useEffect(() => {
    if (status !== "allowed") return;
    const load = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/affiliate-activation`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok) {
          setEnabled(!!data.enabled);
          setDailyCount(Number(data.dailyDeleteCount ?? 1));
        }
      } catch (e) {
        console.error("Failed to load config:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status]);

  const save = async (next) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/affiliate-activation`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(next),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setEnabled(!!data.enabled);
        setDailyCount(Number(data.dailyDeleteCount ?? 1));
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (e) {
      console.error("Save failed:", e);
      alert("Error saving");
    } finally {
      setSaving(false);
    }
  };

  if (status !== "allowed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
            <ShieldCheck className="h-8 w-8 text-green-600" />
            Affiliate Activation
          </h1>
          <p className="mt-1 text-gray-500">
            Restricted area — super-admin access only.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Master toggle */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Auto-rotation
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Master switch.
                </p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={() => save({ enabled: !enabled, dailyDeleteCount: dailyCount })}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  enabled ? "bg-green-600" : "bg-gray-300"
                } ${saving ? "opacity-60" : ""}`}
                aria-pressed={enabled}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Daily count */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Daily count (N)
              </h2>
              
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  value={dailyCount}
                  disabled={!enabled}
                  onChange={(e) =>
                    setDailyCount(Math.max(0, parseInt(e.target.value, 10) || 0))
                  }
                  className="w-28 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                />
                <button
                  type="button"
                  disabled={!enabled || saving}
                  onClick={() => save({ enabled, dailyDeleteCount: dailyCount })}
                  className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>

           
          </div>
        )}
      </div>
    </div>
  );
}
