import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Check,
  RefreshCw,
  FolderOpen,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api.ts';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  placeholder?: string;
  aspectRatio?: 'video' | 'landscape' | 'square' | 'portrait' | 'auto';
  showPresets?: boolean;
  required?: boolean;
  className?: string;
}

const DEFAULT_PRESETS = [
  {
    label: 'Gedung SMAN 1 Julok',
    url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&h=700&q=80',
  },
  {
    label: 'Prestasi Siswa',
    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&h=700&q=80',
  },
  {
    label: 'Pembelajaran Kelas',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&h=700&q=80',
  },
  {
    label: 'Laboratorium Komputer',
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&h=700&q=80',
  },
  {
    label: 'Upacara Bendera',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&h=700&q=80',
  },
  {
    label: 'Kegiatan Rohis / Maulid',
    url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&h=700&q=80',
  },
];

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label = 'Gambar / Foto',
  helperText,
  placeholder = 'Pilih file dari perangkat atau masukkan URL...',
  aspectRatio = 'video',
  showPresets = true,
  required = false,
  className = '',
}) => {
  const [tab, setTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Hanya berkas gambar (JPG, PNG, WEBP, GIF, SVG) yang diperbolehkan.');
      return;
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran berkas gambar maksimal 10MB.');
      return;
    }

    setUploading(true);
    setUploadStatus('Membaca berkas gambar...');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        // Immediate local preview
        onChange(base64);
        setUrlInput(base64);

        setUploadStatus('Mengunggah ke server sekolah...');
        try {
          const res = await api.uploadFile(base64, file.name, file.type);
          onChange(res.url);
          setUrlInput(res.url);
          setUploadStatus('✓ Berhasil diunggah!');
          setTimeout(() => setUploadStatus(null), 3000);
        } catch (uploadErr) {
          // If server upload has transient issue, base64 still works!
          setUploadStatus('✓ Gambar tersimpan lokal');
          setTimeout(() => setUploadStatus(null), 3000);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setUploading(false);
      setUploadStatus('Gagal memproses gambar');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const ratioClass = {
    video: 'aspect-video',
    landscape: 'aspect-video',
    square: 'aspect-square max-w-[280px]',
    portrait: 'aspect-[3/4] max-w-[280px]',
    auto: 'min-h-[160px] max-h-[300px]',
  }[aspectRatio];

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header Label and Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-semibold border border-slate-200">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
              tab === 'upload'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3 h-3" /> Unggah File
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
              tab === 'url'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3 h-3" /> Input URL
          </button>
          {showPresets && (
            <button
              type="button"
              onClick={() => setTab('presets')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                tab === 'presets'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" /> Galeri Pilihan
            </button>
          )}
        </div>
      </div>

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}

      {/* Mode 1: File Upload Dropzone */}
      {tab === 'upload' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 sm:p-6 transition text-center flex flex-col items-center justify-center gap-2 group ${
              dragActive
                ? 'border-blue-500 bg-blue-50/70'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/70 hover:bg-slate-100/60'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition shadow-xs">
              {uploading ? (
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {uploading
                  ? 'Sedang Memproses Gambar...'
                  : 'Klik untuk pilih foto dari perangkat atau Tarik & Lepas (Drag & Drop)'}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Mendukung PNG, JPG, JPEG, WEBP, SVG (Maks. 10MB)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Direct URL Input */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Check className="w-3.5 h-3.5" /> Pasang
          </button>
        </div>
      )}

      {/* Mode 3: Presets Selection */}
      {tab === 'presets' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl max-h-48 overflow-y-auto">
          {DEFAULT_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(preset.url);
                setUrlInput(preset.url);
              }}
              className="text-left group rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 transition relative"
            >
              <img
                src={preset.url}
                alt={preset.label}
                className="w-full h-16 object-cover group-hover:scale-105 transition"
              />
              <span className="block p-1 text-[10px] font-semibold text-slate-700 bg-white truncate">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Upload status badge */}
      {uploadStatus && (
        <div className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
          <span>{uploadStatus}</span>
        </div>
      )}

      {/* Active Preview Box */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group shadow-sm mt-2">
          <img
            src={value}
            alt="Preview"
            className={`w-full ${ratioClass} object-cover`}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-between p-3">
            <span className="text-[10px] text-white/90 font-mono bg-black/60 px-2 py-0.5 rounded truncate max-w-[70%]">
              {value.startsWith('data:') ? 'Berkas Unggahan Lokal' : value}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-lg text-xs font-bold transition shadow-xs"
                title="Ganti Foto"
              >
                <FolderOpen className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                title="Hapus Gambar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-2 px-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-500 text-[11px] flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>Belum ada gambar yang dipilih atau diunggah.</span>
        </div>
      )}
    </div>
  );
};
