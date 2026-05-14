export default function AdminUsersSection({ loading, users, onSelectUser }) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-100">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Users</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {loading ? (
          <p className="p-5 text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="p-5 text-gray-500">No users found.</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {user.email} • {user.role}
                  {user.role === 'student' && user.approvalStatus ? ` (${user.approvalStatus})` : ''}
                </p>
              </div>
              <button
                onClick={() => onSelectUser(user.id)}
                className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                View Listings
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
