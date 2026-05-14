import { Link } from 'react-router-dom'

export default function AdminQuickActions() {
  return (
    <aside className="bg-white rounded-xl shadow border border-gray-100 p-5">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Quick Actions</h2>
      <div className="space-y-3">
        <Link
          to="/post-listing"
          className="block w-full text-center px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          Add New Item
        </Link>
        <Link
          to="/profile"
          className="block w-full text-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Edit Profile
        </Link>
        <Link
          to="/"
          className="block w-full text-center px-4 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition"
        >
          Browse Marketplace
        </Link>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Approve new student signups before they can access messaging or post listings.
      </p>
    </aside>
  )
}
