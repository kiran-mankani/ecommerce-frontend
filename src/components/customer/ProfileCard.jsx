import AvatarUploader from "./AvatarUploader";

const ProfileCard = ({ user }) => {
  return (
    <div className="card flex flex-col items-center gap-3 text-center">
      <AvatarUploader
        name={user?.name}
        image={user?.profile?.profileImage}
      />

      <div>
        <h3
          className="text-lg font-bold"
          style={{ color: "var(--color-text)" }}
        >
          {user?.name || "Customer"}
        </h3>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {user?.email || ""}
        </p>
      </div>

      <span
        className="rounded-full px-3 py-1 text-xs font-semibold capitalize"
        style={{
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          color: "var(--color-primary)",
        }}
      >
        {user?.role || "customer"}
      </span>
    </div>
  );
};

export default ProfileCard;