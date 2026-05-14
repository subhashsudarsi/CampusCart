export default function PendingStudentApprovals({
  loading,
  pendingRequests,
  actionStudentId,
  onApprove,
  onReject
}) {
  return (
    <section className="bg-white rounded-xl shadow border border-gray-100">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Pending Student Approvals</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {loading ? (
          <p className="p-5 text-gray-500">Loading pending requests...</p>
        ) : pendingRequests.length === 0 ? (
          <p className="p-5 text-gray-500">No pending student signup requests.</p>
        ) : (
          pendingRequests.map((request) => {
            const isBusy = actionStudentId === request.id

            return (
              <div key={request.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{request.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{request.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Requested: {new Date(request.requestedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => onApprove(request.id)}
                    className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBusy ? 'Working...' : 'Approve'}
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => onReject(request.id)}
                    className="px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBusy ? 'Working...' : 'Reject'}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
