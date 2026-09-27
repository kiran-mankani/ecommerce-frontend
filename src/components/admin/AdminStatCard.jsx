// src/components/admin/AdminStatCard.jsx
const AdminStatCard = ({ title, value, icon, color = "blue" }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
    </div>
  );
};

export default AdminStatCard;