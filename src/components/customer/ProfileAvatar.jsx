const ProfileAvatar = ({ name = "", image = "", size = 96 }) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (image) {
    return (
      <img
        src={image}
        alt={name || "user"}
        style={{ width: size, height: size }}
        className="rounded-full border-2 object-cover"
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(160deg, var(--color-brand-gradient-start) 0%, var(--color-brand-gradient-end) 100%)",
      }}
      className="flex items-center justify-center rounded-full border-2 text-xl font-bold text-white"
    >
      {initials || "U"}
    </div>
  );
};

export default ProfileAvatar;