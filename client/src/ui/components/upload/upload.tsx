"use client";
/* Optimistic UI · Upload · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./upload.css";
export interface UploadProps { onFiles?: (files: File[]) => void; accept?: string; multiple?: boolean; label?: React.ReactNode; }
export const Upload = ({ onFiles, accept, multiple = true, label }: UploadProps) => {
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handle = (files: FileList | null) => { if (files && files.length) onFiles?.(Array.from(files)); };
  return (
    <div className={`o-upload${drag ? " o-upload--drag" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} hidden onChange={(e) => handle(e.target.files)} />
      <svg className="o-upload__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 15V4m0 0L8 8m4-4l4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div className="o-upload__text">{label || <>Drag files here or <span className="o-upload__link">browse</span></>}</div>
    </div>
  );
};
Upload.displayName = "Upload";
