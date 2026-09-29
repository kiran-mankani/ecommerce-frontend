import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useProfile from "../../hooks/useProfile";
import { fetchProfileThunk } from "../../store/slices/userSlice";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import ProfileCard from "../../components/customer/ProfileCard";
import ProfileForm from "../../components/customer/ProfileForm";
import ChangePasswordForm from "../../components/customer/ChangePasswordForm";

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useProfile();

  useEffect(() => {
    dispatch(fetchProfileThunk());
  }, [dispatch]);

  if (loading && !profile) return <Loader size="lg" />;
  if (error && !profile)
    return (
      <ErrorState
        message={error}
        onRetry={() => dispatch(fetchProfileThunk())}
      />
    );

  if (!profile) return <Loader size="lg" />;

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text)" }}
        >
          My Profile
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Manage your account information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <ProfileCard user={profile} />

        <div className="space-y-6">
          <ProfileForm initialData={profile} />

          <div className="pt-2">
            <div
              className="mb-4 flex items-center gap-3"
              style={{ color: "var(--color-text)" }}
            >
              <h2 className="text-lg font-bold">Settings</h2>
              <span
                className="h-px flex-1"
                style={{ backgroundColor: "var(--color-divider)" }}
              />
            </div>
            <p
              className="mb-4 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Update your password to keep your account secure.
            </p>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;