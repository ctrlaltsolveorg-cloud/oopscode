"use client";

import { useState } from "react";
import { Upload, Link as LinkIcon, Copy, Check, ImageIcon } from "lucide-react";
import { uploadImage } from "./actions/upload";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResultUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      setResultUrl(result.url);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (resultUrl) {
      navigator.clipboard.writeText(resultUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            imgtolink
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Upload an image and get a link instantly.
          </p>
        </div>

        <div className="space-y-6">
          {!resultUrl ? (
            <div className="space-y-4">
              <label
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                  ${
                    file
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
                      : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50"
                  }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                    <>
                      <ImageIcon className="w-12 h-12 text-blue-500 mb-4" />
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {file.name}
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-zinc-400 mb-4" />
                      <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        PNG, JPG, GIF or WebP (Max. 200MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultUrl}
                  alt="Uploaded"
                  className="w-full h-64 object-contain bg-zinc-100 dark:bg-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Your Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={resultUrl}
                    className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="p-3 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg transition-colors hover:opacity-90 flex items-center gap-2"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setResultUrl(null);
                  setFile(null);
                }}
                className="w-full py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Upload another image
              </button>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 text-center animate-in fade-in duration-300">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
