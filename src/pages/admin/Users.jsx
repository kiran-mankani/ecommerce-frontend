import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FiSearch } from "react-icons/fi";
import useAdminUsers from "../../hooks/useAdminUsers";
import { fetchAdminUsersThunk } from "../../store/slices/adminUserSlice";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";

const resolveImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const apiBase =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
  const origin = apiBase.replace(/\/api\/v1\/?$/, "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
};

const UserRowAvatar = ({ user }) => {
  const [errored, setErrored] = useState(false);
  const path = user?.profile?.profileImage;
  const src = resolveImageUrl(path);
  const initials = (user?.name || "U")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src && !errored) {
    return (
      <img
        src={src}
        alt={user?.name || "user"}
        loading="lazy"
        onError={() => setErrored(true)}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
        style={{ border: "1px solid var(--color-border)" }}
      />
    );
  }

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{
        background:
          "linear-gradient(160deg, var(--color-brand-gradient-start) 0%, var(--color-brand-gradient-end) 100%)",
      }}
    >
      {initials}
    </div>
  );
};

const Users = () => {
  const dispatch = useDispatch();
  const { list, pagination, loading, error } = useAdminUsers();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = () => {
    dispatch(fetchAdminUsersThunk({ page, limit: 10 }));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filtered = search.trim()
    ? list.filter((u) => {
        const q = search.trim().toLowerCase();
        return (
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q)
        );
      })
    : list;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-xl font-bold sm:text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Users
          </h1>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            All customers and admins registered on your store
          </p>
        </div>
        <div
          className="w-fit rounded-lg border px-3 py-2 text-xs sm:text-sm"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-text)",
          }}
        >
          Total: <strong>{pagination.total}</strong>
        </div>
      </div>

      <div className="relative max-w-md">
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2"
          size={16}
          style={{ color: "var(--color-text-muted)" }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-input-border)",
            color: "var(--color-text)",
          }}
        />
      </div>

      {loading && list.length === 0 ? (
        <Loader size="lg" />
      ) : error && list.length === 0 ? (
        <ErrorState message={error} onRetry={load} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No users found"
          message="Try adjusting the search."
        />
      ) : (
        <>
          <div
            className="overflow-hidden rounded-xl border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead
                  style={{
                    backgroundColor: "var(--color-surface-alt)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <tr>
                    <th className="hidden px-3 py-3 font-semibold sm:table-cell md:px-4">
                      Avatar
                    </th>
                    <th className="px-3 py-3 font-semibold md:px-4">Name</th>
                    <th className="hidden px-3 py-3 font-semibold md:table-cell md:px-4">
                      Email
                    </th>
                    <th className="px-3 py-3 font-semibold md:px-4">Role</th>
                    <th className="hidden px-3 py-3 font-semibold sm:table-cell md:px-4">
                      Verified
                    </th>
                    <th className="hidden px-3 py-3 font-semibold lg:table-cell md:px-4">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr
                      key={u._id}
                      className="border-t transition hover:bg-slate-50"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <td className="hidden px-3 py-3 sm:table-cell md:px-4">
                        <UserRowAvatar user={u} />
                      </td>
                      <td
                        className="px-3 py-3 md:px-4"
                        style={{ color: "var(--color-text)" }}
                      >
                        <div className="font-medium">{u.name}</div>
                        <div
                          className="break-all text-xs md:hidden"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {u.email}
                        </div>
                      </td>
                      <td
                        className="hidden px-3 py-3 md:table-cell md:px-4"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <div className="break-all">{u.email}</div>
                      </td>
                      <td className="px-3 py-3 md:px-4">
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                          style={{
                            backgroundColor:
                              u.role === "admin"
                                ? "rgba(37, 99, 235, 0.12)"
                                : "rgba(100, 116, 139, 0.12)",
                            color:
                              u.role === "admin"
                                ? "var(--color-primary)"
                                : "var(--color-text-muted)",
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td
                        className="hidden px-3 py-3 sm:table-cell md:px-4"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {u.isVerified ? "✅" : "⏳"}
                      </td>
                      <td
                        className="hidden px-3 py-3 text-xs lg:table-cell md:px-4"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pagination.pages > 1 && (
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p
                className="text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                Page {pagination.page} of {pagination.pages} —{" "}
                {pagination.total} total
              </p>
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                onChange={setPage}
                disabled={loading}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Users;