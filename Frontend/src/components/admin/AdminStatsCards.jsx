export default function AdminStatsCards({ loading, userCount, stats, pendingRequestCount, onClearUserFilter }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <button
        type="button"
        className="bg-white rounded-xl shadow p-5 border border-gray-100 text-left hover:bg-gray-50"
        onClick={onClearUserFilter}
      >
        <p className="text-sm text-gray-500">Total Users</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : userCount}</p>
      </button>
      <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
        <p className="text-sm text-gray-500">Available Listings</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : stats.totalProducts}</p>
      </div>
      <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
        <p className="text-sm text-gray-500">Total Market Value</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : `Rs ${stats.totalValue}`}</p>
      </div>
      <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
        <p className="text-sm text-gray-500">Active Categories</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : stats.categories}</p>
      </div>
      <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
        <p className="text-sm text-gray-500">Pending Student Requests</p>
        <p className="text-3xl font-bold text-amber-600 mt-2">{loading ? '...' : pendingRequestCount}</p>
      </div>
    </div>
  )
}
