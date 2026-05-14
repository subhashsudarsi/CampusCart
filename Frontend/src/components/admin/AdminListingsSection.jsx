import { Link } from 'react-router-dom'

export default function AdminListingsSection({
  loading,
  displayedProducts,
  selectedUser,
  selectedUserId,
  deletingProductId,
  onClearUserFilter,
  onDeleteListing
}) {
  return (
    <section className="bg-white rounded-xl shadow border border-gray-100">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {selectedUserId ? `Listings by ${selectedUser?.name || 'User'}` : 'Recent Listings'}
        </h2>
        {selectedUserId ? (
          <button
            onClick={onClearUserFilter}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Show All Listings
          </button>
        ) : (
          <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View Marketplace
          </Link>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          <p className="p-5 text-gray-500">Loading listings...</p>
        ) : displayedProducts.length === 0 ? (
          <p className="p-5 text-gray-500">
            {selectedUserId ? 'No listings found for this user.' : 'No listings found.'}
          </p>
        ) : (
          displayedProducts.slice(0, 6).map((product) => (
            <div key={product.id} className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">{product.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {product.category} • {product.location} • Seller: {product.seller}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold text-blue-600 whitespace-nowrap">Rs {product.price}</p>
                <button
                  type="button"
                  disabled={deletingProductId === product.id}
                  onClick={() => onDeleteListing(product.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingProductId === product.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
