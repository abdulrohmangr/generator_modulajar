import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  BookOpen, Layers, FileText, Plus, Trash2, Printer, Download,
  ChevronRight, ChevronDown, Sparkles, Loader2, Save, X, Check,
  GraduationCap, ClipboardList, Users, Clock, Target, ListChecks,
  AlertCircle, Edit3, ArrowLeft, FolderOpen
} from "lucide-react";

/* ============================================================
   KONSTANTA
============================================================ */

const FASE_LIST = [
  { id: "A", label: "Fase A", desc: "Umumnya kelas I–II SD" },
  { id: "B", label: "Fase B", desc: "Umumnya kelas III–IV SD" },
  { id: "C", label: "Fase C", desc: "Umumnya kelas V–VI SD" },
  { id: "D", label: "Fase D", desc: "Umumnya kelas VII–IX SMP" },
  { id: "E", label: "Fase E", desc: "Umumnya kelas X SMA/SMK" },
  { id: "F", label: "Fase F", desc: "Umumnya kelas XI–XII SMA/SMK" },
];

const METODE_LIST = [
  {
    id: "pbl",
    label: "Problem Based Learning (PBL)",
    sintak: [
      "Orientasi peserta didik pada masalah",
      "Mengorganisasikan peserta didik untuk belajar",
      "Membimbing penyelidikan individu maupun kelompok",
      "Mengembangkan dan menyajikan hasil karya",
      "Menganalisis dan mengevaluasi proses pemecahan masalah",
    ],
  },
  {
    id: "pjbl",
    label: "Project Based Learning (PjBL)",
    sintak: [
      "Penentuan pertanyaan mendasar (start with the essential question)",
      "Mendesain perencanaan proyek",
      "Menyusun jadwal (create a schedule)",
      "Memonitor peserta didik dan kemajuan proyek",
      "Menguji hasil (assess the outcome)",
      "Mengevaluasi pengalaman (evaluate the experience)",
    ],
  },
  {
    id: "discovery",
    label: "Discovery Learning",
    sintak: [
      "Pemberian rangsangan (stimulation)",
      "Identifikasi masalah (problem statement)",
      "Pengumpulan data (data collection)",
      "Pengolahan data (data processing)",
      "Pembuktian (verification)",
      "Menarik kesimpulan (generalization)",
    ],
  },
  {
    id: "inquiry",
    label: "Inquiry Learning",
    sintak: [
      "Orientasi",
      "Merumuskan masalah",
      "Mengajukan hipotesis",
      "Mengumpulkan data",
      "Menguji hipotesis",
      "Merumuskan kesimpulan",
    ],
  },
  {
    id: "cooperative",
    label: "Cooperative Learning",
    sintak: [
      "Menyampaikan tujuan dan memotivasi peserta didik",
      "Menyajikan informasi",
      "Mengorganisasikan peserta didik ke dalam kelompok belajar",
      "Membimbing kelompok bekerja dan belajar",
      "Evaluasi",
      "Memberikan penghargaan",
    ],
  },
  {
    id: "deep-learning",
    label: "Deep Learning (Mindful, Meaningful, Joyful)",
    sintak: [
      "Mindful Learning — membangun kesadaran dan kesiapan belajar peserta didik",
      "Meaningful Learning — mengaitkan materi dengan konteks dan pengalaman nyata peserta didik",
      "Joyful Learning — mengelola aktivitas belajar yang menyenangkan dan reflektif",
    ],
  },
];

const SKL_OPTIONS = [
  {
    id: "skl-1",
    label: "Beriman, bertakwa kepada Tuhan YME, dan berakhlak mulia",
    text: "Memiliki akhlak mulia dengan mempraktikkan nilai-nilai keimanan dan ketakwaan kepada Tuhan Yang Maha Esa dalam kehidupan sehari-hari.",
  },
  {
    id: "skl-2",
    label: "Berkebhinekaan global",
    text: "Mengenal dan menghargai budaya, dapat berkomunikasi dan berinteraksi antar budaya, merefleksi dan bertanggung jawab terhadap pengalaman kebhinekaan.",
  },
  {
    id: "skl-3",
    label: "Bergotong royong",
    text: "Memiliki kemampuan bergotong royong, yaitu kemampuan untuk melakukan kegiatan secara bersama-sama dengan suka rela agar kegiatan yang dikerjakan dapat berjalan lancar, mudah dan ringan.",
  },
  {
    id: "skl-4",
    label: "Mandiri",
    text: "Memiliki prakarsa atas pengembangan dirinya dan disertai dengan perasaan tanggung jawab atas proses dan hasil belajarnya.",
  },
  {
    id: "skl-5",
    label: "Bernalar kritis",
    text: "Mampu secara objektif memproses informasi baik kualitatif maupun kuantitatif, membangun keterkaitan antara berbagai informasi, menganalisis informasi, mengevaluasi dan menyimpulkannya.",
  },
  {
    id: "skl-6",
    label: "Kreatif",
    text: "Mampu memodifikasi dan menghasilkan sesuatu yang orisinal, bermakna, bermanfaat, dan berdampak.",
  },
  {
    id: "skl-7",
    label: "Menguasai kompetensi keahlian (SMK)",
    text: "Memiliki kemampuan teknis dan vokasional sesuai program keahlian yang dipilih, siap memasuki dunia kerja dan/atau berwirausaha.",
  },
  {
    id: "skl-8",
    label: "Literasi digital dan teknologi",
    text: "Mampu menggunakan, memanfaatkan, dan mengembangkan teknologi informasi dan komunikasi secara bijak, etis, dan bertanggung jawab.",
  },
];

const SARANA_OPTIONS = [
  "Laptop / Komputer",
  "Proyektor / LCD",
  "Papan Tulis / Whiteboard",
  "Spidol / Alat Tulis",
  "Buku Teks / Modul Cetak",
  "Koneksi Internet",
  "HP / Tablet",
  "Lab Komputer",
  "LKPD (Lembar Kerja Peserta Didik)",
  "Video Pembelajaran",
  "Slide Presentasi (PPT)",
  "Alat Praktikum",
  "Kartu / Flashcard",
];

const STORAGE_KEYS = {
  cpBank: "cp-bank",
  tpBank: "tp-bank",
  moduls: "modul-ajar-list",
  identitas: "identitas-sekolah",
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

/* ============================================================
   HELPERS: STORAGE
============================================================ */

async function loadList(key) {
  try {
    const res = await window.storage.get(key, false);
    return res ? JSON.parse(res.value) : [];
  } catch {
    return [];
  }
}
async function saveList(key, list) {
  try {
    await window.storage.set(key, JSON.stringify(list), false);
  } catch (e) {
    console.error("Gagal menyimpan", key, e);
  }
}
async function loadObj(key, fallback) {
  try {
    const res = await window.storage.get(key, false);
    return res ? JSON.parse(res.value) : fallback;
  } catch {
    return fallback;
  }
}
async function saveObj(key, obj) {
  try {
    await window.storage.set(key, JSON.stringify(obj), false);
  } catch (e) {
    console.error("Gagal menyimpan", key, e);
  }
}

/* ============================================================
   HELPER: PANGGIL CLAUDE API
============================================================ */

async function callClaude(prompt, systemPrompt, maxTokens = 4000) {
  // Pakai proxy /api/chat di Vercel agar API key aman di server
  const isLocalhost = typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const endpoint = isLocalhost
    ? "https://api.anthropic.com/v1/messages"
    : "/api/chat";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API error ${res.status}: ${errText.slice(0, 200)}`);
  }
  const data = await res.json();
  if (data.stop_reason === "max_tokens") {
    throw new Error("Respons AI terpotong (terlalu panjang). Coba kurangi jumlah TP atau pertemuan.");
  }
  const textBlock = (data.content || []).find((b) => b.type === "text");
  if (!textBlock) throw new Error("Tidak ada respons teks dari AI");
  return textBlock.text;
}

function extractJson(text) {
  // Bersihkan markdown fence dan whitespace
  let cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  // Coba parse langsung dulu
  try {
    return JSON.parse(cleaned);
  } catch (_) { /* lanjut ke fallback */ }

  // Cari awal JSON: ambil yang lebih awal antara [ dan {
  const idxArr = cleaned.indexOf("[");
  const idxObj = cleaned.indexOf("{");
  const candidates = [idxArr, idxObj].filter((i) => i !== -1);
  if (candidates.length === 0) throw new Error("Tidak ditemukan JSON dalam respons AI");
  const start = Math.min(...candidates);
  const opener = cleaned[start];
  const closer = opener === "[" ? "]" : "}";

  // Ambil substring dari opener hingga closer yang matching (bukan sekadar lastIndexOf)
  let depth = 0;
  let end = -1;
  for (let i = start; i < cleaned.length; i++) {
    if (cleaned[i] === opener) depth++;
    else if (cleaned[i] === closer) {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }

  if (end > start) {
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch (e) {
      throw new Error("Format JSON tidak valid: " + e.message);
    }
  }

  throw new Error("Gagal mengekstrak JSON dari respons AI");
}

/* ============================================================
   UI KECIL
============================================================ */

function Field({ label, required, children, hint }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-semibold text-[#1F3A3D] mb-1.5">
        {label} {required && <span className="text-[#B4552F]">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-[#6B7A78] mt-1">{hint}</span>}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg border border-[#D8DCD4] bg-white px-3.5 py-2.5 text-[15px] text-[#1F3A3D] placeholder-[#9AA6A0] outline-none transition focus:border-[#2E7D6B] focus:ring-2 focus:ring-[#2E7D6B]/15 " +
        (props.className || "")
      }
    />
  );
}
function TextArea(props) {
  return (
    <textarea
      {...props}
      className={
        "w-full rounded-lg border border-[#D8DCD4] bg-white px-3.5 py-2.5 text-[15px] text-[#1F3A3D] placeholder-[#9AA6A0] outline-none transition focus:border-[#2E7D6B] focus:ring-2 focus:ring-[#2E7D6B]/15 resize-y " +
        (props.className || "")
      }
    />
  );
}
function Select(props) {
  return (
    <select
      {...props}
      className={
        "w-full rounded-lg border border-[#D8DCD4] bg-white px-3.5 py-2.5 text-[15px] text-[#1F3A3D] outline-none transition focus:border-[#2E7D6B] focus:ring-2 focus:ring-[#2E7D6B]/15 " +
        (props.className || "")
      }
    />
  );
}

function Btn({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#2E7D6B] text-white hover:bg-[#256355] shadow-sm",
    secondary: "bg-white text-[#1F3A3D] border border-[#D8DCD4] hover:bg-[#F4F1E8]",
    danger: "bg-white text-[#B4552F] border border-[#EAD3C6] hover:bg-[#FBEDE4]",
    ghost: "text-[#2E7D6B] hover:bg-[#2E7D6B]/10",
    dark: "bg-[#1F3A3D] text-white hover:bg-[#16292B]",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Badge({ children, tone = "green" }) {
  const tones = {
    green: "bg-[#E4EFE9] text-[#256355]",
    clay: "bg-[#FBEDE4] text-[#B4552F]",
    ink: "bg-[#1F3A3D]/8 text-[#1F3A3D]",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-[#D8DCD4] rounded-xl bg-[#FAF9F4]">
      <div className="w-12 h-12 rounded-full bg-[#2E7D6B]/10 flex items-center justify-center mb-3">
        <Icon size={22} className="text-[#2E7D6B]" />
      </div>
      <h3 className="font-semibold text-[#1F3A3D] mb-1">{title}</h3>
      <p className="text-sm text-[#6B7A78] max-w-sm mb-4">{desc}</p>
      {action}
    </div>
  );
}

/* ============================================================
   TAB 1: BANK CP & TP
============================================================ */

function BankCPTP({ cpBank, setCpBank, tpBank, setTpBank }) {
  const [fase, setFase] = useState("E");
  const [elemen, setElemen] = useState("");
  const [cpText, setCpText] = useState("");
  const [savingCp, setSavingCp] = useState(false);
  const [expandedCp, setExpandedCp] = useState(null);
  const [genLoading, setGenLoading] = useState(null);
  const [genError, setGenError] = useState("");
  const [jumlahTp, setJumlahTp] = useState(4);
  const [manualTp, setManualTp] = useState({});
  const [editingCpId, setEditingCpId] = useState(null);

  const addCp = async () => {
    if (!elemen.trim() || !cpText.trim()) return;
    setSavingCp(true);
    const newCp = { id: uid(), fase, elemen: elemen.trim(), cp: cpText.trim(), createdAt: Date.now() };
    const updated = [newCp, ...cpBank];
    setCpBank(updated);
    await saveList(STORAGE_KEYS.cpBank, updated);
    setElemen("");
    setCpText("");
    setSavingCp(false);
    setExpandedCp(newCp.id);
    // Langsung lanjut buat TP otomatis supaya guru tidak perlu klik dua kali
    generateTp(newCp);
  };

  const deleteCp = async (id) => {
    const updated = cpBank.filter((c) => c.id !== id);
    setCpBank(updated);
    await saveList(STORAGE_KEYS.cpBank, updated);
    const updatedTp = tpBank.filter((t) => t.cpId !== id);
    setTpBank(updatedTp);
    await saveList(STORAGE_KEYS.tpBank, updatedTp);
  };

  const generateTp = async (cpItem) => {
    setGenLoading(cpItem.id);
    setGenError("");
    try {
      const system = `Kamu adalah ahli kurikulum Merdeka Indonesia yang membantu guru menyusun Tujuan Pembelajaran (TP) dari Capaian Pembelajaran (CP).
Aturan:
- Setiap TP WAJIB mengikuti pola ABCD:
  - Audience: subjek "Peserta didik".
  - Behavior: kata kerja operasional yang terukur/dapat diamati (boleh mengikuti taksonomi Bloom), menyatakan kompetensi.
  - Condition: kondisi, alat, metode, atau konteks saat kompetensi itu ditunjukkan (contoh: "menggunakan...", "melalui...", "dengan bantuan...", "berdasarkan...").
  - Degree: tingkat/kriteria keberhasilan yang menunjukkan seberapa baik/tepat/lengkap kompetensi dicapai (contoh: "dengan tepat", "secara sistematis", "sesuai kaidah", "tanpa kesalahan").
  - Contoh pola: "Peserta didik [Behavior] [Condition] [Degree]."
- TP disusun berurutan secara logis, dari kemampuan sederhana ke kompleks, membentuk Alur Tujuan Pembelajaran (ATP) yang utuh untuk mencapai CP.
- Bahasa Indonesia baku, ringkas, satu kalimat per TP, dan keempat unsur ABCD harus jelas terlihat dalam kalimat.
- Jawab HANYA dengan JSON array of strings, tanpa teks lain, tanpa markdown code fence.`;
      const prompt = `Fase: ${cpItem.fase}
Elemen: ${cpItem.elemen}
Capaian Pembelajaran (CP): ${cpItem.cp}

Buatkan ${jumlahTp} Tujuan Pembelajaran (TP) yang berurutan sebagai Alur Tujuan Pembelajaran (ATP) untuk mencapai CP di atas. Jawab dalam format JSON array of strings saja.`;
      const raw = await callClaude(prompt, system);
      const arr = extractJson(raw);
      if (!Array.isArray(arr)) throw new Error("Format tidak sesuai");
      const newTps = arr.map((tp, idx) => ({
        id: uid(),
        cpId: cpItem.id,
        tp: typeof tp === "string" ? tp : tp.tp || JSON.stringify(tp),
        urutan: idx + 1,
        source: "ai",
      }));
      const updated = [...tpBank.filter((t) => t.cpId !== cpItem.id), ...newTps];
      setTpBank(updated);
      await saveList(STORAGE_KEYS.tpBank, updated);
      setExpandedCp(cpItem.id);
    } catch (e) {
      setGenError("Gagal membuat TP otomatis: " + e.message + ". Silakan coba lagi atau isi manual.");
    } finally {
      setGenLoading(null);
    }
  };

  const addManualTp = async (cpId) => {
    const text = (manualTp[cpId] || "").trim();
    if (!text) return;
    const existing = tpBank.filter((t) => t.cpId === cpId);
    const newTp = { id: uid(), cpId, tp: text, urutan: existing.length + 1, source: "manual" };
    const updated = [...tpBank, newTp];
    setTpBank(updated);
    await saveList(STORAGE_KEYS.tpBank, updated);
    setManualTp((m) => ({ ...m, [cpId]: "" }));
  };

  const deleteTp = async (id) => {
    const updated = tpBank.filter((t) => t.id !== id);
    setTpBank(updated);
    await saveList(STORAGE_KEYS.tpBank, updated);
  };

  const grouped = FASE_LIST.map((f) => ({
    ...f,
    items: cpBank.filter((c) => c.fase === f.id),
  })).filter((f) => f.items.length > 0);

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-5">
      {/* Form tambah CP */}
      <div className="bg-white rounded-xl border border-[#E4E1D6] p-4 sm:p-5 h-fit lg:sticky lg:top-4">
        <h3 className="font-serif text-lg font-bold text-[#1F3A3D] mb-4 flex items-center gap-2">
          <Plus size={18} className="text-[#2E7D6B]" /> Tambah Capaian Pembelajaran
        </h3>
        <Field label="Fase" required>
          <Select value={fase} onChange={(e) => setFase(e.target.value)}>
            {FASE_LIST.map((f) => (
              <option key={f.id} value={f.id}>{f.label} — {f.desc}</option>
            ))}
          </Select>
        </Field>
        <Field label="Elemen" required hint="Contoh: Pemrograman Web, Basis Data, dsb.">
          <TextInput value={elemen} onChange={(e) => setElemen(e.target.value)} placeholder="Nama elemen CP" />
        </Field>
        <Field label="Capaian Pembelajaran (CP)" required>
          <TextArea rows={6} value={cpText} onChange={(e) => setCpText(e.target.value)} placeholder="Tempel atau ketik teks CP dari elemen ini..." />
        </Field>
        <Btn onClick={addCp} disabled={savingCp || !elemen.trim() || !cpText.trim()} className="w-full">
          {savingCp ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Simpan & Buat TP Otomatis
        </Btn>
        <p className="text-xs text-[#6B7A78] mt-2 text-center">Tujuan Pembelajaran akan langsung dibuatkan AI setelah CP tersimpan.</p>
      </div>

      {/* Daftar CP + TP */}
      <div>
        {genError && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-[#FBEDE4] border border-[#EAD3C6] px-4 py-3 text-sm text-[#B4552F]">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {genError}
          </div>
        )}
        {grouped.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="Belum ada CP tersimpan"
            desc="Tambahkan Capaian Pembelajaran di panel kiri untuk mulai menyusun Tujuan Pembelajaran (TP)."
          />
        ) : (
          <div className="space-y-6">
            {grouped.map((f) => (
              <div key={f.id}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge tone="ink">{f.label}</Badge>
                  <span className="text-xs text-[#6B7A78]">{f.desc}</span>
                </div>
                <div className="space-y-3">
                  {f.items.map((cpItem) => {
                    const tps = tpBank.filter((t) => t.cpId === cpItem.id).sort((a, b) => a.urutan - b.urutan);
                    const isOpen = expandedCp === cpItem.id;
                    return (
                      <div key={cpItem.id} className="bg-white rounded-xl border border-[#E4E1D6] overflow-hidden">
                        <button
                          onClick={() => setExpandedCp(isOpen ? null : cpItem.id)}
                          className="w-full flex items-start gap-3 p-4 text-left hover:bg-[#FAF9F4] transition"
                        >
                          {isOpen ? <ChevronDown size={18} className="mt-0.5 text-[#6B7A78] shrink-0" /> : <ChevronRight size={18} className="mt-0.5 text-[#6B7A78] shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-semibold text-[#1F3A3D]">{cpItem.elemen}</span>
                              {tps.length > 0 && <Badge>{tps.length} TP</Badge>}
                            </div>
                            <p className="text-sm text-[#4A5A57] line-clamp-2">{cpItem.cp}</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteCp(cpItem.id); }}
                            className="shrink-0 p-1.5 rounded-md text-[#9AA6A0] hover:text-[#B4552F] hover:bg-[#FBEDE4]"
                            title="Hapus CP ini"
                          >
                            <Trash2 size={16} />
                          </button>
                        </button>

                        {isOpen && (
                          <div className="border-t border-[#EDEBDF] p-4 bg-[#FCFBF7]">
                            <p className="text-sm text-[#4A5A57] mb-4 whitespace-pre-wrap">{cpItem.cp}</p>

                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <span className="text-xs font-semibold text-[#1F3A3D]">Jumlah TP:</span>
                              <input
                                type="number" min={2} max={10} value={jumlahTp}
                                onChange={(e) => setJumlahTp(Number(e.target.value))}
                                className="w-16 rounded-md border border-[#D8DCD4] px-2 py-1 text-sm"
                              />
                              <Btn
                                variant="primary"
                                onClick={() => generateTp(cpItem)}
                                disabled={genLoading === cpItem.id}
                              >
                                {genLoading === cpItem.id ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                                {tps.length > 0 ? "Buat Ulang TP dengan AI" : "Buat TP Otomatis (AI)"}
                              </Btn>
                            </div>

                            {tps.length > 0 && (
                              <ol className="space-y-2 mb-3">
                                {tps.map((t) => (
                                  <li key={t.id} className="flex items-start gap-2 bg-white rounded-lg border border-[#E4E1D6] px-3 py-2">
                                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#2E7D6B]/10 text-[#2E7D6B] text-xs font-bold flex items-center justify-center">{t.urutan}</span>
                                    <span className="flex-1 text-sm text-[#1F3A3D]">{t.tp}</span>
                                    {t.source === "manual" && <Badge tone="clay">Manual</Badge>}
                                    <button onClick={() => deleteTp(t.id)} className="shrink-0 text-[#9AA6A0] hover:text-[#B4552F]">
                                      <X size={14} />
                                    </button>
                                  </li>
                                ))}
                              </ol>
                            )}

                            <div className="flex items-center gap-2">
                              <TextInput
                                placeholder="Tambah TP manual..."
                                value={manualTp[cpItem.id] || ""}
                                onChange={(e) => setManualTp((m) => ({ ...m, [cpItem.id]: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === "Enter") addManualTp(cpItem.id); }}
                              />
                              <Btn variant="secondary" onClick={() => addManualTp(cpItem.id)}>
                                <Plus size={15} />
                              </Btn>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TAB 2: GENERATOR MODUL AJAR
============================================================ */

function GeneratorModul({ cpBank, tpBank, setTpBank, moduls, setModuls, identitas, setIdentitas, onOpenModul }) {
  const [phase, setPhase] = useState("form"); // form | generating | hasil
  const [form, setForm] = useState({
    fase: "E",
    elemenCpId: "",
    tpIds: [],
    materi: "",
    pertemuan: 1,
    jp: 2,
    skl: "",
    sklIds: [],
    sarana: [],
    metode: "pbl",
  });
  const [result, setResult] = useState(null); // { kegiatanInti, asesmen, lkpd, rubrik }
  const [savedModul, setSavedModul] = useState(null);
  const [genStage, setGenStage] = useState(""); // pesan progres
  const [genTpLoading, setGenTpLoading] = useState(false);
  const [jumlahTp, setJumlahTp] = useState(4);
  const [error, setError] = useState("");

  const cpOptions = cpBank.filter((c) => c.fase === form.fase);
  const selectedCp = cpBank.find((c) => c.id === form.elemenCpId);
  const availableTps = tpBank.filter((t) => t.cpId === form.elemenCpId).sort((a, b) => a.urutan - b.urutan);
  const selectedTps = availableTps.filter((t) => form.tpIds.includes(t.id));
  const metodeObj = METODE_LIST.find((m) => m.id === form.metode);

  const updateForm = (patch) => setForm((f) => ({ ...f, ...patch }));
  const toggleTp = (id) => {
    setForm((f) => ({ ...f, tpIds: f.tpIds.includes(id) ? f.tpIds.filter((x) => x !== id) : [...f.tpIds, id] }));
  };

  // Generate TP langsung dari tab ini, kalau elemen dipilih belum punya TP
  const generateTpDisini = async () => {
    if (!selectedCp) return;
    setGenTpLoading(true);
    setError("");
    try {
      const system = `Kamu adalah ahli kurikulum Merdeka Indonesia yang membantu guru menyusun Tujuan Pembelajaran (TP) dari Capaian Pembelajaran (CP).
Aturan:
- Setiap TP WAJIB mengikuti pola ABCD:
  - Audience: subjek "Peserta didik".
  - Behavior: kata kerja operasional yang terukur/dapat diamati, menyatakan kompetensi.
  - Condition: kondisi, alat, metode, atau konteks saat kompetensi ditunjukkan (contoh: "menggunakan...", "melalui...", "berdasarkan...").
  - Degree: tingkat/kriteria keberhasilan (contoh: "dengan tepat", "secara sistematis", "sesuai kaidah").
  - Pola kalimat: "Peserta didik [Behavior] [Condition] [Degree]."
- TP disusun berurutan dari sederhana ke kompleks membentuk Alur Tujuan Pembelajaran (ATP) yang utuh.
- Bahasa Indonesia baku, ringkas, satu kalimat per TP, keempat unsur ABCD harus jelas terlihat.
- Jawab HANYA dengan JSON array of strings, tanpa teks lain, tanpa markdown fence.`;
      const prompt = `Fase: ${selectedCp.fase}
Elemen: ${selectedCp.elemen}
Capaian Pembelajaran (CP): ${selectedCp.cp}

Buatkan ${jumlahTp} Tujuan Pembelajaran (TP) berurutan sebagai Alur Tujuan Pembelajaran (ATP) untuk mencapai CP di atas. Jawab dalam format JSON array of strings saja.`;
      const raw = await callClaude(prompt, system);
      const arr = extractJson(raw);
      if (!Array.isArray(arr)) throw new Error("Format tidak sesuai");
      const newTps = arr.map((tp, idx) => ({
        id: uid(), cpId: selectedCp.id, tp: typeof tp === "string" ? tp : tp.tp || JSON.stringify(tp), urutan: idx + 1, source: "ai",
      }));
      const updated = [...tpBank.filter((t) => t.cpId !== selectedCp.id), ...newTps];
      setTpBank(updated);
      await saveList(STORAGE_KEYS.tpBank, updated);
      updateForm({ tpIds: newTps.map((t) => t.id) });
    } catch (e) {
      setError("Gagal membuat TP otomatis: " + e.message);
    } finally {
      setGenTpLoading(false);
    }
  };

  // SKL valid jika ada yang dipilih dari daftar, atau isi manual tidak kosong
  const sklText = form.sklIds.length > 0
    ? SKL_OPTIONS.filter((s) => form.sklIds.includes(s.id)).map((s) => s.text).join(" ")
    : form.skl.trim();
  const canGenerate = selectedCp && selectedTps.length > 0 && form.materi.trim() && sklText;

  const toggleSkl = (id) => {
    setForm((f) => ({
      ...f,
      sklIds: f.sklIds.includes(id) ? f.sklIds.filter((x) => x !== id) : [...f.sklIds, id],
    }));
  };
  const toggleSarana = (item) => {
    setForm((f) => ({
      ...f,
      sarana: f.sarana.includes(item) ? f.sarana.filter((x) => x !== item) : [...f.sarana, item],
    }));
  };

  const buatModulLengkap = async () => {
    if (!canGenerate) return;
    setPhase("generating");
    setError("");
    try {
      const totalMenit = form.jp * 45;
      // Gabungkan SKL dari pilihan + teks manual jika ada
      const sklFinal = [
        ...SKL_OPTIONS.filter((s) => form.sklIds.includes(s.id)).map((s) => s.text),
        ...(form.skl.trim() ? [form.skl.trim()] : []),
      ].join(" ");

      setGenStage("Menyusun kegiatan inti sesuai sintak " + metodeObj.label + "...");
      const systemKegiatan = `Kamu adalah ahli pedagogi kurikulum Merdeka Indonesia. Susun Kegiatan Inti pembelajaran yang mengikuti SINTAK dari metode/model pembelajaran secara ketat — setiap tahap sintak harus muncul sebagai satu bagian kegiatan.
Jawab HANYA dengan JSON array of objects, tiap objek: {"tahap": "<nama tahap sintak>", "kegiatanGuru": "<2-3 kalimat konkret aktivitas GURU pada tahap ini>", "kegiatanMurid": "<2-3 kalimat konkret aktivitas PESERTA DIDIK pada tahap ini>", "alokasi": "<perkiraan menit, misal '15 menit'>"}. Tanpa teks lain, tanpa markdown fence.`;
      const promptKegiatan = `Materi: ${form.materi}
Tujuan Pembelajaran yang ingin dicapai:
${selectedTps.map((t, i) => `${i + 1}. ${t.tp}`).join("\n")}
Metode/Model: ${metodeObj.label}
Sintak yang harus diikuti secara berurutan: ${metodeObj.sintak.join(" -> ")}
Jumlah pertemuan: ${form.pertemuan}, @ ${form.jp} JP (${totalMenit} menit per pertemuan).

Susun kegiatan inti pembelajaran sesuai sintak di atas. Untuk setiap tahap, tuliskan aktivitas guru dan aktivitas peserta didik secara TERPISAH (dua kolom). Alokasi waktu realistis, total mendekati ${totalMenit} menit.`;

      const systemAsesmen = `Kamu adalah ahli asesmen kurikulum Merdeka Indonesia. Buat paket asesmen pembelajaran.
Jawab HANYA dengan JSON object persis seperti format berikut, tanpa teks lain, tanpa markdown fence:
{"asesmenAwal":"<1 kalimat pertanyaan diagnostik>","asesmenProses":["<indikator 1>","<indikator 2>","<indikator 3>"],"asesmenAkhir":{"jenis":"<tes tulis/praktik/produk>","soal":["<soal 1>","<soal 2>","<soal 3>"]},"lkpd":{"judul":"<judul LKPD>","petunjuk":"<petunjuk singkat>","langkah":["<langkah 1>","<langkah 2>","<langkah 3>","<langkah 4>"]},"rubrik":{"kktp":"<deskripsi KKTP singkat>","kriteria":[{"aspek":"<aspek 1>","sangatBaik":"<deskripsi singkat>","baik":"<deskripsi singkat>","cukup":"<deskripsi singkat>","perluBimbingan":"<deskripsi singkat>"},{"aspek":"<aspek 2>","sangatBaik":"<deskripsi singkat>","baik":"<deskripsi singkat>","cukup":"<deskripsi singkat>","perluBimbingan":"<deskripsi singkat>"},{"aspek":"<aspek 3>","sangatBaik":"<deskripsi singkat>","baik":"<deskripsi singkat>","cukup":"<deskripsi singkat>","perluBimbingan":"<deskripsi singkat>"}]}}
Isi setiap nilai dengan konten nyata sesuai materi. Deskripsi per sel rubrik maksimal 10 kata.`;
      const promptAsesmen = `Materi: ${form.materi}
Tujuan Pembelajaran:
${selectedTps.map((t, i) => `${i + 1}. ${t.tp}`).join("\n")}
Metode: ${metodeObj.label}

Buatkan paket asesmen (asesmen awal/diagnostik, asesmen proses, asesmen akhir/sumatif, LKPD, dan rubrik penilaian KKTP) yang selaras dengan tujuan pembelajaran di atas.`;

      setGenStage("AI sedang menyusun kegiatan inti & asesmen sekaligus...");
      const [rawKegiatan, rawAsesmen] = await Promise.all([
        callClaude(promptKegiatan, systemKegiatan),
        callClaude(promptAsesmen, systemAsesmen),
      ]);

      const kegiatanInti = extractJson(rawKegiatan);
      const obj = extractJson(rawAsesmen);
      const asesmen = { awal: obj.asesmenAwal, proses: obj.asesmenProses, akhir: obj.asesmenAkhir };
      const lkpd = obj.lkpd;
      const rubrik = obj.rubrik;

      setGenStage("Menyimpan modul ajar...");
      const newModul = {
        id: uid(),
        ...form,
        skl: sklFinal,
        cpElemen: selectedCp.elemen,
        cpFase: form.fase,
        cpText: selectedCp.cp,
        tpTexts: selectedTps.map((t) => t.tp),
        metodeLabel: metodeObj.label,
        kegiatanInti,
        asesmen,
        lkpd,
        rubrik,
        identitas: { ...identitas },
        createdAt: Date.now(),
      };
      const updatedModuls = [newModul, ...moduls];
      setModuls(updatedModuls);
      await saveList(STORAGE_KEYS.moduls, updatedModuls);
      setSavedModul(newModul);
      setResult({ kegiatanInti, asesmen, lkpd, rubrik });
      setPhase("hasil");
    } catch (e) {
      setError("Gagal membuat modul ajar: " + e.message + ". Silakan coba lagi.");
      setPhase("form");
    } finally {
      setGenStage("");
    }
  };

  const mulaiBaru = () => {
    setPhase("form");
    setResult(null);
    setSavedModul(null);
    setForm((f) => ({ ...f, tpIds: [], materi: "" }));
  };

  /* ---------- TAMPILAN: HASIL (dokumen lengkap langsung tampil) ---------- */
  if (phase === "hasil" && savedModul) {
    return (
      <div>
        <div className="mb-5 flex items-center gap-2 rounded-lg bg-[#E4EFE9] border border-[#C9DFD5] px-4 py-3">
          <Check size={18} className="text-[#256355] shrink-0" />
          <p className="text-sm text-[#256355] font-medium">Modul ajar lengkap berhasil dibuat & tersimpan otomatis.</p>
        </div>
        <ModulActionBar modul={savedModul} onBack={mulaiBaru} backLabel="Buat Modul Ajar Lain" />
        <ModulPreview modul={savedModul} />
      </div>
    );
  }

  /* ---------- TAMPILAN: SEDANG MEMBUAT ---------- */
  if (phase === "generating") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6">
        <div className="w-14 h-14 rounded-full bg-[#2E7D6B]/10 flex items-center justify-center mb-4">
          <Loader2 size={26} className="text-[#2E7D6B] animate-spin" />
        </div>
        <h3 className="font-serif text-lg font-bold text-[#1F3A3D] mb-1.5">Sedang menyusun modul ajar...</h3>
        <p className="text-sm text-[#6B7A78] max-w-sm">{genStage || "Mohon tunggu sebentar, AI sedang bekerja."}</p>
      </div>
    );
  }

  /* ---------- TAMPILAN: FORM ---------- */
  return (
    <div className="max-w-2xl">
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-[#FBEDE4] border border-[#EAD3C6] px-4 py-3 text-sm text-[#B4552F]">
          <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E4E1D6] p-4 sm:p-6 mb-4">
        <h3 className="font-serif text-lg font-bold text-[#1F3A3D] mb-1">Identitas Modul</h3>
        <p className="text-sm text-[#6B7A78] mb-5">Muncul di bagian awal dokumen.</p>
        <div className="grid sm:grid-cols-2 gap-x-4">
          <Field label="Nama Sekolah">
            <TextInput value={identitas.namaSekolah} onChange={(e) => setIdentitas({ ...identitas, namaSekolah: e.target.value })} />
          </Field>
          <Field label="Nama Penyusun">
            <TextInput value={identitas.penyusun} onChange={(e) => setIdentitas({ ...identitas, penyusun: e.target.value })} />
          </Field>
          <Field label="Program Keahlian / Kelas">
            <TextInput value={identitas.kelas} onChange={(e) => setIdentitas({ ...identitas, kelas: e.target.value })} placeholder="Contoh: RPL / XII" />
          </Field>
          <Field label="Tahun Ajaran">
            <TextInput value={identitas.tahunAjaran} onChange={(e) => setIdentitas({ ...identitas, tahunAjaran: e.target.value })} placeholder="2026/2027" />
          </Field>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E4E1D6] p-4 sm:p-6 mb-4">
        <h3 className="font-serif text-lg font-bold text-[#1F3A3D] mb-1 flex items-center gap-2">
          <Target size={18} className="text-[#2E7D6B]" /> Elemen & Tujuan Pembelajaran
        </h3>
        <p className="text-sm text-[#6B7A78] mb-5">Pilih CP yang sudah ada, lalu pilih TP-nya.</p>

        <div className="grid sm:grid-cols-2 gap-x-4">
          <Field label="Fase" required>
            <Select value={form.fase} onChange={(e) => updateForm({ fase: e.target.value, elemenCpId: "", tpIds: [] })}>
              {FASE_LIST.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </Select>
          </Field>
          <Field label="Elemen (CP)" required>
            <Select value={form.elemenCpId} onChange={(e) => updateForm({ elemenCpId: e.target.value, tpIds: [] })}>
              <option value="">— pilih elemen —</option>
              {cpOptions.map((c) => <option key={c.id} value={c.id}>{c.elemen}</option>)}
            </Select>
          </Field>
        </div>
        {cpOptions.length === 0 && (
          <p className="text-xs text-[#B4552F] mb-3">Belum ada CP untuk fase ini. Tambahkan dulu di tab "Bank CP & TP".</p>
        )}

        {selectedCp && (
          <div className="mb-4 rounded-lg bg-[#FAF9F4] border border-[#EDEBDF] p-3 text-sm text-[#4A5A57]">
            {selectedCp.cp}
          </div>
        )}

        {selectedCp && (
          <Field label="Tujuan Pembelajaran (TP)" required hint={availableTps.length > 0 ? "Pilih satu atau beberapa TP yang ingin dicapai." : undefined}>
            {availableTps.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#D8DCD4] p-4 text-center bg-[#FAF9F4]">
                <p className="text-sm text-[#6B7A78] mb-3">Elemen ini belum punya TP.</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-xs text-[#6B7A78]">Jumlah TP:</span>
                  <input type="number" min={2} max={10} value={jumlahTp} onChange={(e) => setJumlahTp(Number(e.target.value))} className="w-16 rounded-md border border-[#D8DCD4] px-2 py-1 text-sm" />
                  <Btn onClick={generateTpDisini} disabled={genTpLoading}>
                    {genTpLoading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    Buat TP Otomatis (AI)
                  </Btn>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {availableTps.map((t) => (
                  <label key={t.id} className="flex items-start gap-2 rounded-lg border border-[#E4E1D6] bg-white px-3 py-2.5 cursor-pointer hover:bg-[#FAF9F4] active:bg-[#F4F1E8]">
                    <input type="checkbox" className="mt-1 shrink-0 accent-[#2E7D6B] w-4 h-4" checked={form.tpIds.includes(t.id)} onChange={() => toggleTp(t.id)} />
                    <span className="text-sm text-[#1F3A3D]">{t.tp}</span>
                  </label>
                ))}
              </div>
            )}
          </Field>
        )}
      </div>

      {selectedCp && selectedTps.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E4E1D6] p-4 sm:p-6 mb-4">
          <h3 className="font-serif text-lg font-bold text-[#1F3A3D] mb-1 flex items-center gap-2">
            <ListChecks size={18} className="text-[#2E7D6B]" /> Detail Pembelajaran
          </h3>
          <p className="text-sm text-[#6B7A78] mb-5">Dipakai AI untuk menyusun kegiatan inti & asesmen.</p>

          <Field label="Materi" required>
            <TextInput value={form.materi} onChange={(e) => updateForm({ materi: e.target.value })} placeholder="Contoh: Autentikasi Pengguna dengan Laravel Breeze" />
          </Field>

          <div className="grid sm:grid-cols-2 gap-x-4">
            <Field label="Jumlah Pertemuan" required>
              <TextInput type="number" min={1} value={form.pertemuan} onChange={(e) => updateForm({ pertemuan: Number(e.target.value) })} />
            </Field>
            <Field label="Jumlah JP / pertemuan" required>
              <TextInput type="number" min={1} value={form.jp} onChange={(e) => updateForm({ jp: Number(e.target.value) })} />
            </Field>
          </div>

          <Field label="Standar Kompetensi Lulusan (SKL) terkait" required hint="Pilih satu atau lebih SKL yang relevan. Boleh tambah catatan manual di bawah.">
            <div className="space-y-2 mb-2">
              {SKL_OPTIONS.map((s) => (
                <label key={s.id} className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 cursor-pointer transition ${form.sklIds.includes(s.id) ? "border-[#2E7D6B] bg-[#E4EFE9]/40" : "border-[#E4E1D6] bg-white hover:bg-[#FAF9F4]"}`}>
                  <input type="checkbox" className="mt-0.5 shrink-0 accent-[#2E7D6B] w-4 h-4" checked={form.sklIds.includes(s.id)} onChange={() => toggleSkl(s.id)} />
                  <div>
                    <p className="text-sm font-semibold text-[#1F3A3D] leading-tight">{s.label}</p>
                    <p className="text-xs text-[#6B7A78] mt-0.5 leading-snug">{s.text}</p>
                  </div>
                </label>
              ))}
            </div>
            <TextArea rows={2} value={form.skl} onChange={(e) => updateForm({ skl: e.target.value })} placeholder="(Opsional) Tambahkan catatan SKL lain secara manual..." />
          </Field>

          <Field label="Sarana & Prasarana" hint="Pilih alat/bahan yang digunakan dalam pembelajaran ini.">
            <div className="flex flex-wrap gap-2">
              {SARANA_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleSarana(item)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    form.sarana.includes(item)
                      ? "bg-[#2E7D6B] text-white border-[#2E7D6B]"
                      : "bg-white text-[#4A5A57] border-[#D8DCD4] hover:border-[#2E7D6B] hover:text-[#2E7D6B]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            {form.sarana.length > 0 && (
              <p className="text-xs text-[#6B7A78] mt-2">Terpilih: {form.sarana.join(", ")}</p>
            )}
          </Field>

          <Field label="Metode / Model Pembelajaran" required>
            <Select value={form.metode} onChange={(e) => updateForm({ metode: e.target.value })}>
              {METODE_LIST.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </Select>
          </Field>
        </div>
      )}

      <div className="bg-white rounded-xl border-2 border-[#2E7D6B]/30 p-4 sm:p-5 mb-8">
        <Btn
          onClick={buatModulLengkap}
          disabled={!canGenerate}
          className="w-full text-base py-3"
        >
          <Sparkles size={18} />
          Buat Modul Ajar Lengkap dengan AI
        </Btn>
        {!canGenerate ? (
          <p className="text-xs text-[#6B7A78] mt-2.5 text-center">Lengkapi elemen, TP, materi, dan pilih minimal 1 SKL untuk mengaktifkan tombol ini.</p>
        ) : (
          <p className="text-xs text-[#6B7A78] mt-2.5 text-center">AI akan menyusun kegiatan inti, asesmen, LKPD, dan rubrik sekaligus — dokumen langsung siap diunduh.</p>
        )}
      </div>
    </div>
  );
}

function ModulActionBar({ modul, onBack, backLabel }) {
  const [downloading, setDownloading] = useState(false);
  const handleDownloadDocx = async () => {
    setDownloading(true);
    try {
      downloadDocx(modul);
    } catch (e) {
      alert("Gagal membuat file Word: " + e.message);
    } finally {
      setDownloading(false);
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-2 mb-5 print:hidden">
      <Btn variant="ghost" onClick={onBack}><ArrowLeft size={16} /> {backLabel}</Btn>
      <div className="flex-1" />
      <Btn variant="secondary" onClick={() => window.print()}><Printer size={16} /> Cetak / PDF</Btn>
      <Btn onClick={handleDownloadDocx} disabled={downloading}>
        {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        Unduh Word (.docx)
      </Btn>
    </div>
  );
}

/* ============================================================
   TAB 3: DAFTAR MODUL AJAR TERSIMPAN
============================================================ */

function DaftarModul({ moduls, setModuls, openId, setOpenId }) {
  const deleteModul = async (id) => {
    const updated = moduls.filter((m) => m.id !== id);
    setModuls(updated);
    await saveList(STORAGE_KEYS.moduls, updated);
    if (openId === id) setOpenId(null);
  };

  const openModul = moduls.find((m) => m.id === openId);

  if (openModul) {
    return <ModulDetail modul={openModul} onBack={() => setOpenId(null)} />;
  }

  if (moduls.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="Belum ada modul ajar tersimpan"
        desc='Buka tab "Buat Modul Ajar" untuk menyusun modul ajar pertamamu.'
      />
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {moduls.map((m) => (
        <button
          key={m.id}
          onClick={() => setOpenId(m.id)}
          className="text-left bg-white rounded-xl border border-[#E4E1D6] p-4 hover:border-[#2E7D6B]/50 hover:shadow-sm transition group relative"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Badge tone="ink">Fase {m.cpFase}</Badge>
            <Badge>{m.metodeLabel.split(" (")[1]?.replace(")", "") || m.metodeLabel}</Badge>
          </div>
          <h4 className="font-serif font-bold text-[#1F3A3D] mb-1 line-clamp-2">{m.materi}</h4>
          <p className="text-xs text-[#6B7A78] mb-3">{m.cpElemen}</p>
          <div className="flex items-center gap-3 text-xs text-[#6B7A78]">
            <span className="flex items-center gap-1"><Clock size={12} /> {m.pertemuan}x{m.jp} JP</span>
            <span className="flex items-center gap-1"><Target size={12} /> {m.tpTexts?.length || 0} TP</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); deleteModul(m.id); }}
            className="absolute top-3 right-3 p-1.5 rounded-md text-[#9AA6A0] opacity-0 group-hover:opacity-100 hover:text-[#B4552F] hover:bg-[#FBEDE4] transition"
          >
            <Trash2 size={14} />
          </button>
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   EXPORT KE WORD (.doc via HTML — bisa dibuka & diedit di MS Word)
============================================================ */

function esc(s) {
  if (s === undefined || s === null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildModulHtml(modul) {
  const faseLabel = FASE_LIST.find((f) => f.id === modul.cpFase)?.label || modul.cpFase;
  const id = modul.identitas || {};

  const tpItems = (modul.tpTexts || []).map((t) => `<li>${esc(t)}</li>`).join("");

  const kegiatanRows = (modul.kegiatanInti || [])
    .map(
      (k, i) => `
      <tr style="background:${i % 2 === 0 ? "#fff" : "#F9F9F7"}">
        <td style="border:1px solid #999;padding:6px;font-weight:bold;vertical-align:top;width:150px;">${i + 1}. ${esc(k.tahap)}</td>
        <td style="border:1px solid #999;padding:6px;vertical-align:top;">${esc(k.kegiatanGuru || k.deskripsi || "-")}</td>
        <td style="border:1px solid #999;padding:6px;vertical-align:top;">${esc(k.kegiatanMurid || "-")}</td>
        <td style="border:1px solid #999;padding:6px;color:#666;white-space:nowrap;vertical-align:top;width:80px;">${esc(k.alokasi)}</td>
      </tr>`
    )
    .join("");
  const kegiatanHtml = `
    <table style="border-collapse:collapse;width:100%;font-size:10pt;">
      <tr style="background:#1F3A3D;color:#fff;">
        <th style="border:1px solid #999;padding:6px;text-align:left;">Tahap Sintak</th>
        <th style="border:1px solid #999;padding:6px;text-align:left;">Kegiatan Guru</th>
        <th style="border:1px solid #999;padding:6px;text-align:left;">Kegiatan Peserta Didik</th>
        <th style="border:1px solid #999;padding:6px;text-align:left;">Alokasi</th>
      </tr>
      ${kegiatanRows}
    </table>`;

  const prosesItems = (modul.asesmen?.proses || []).map((p) => `<li>${esc(p)}</li>`).join("");
  const soalItems = (modul.asesmen?.akhir?.soal || []).map((s) => `<li>${esc(s)}</li>`).join("");
  const langkahItems = (modul.lkpd?.langkah || []).map((l) => `<li>${esc(l)}</li>`).join("");

  const rubrikRows = (modul.rubrik?.kriteria || [])
    .map(
      (k) => `
      <tr>
        <td style="border:1px solid #999;padding:6px;"><b>${esc(k.aspek)}</b></td>
        <td style="border:1px solid #999;padding:6px;">${esc(k.sangatBaik)}</td>
        <td style="border:1px solid #999;padding:6px;">${esc(k.baik)}</td>
        <td style="border:1px solid #999;padding:6px;">${esc(k.cukup)}</td>
        <td style="border:1px solid #999;padding:6px;">${esc(k.perluBimbingan)}</td>
      </tr>`
    )
    .join("");

  return `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8">
    <title>${esc(modul.materi)}</title>
    <!--[if gte mso 9]>
    <xml>
      <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
      </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1a1a1a; }
      h1 { font-size: 16pt; text-align:center; margin-bottom: 2px; }
      .eyebrow { text-align:center; font-size:9pt; letter-spacing:1px; color:#2E7D6B; font-weight:bold; text-transform:uppercase; }
      h2 { font-size: 13pt; border-bottom: 1px solid #999; padding-bottom: 3px; margin-top: 22px; }
      table.identitas td { padding: 2px 6px 2px 0; vertical-align: top; }
      table.rubrik { border-collapse: collapse; width:100%; font-size:9.5pt; margin-top:6px;}
      table.rubrik th { background:#F4F1E8; border:1px solid #999; padding:6px; text-align:left; }
      ol, ul { margin-top:4px; }
    </style>
  </head>
  <body>
    <p class="eyebrow">Modul Ajar &mdash; Kurikulum Merdeka</p>
    <h1>${esc(modul.materi)}</h1>
    <br/>
    <table class="identitas">
      <tr><td width="180"><b>Nama Sekolah</b></td><td>: ${esc(id.namaSekolah)}</td></tr>
      <tr><td><b>Penyusun</b></td><td>: ${esc(id.penyusun)}</td></tr>
      <tr><td><b>Program / Kelas</b></td><td>: ${esc(id.kelas)}</td></tr>
      <tr><td><b>Tahun Ajaran</b></td><td>: ${esc(id.tahunAjaran)}</td></tr>
      <tr><td><b>Fase / Elemen</b></td><td>: ${esc(faseLabel)} &mdash; ${esc(modul.cpElemen)}</td></tr>
      <tr><td><b>Pertemuan / JP</b></td><td>: ${esc(modul.pertemuan)} kali pertemuan, @ ${esc(modul.jp)} JP</td></tr>
      <tr><td><b>Model Pembelajaran</b></td><td>: ${esc(modul.metodeLabel)}</td></tr>
      ${modul.sarana?.length ? `<tr><td><b>Sarana &amp; Prasarana</b></td><td>: ${esc((modul.sarana || []).join(", "))}</td></tr>` : ""}
    </table>

    <h2 style="border:none;margin-top:16px;">Capaian Pembelajaran (CP)</h2>
    <p>${esc(modul.cpText)}</p>
    <p><b>Standar Kompetensi Lulusan (SKL) Terkait</b></p>
    <p>${esc(modul.skl)}</p>

    <h2>A. Tujuan Pembelajaran</h2>
    <ol>${tpItems}</ol>

    <h2>B. Kegiatan Inti <span style="font-weight:normal;font-size:10pt;color:#6B7A78;">(Sintak ${esc(modul.metodeLabel)})</span></h2>
    ${kegiatanHtml}

    <h2>C. Asesmen</h2>
    <p><b>Asesmen Awal (Diagnostik)</b></p>
    <p>${esc(modul.asesmen?.awal)}</p>
    <p><b>Asesmen Proses (Formatif)</b></p>
    <ul>${prosesItems}</ul>
    <p><b>Asesmen Akhir (Sumatif) &mdash; ${esc(modul.asesmen?.akhir?.jenis)}</b></p>
    <ol>${soalItems}</ol>

    <h2>Lampiran 1 &mdash; LKPD: ${esc(modul.lkpd?.judul)}</h2>
    <p><i>${esc(modul.lkpd?.petunjuk)}</i></p>
    <ol>${langkahItems}</ol>

    <h2>Lampiran 2 &mdash; Rubrik Penilaian KKTP</h2>
    <p>${esc(modul.rubrik?.kktp)}</p>
    <table class="rubrik">
      <tr>
        <th>Aspek</th><th>Sangat Baik</th><th>Baik</th><th>Cukup</th><th>Perlu Bimbingan</th>
      </tr>
      ${rubrikRows}
    </table>
  </body>
  </html>`;
}

function downloadDocx(modul) {
  const html = buildModulHtml(modul);
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeName = (modul.materi || "modul-ajar").replace(/[^a-z0-9\-_ ]/gi, "").trim().slice(0, 60) || "modul-ajar";
  a.href = url;
  a.download = `Modul Ajar - ${safeName}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ============================================================
   DETAIL MODUL AJAR — TAMPILAN PRINT + DOWNLOAD
============================================================ */

function ModulPreview({ modul }) {
  const faseLabel = FASE_LIST.find((f) => f.id === modul.cpFase)?.label || modul.cpFase;
  return (
    <div id="modul-print-area" className="bg-white rounded-xl border border-[#E4E1D6] p-5 sm:p-8 md:p-10 max-w-3xl mx-auto print:border-0 print:rounded-none print:shadow-none print:p-0 print:max-w-none">
      {/* IDENTITAS */}
      <div className="text-center border-b-2 border-[#1F3A3D] pb-5 mb-6">
        <p className="text-xs font-bold tracking-widest text-[#2E7D6B] uppercase mb-1">Modul Ajar — Kurikulum Merdeka</p>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1F3A3D]">{modul.materi}</h1>
      </div>

      <table className="w-full text-sm mb-8">
        <tbody>
          <tr><td className="py-1 pr-3 font-semibold text-[#1F3A3D] w-40 align-top">Nama Sekolah</td><td className="py-1 text-[#4A5A57]">: {modul.identitas?.namaSekolah || "-"}</td></tr>
          <tr><td className="py-1 pr-3 font-semibold text-[#1F3A3D] align-top">Penyusun</td><td className="py-1 text-[#4A5A57]">: {modul.identitas?.penyusun || "-"}</td></tr>
          <tr><td className="py-1 pr-3 font-semibold text-[#1F3A3D] align-top">Program / Kelas</td><td className="py-1 text-[#4A5A57]">: {modul.identitas?.kelas || "-"}</td></tr>
          <tr><td className="py-1 pr-3 font-semibold text-[#1F3A3D] align-top">Tahun Ajaran</td><td className="py-1 text-[#4A5A57]">: {modul.identitas?.tahunAjaran || "-"}</td></tr>
          <tr><td className="py-1 pr-3 font-semibold text-[#1F3A3D] align-top">Fase / Elemen</td><td className="py-1 text-[#4A5A57]">: {faseLabel} — {modul.cpElemen}</td></tr>
          <tr><td className="py-1 pr-3 font-semibold text-[#1F3A3D] align-top">Pertemuan / JP</td><td className="py-1 text-[#4A5A57]">: {modul.pertemuan} kali pertemuan, @ {modul.jp} JP</td></tr>
          <tr><td className="py-1 pr-3 font-semibold text-[#1F3A3D] align-top">Model Pembelajaran</td><td className="py-1 text-[#4A5A57]">: {modul.metodeLabel}</td></tr>
          {modul.sarana?.length > 0 && (
            <tr><td className="py-1 pr-3 font-semibold text-[#1F3A3D] align-top">Sarana & Prasarana</td><td className="py-1 text-[#4A5A57]">: {modul.sarana.join(", ")}</td></tr>
          )}
        </tbody>
      </table>

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-wide text-[#1F3A3D] mb-1.5">Capaian Pembelajaran (CP)</p>
        <p className="text-sm text-[#4A5A57] mb-4">{modul.cpText}</p>
        <p className="text-xs font-bold uppercase tracking-wide text-[#1F3A3D] mb-1.5">Standar Kompetensi Lulusan (SKL) Terkait</p>
        <p className="text-sm text-[#4A5A57]">{modul.skl}</p>
      </div>

      {/* TUJUAN PEMBELAJARAN — WAJIB */}
      <section className="mb-8">
        <h2 className="font-serif text-lg font-bold text-[#1F3A3D] border-b border-[#D8DCD4] pb-1.5 mb-3">A. Tujuan Pembelajaran</h2>
        <ol className="list-decimal list-inside space-y-1.5 text-sm text-[#1F3A3D]">
          {modul.tpTexts?.map((t, i) => <li key={i}>{t}</li>)}
        </ol>
      </section>

      {/* KEGIATAN INTI — tabel 2 kolom */}
      <section className="mb-8">
        <h2 className="font-serif text-lg font-bold text-[#1F3A3D] border-b border-[#D8DCD4] pb-1.5 mb-3">
          B. Kegiatan Inti <span className="font-sans text-xs font-normal text-[#6B7A78]">(Sintak {modul.metodeLabel})</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-[#D8DCD4]">
            <thead>
              <tr className="bg-[#1F3A3D] text-white">
                <th className="p-2.5 text-left font-semibold border border-[#D8DCD4] w-44">Tahap Sintak</th>
                <th className="p-2.5 text-left font-semibold border border-[#D8DCD4]">Kegiatan Guru</th>
                <th className="p-2.5 text-left font-semibold border border-[#D8DCD4]">Kegiatan Peserta Didik</th>
                <th className="p-2.5 text-left font-semibold border border-[#D8DCD4] w-24">Alokasi</th>
              </tr>
            </thead>
            <tbody>
              {modul.kegiatanInti?.map((k, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#FAF9F4]"}>
                  <td className="p-2.5 border border-[#D8DCD4] font-semibold text-[#1F3A3D] align-top">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2E7D6B] text-white text-xs font-bold mr-1.5 shrink-0">{i + 1}</span>
                    {k.tahap}
                  </td>
                  <td className="p-2.5 border border-[#D8DCD4] text-[#4A5A57] align-top">
                    {/* Support format lama (deskripsi) dan format baru (kegiatanGuru) */}
                    {k.kegiatanGuru || k.deskripsi || "-"}
                  </td>
                  <td className="p-2.5 border border-[#D8DCD4] text-[#4A5A57] align-top">
                    {k.kegiatanMurid || "-"}
                  </td>
                  <td className="p-2.5 border border-[#D8DCD4] text-[#6B7A78] text-xs align-top whitespace-nowrap">{k.alokasi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ASESMEN — WAJIB */}
      <section className="mb-8">
        <h2 className="font-serif text-lg font-bold text-[#1F3A3D] border-b border-[#D8DCD4] pb-1.5 mb-3">C. Asesmen</h2>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-semibold text-[#1F3A3D]">Asesmen Awal (Diagnostik)</p>
            <p className="text-[#4A5A57]">{modul.asesmen?.awal}</p>
          </div>
          <div>
            <p className="font-semibold text-[#1F3A3D]">Asesmen Proses (Formatif)</p>
            <ul className="list-disc list-inside text-[#4A5A57]">
              {modul.asesmen?.proses?.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[#1F3A3D]">Asesmen Akhir (Sumatif) — {modul.asesmen?.akhir?.jenis}</p>
            <ol className="list-decimal list-inside text-[#4A5A57]">
              {modul.asesmen?.akhir?.soal?.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        </div>
      </section>

      {/* LKPD */}
      {modul.lkpd && (
        <section className="mb-8 break-inside-avoid">
          <h2 className="font-serif text-lg font-bold text-[#1F3A3D] border-b border-[#D8DCD4] pb-1.5 mb-3">Lampiran 1 — LKPD: {modul.lkpd.judul}</h2>
          <p className="text-sm italic text-[#4A5A57] mb-2">{modul.lkpd.petunjuk}</p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-[#1F3A3D]">
            {modul.lkpd.langkah?.map((l, i) => <li key={i}>{l}</li>)}
          </ol>
        </section>
      )}

      {/* RUBRIK */}
      {modul.rubrik && (
        <section className="break-inside-avoid">
          <h2 className="font-serif text-lg font-bold text-[#1F3A3D] border-b border-[#D8DCD4] pb-1.5 mb-3">Lampiran 2 — Rubrik Penilaian KKTP</h2>
          <p className="text-sm text-[#4A5A57] mb-3">{modul.rubrik.kktp}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-[#D8DCD4]">
              <thead>
                <tr className="bg-[#F4F1E8]">
                  <th className="p-2 text-left font-semibold border border-[#D8DCD4]">Aspek</th>
                  <th className="p-2 text-left font-semibold border border-[#D8DCD4]">Sangat Baik</th>
                  <th className="p-2 text-left font-semibold border border-[#D8DCD4]">Baik</th>
                  <th className="p-2 text-left font-semibold border border-[#D8DCD4]">Cukup</th>
                  <th className="p-2 text-left font-semibold border border-[#D8DCD4]">Perlu Bimbingan</th>
                </tr>
              </thead>
              <tbody>
                {modul.rubrik.kriteria?.map((k, i) => (
                  <tr key={i}>
                    <td className="p-2 border border-[#D8DCD4] font-medium">{k.aspek}</td>
                    <td className="p-2 border border-[#D8DCD4]">{k.sangatBaik}</td>
                    <td className="p-2 border border-[#D8DCD4]">{k.baik}</td>
                    <td className="p-2 border border-[#D8DCD4]">{k.cukup}</td>
                    <td className="p-2 border border-[#D8DCD4]">{k.perluBimbingan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function ModulDetail({ modul, onBack }) {
  return (
    <div>
      <ModulActionBar modul={modul} onBack={onBack} backLabel="Kembali ke daftar" />
      <ModulPreview modul={modul} />
    </div>
  );
}

/* ============================================================
   APP UTAMA
============================================================ */

export default function ModulAjarApp() {
  const [tab, setTab] = useState("cp"); // cp | generator | daftar
  const [loading, setLoading] = useState(true);
  const [cpBank, setCpBank] = useState([]);
  const [tpBank, setTpBank] = useState([]);
  const [moduls, setModuls] = useState([]);
  const [openModulId, setOpenModulId] = useState(null);
  const [identitas, setIdentitasState] = useState({
    namaSekolah: "SMK Al-Intisab Pabuaran",
    penyusun: "",
    kelas: "",
    tahunAjaran: "2026/2027",
  });

  useEffect(() => {
    (async () => {
      const [cp, tp, mods, ident] = await Promise.all([
        loadList(STORAGE_KEYS.cpBank),
        loadList(STORAGE_KEYS.tpBank),
        loadList(STORAGE_KEYS.moduls),
        loadObj(STORAGE_KEYS.identitas, null),
      ]);
      setCpBank(cp);
      setTpBank(tp);
      setModuls(mods);
      if (ident) setIdentitasState(ident);
      setLoading(false);
    })();
  }, []);

  const setIdentitas = (val) => {
    setIdentitasState(val);
    saveObj(STORAGE_KEYS.identitas, val);
  };

  const tabs = [
    { id: "cp", label: "Bank CP & TP", icon: Layers },
    { id: "generator", label: "Buat Modul Ajar", icon: FileText },
    { id: "daftar", label: "Modul Tersimpan", icon: FolderOpen, count: moduls.length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F4]">
        <Loader2 className="animate-spin text-[#2E7D6B]" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F4]">
      {/* HEADER */}
      <header className="border-b border-[#E4E1D6] bg-white print:hidden">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#1F3A3D] flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-[#1F3A3D] leading-tight">Generator Modul Ajar</h1>
              <p className="text-[11px] text-[#6B7A78] leading-tight">Kurikulum Merdeka — Fase A–F</p>
            </div>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-5 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); if (t.id !== "daftar") setOpenModulId(null); }}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                tab === t.id ? "border-[#2E7D6B] text-[#1F3A3D]" : "border-transparent text-[#6B7A78] hover:text-[#1F3A3D]"
              }`}
            >
              <t.icon size={15} /> {t.label}
              {typeof t.count === "number" && t.count > 0 && (
                <span className="ml-0.5 text-xs bg-[#EDEBDF] text-[#6B7A78] rounded-full px-1.5">{t.count}</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-5 py-5 sm:py-6">
        {tab === "cp" && (
          <BankCPTP cpBank={cpBank} setCpBank={setCpBank} tpBank={tpBank} setTpBank={setTpBank} />
        )}
        {tab === "generator" && (
          <GeneratorModul
            cpBank={cpBank} tpBank={tpBank} setTpBank={setTpBank} moduls={moduls} setModuls={setModuls}
            identitas={identitas} setIdentitas={setIdentitas}
            onOpenModul={(id) => { setOpenModulId(id); setTab("daftar"); }}
          />
        )}
        {tab === "daftar" && (
          <DaftarModul moduls={moduls} setModuls={setModuls} openId={openModulId} setOpenId={setOpenModulId} />
        )}
      </main>
    </div>
  );
}
