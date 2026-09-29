import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { FiCamera, FiLoader } from "react-icons/fi";
import { uploadAvatarThunk } from "../../store/slices/userSlice";
import { setCredentials } from "../../store/slices/authSlice";

const resolveImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const apiBase =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
  const origin = apiBase.replace(/\/api\/v1\/?$/, "");

  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
};

const AvatarUploader = ({ name = "", image = "" }) => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(image);
  const [errored, setErrored] = useState(false);

  /* 🔑 The key line — reset when parent passes new image */
  useEffect(() => {
    setPreview(image);
    setErrored(false);
  }, [image]);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/^image\/(jpe?g|png|webp)$/.test(file.type)) {
      toast.error("Only JPG, PNG, or WEBP images allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setErrored(false);
    };
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const res = await dispatch(uploadAvatarThunk(file));

      if (uploadAvatarThunk.fulfilled.match(res)) {
        toast.success("Avatar updated");

        const updatedUser = res.payload.data;
        const newImagePath = updatedUser.profile.profileImage;

        setPreview(newImagePath);
        setErrored(false);

        const token = localStorage.getItem("token");
        dispatch(setCredentials({ user: updatedUser, token }));
      } else {
        toast.error(res.payload || "Upload failed");
        setPreview(image);
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const src = useMemo(() => {
    const full = resolveImageUrl(preview);
    if (!full) return "";
    if (/^data:/i.test(full)) return full;
    return `${full}?v=${encodeURIComponent(preview)}`;
  }, [preview]);

  const showImage = src && !errored;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="group relative block overflow-hidden rounded-full"
        title="Change photo"
      >
        <img
          src={src || "data:image/gif;base64,R0lGODlhAQABAAAAACw="}
          alt={name || "user"}
          onError={() => setErrored(true)}
          onLoad={() => setErrored(false)}
          className="h-28 w-28 rounded-full border-2 object-cover"
          style={{
            borderColor: "var(--color-primary)",
            display: showImage ? "block" : "none",
          }}
        />

        {!showImage && (
          <div
            className="flex h-28 w-28 items-center justify-center rounded-full border-2 text-2xl font-bold text-white"
            style={{
              borderColor: "var(--color-primary)",
              background:
                "linear-gradient(160deg, var(--color-brand-gradient-start) 0%, var(--color-brand-gradient-end) 100%)",
            }}
          >
            {initials || "U"}
          </div>
        )}

        <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100">
          {uploading ? (
            <FiLoader className="animate-spin" size={22} />
          ) : (
            <FiCamera size={22} />
          )}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={handleFile}
      />

      <p
        className="mt-2 text-center text-[11px]"
        style={{ color: "var(--color-text-muted)" }}
      >
        Click photo to change
      </p>
    </div>
  );
};

export default AvatarUploader;