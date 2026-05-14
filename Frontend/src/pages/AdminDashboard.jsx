import { useEffect, useMemo, useState } from 'react'
import useAuth from '../hooks/useAuth'
import AdminStatsCards from '../components/admin/AdminStatsCards'
import AdminQuickActions from '../components/admin/AdminQuickActions'
import AdminListingsSection from '../components/admin/AdminListingsSection'
import AdminUsersSection from '../components/admin/AdminUsersSection'
import PendingStudentApprovals from '../components/admin/PendingStudentApprovals'
import { deleteProductListing } from '../services/productService'
import {
  approveStudentRequest,
  fetchAdminDashboardData,
  fetchPendingStudentRequests,
  rejectStudentRequest
} from '../services/adminService'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [userCount, setUserCount] = useState(0)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionStudentId, setActionStudentId] = useState(null)
  const [deletingProductId, setDeletingProductId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadDashboardData = async () => {
    const dashboard = await fetchAdminDashboardData()
    setProducts(dashboard.products)
    setUsers(dashboard.users)
    setUserCount(dashboard.userCount)
  }

  const loadPendingRequests = async () => {
    if (!user?.id) {
      setPendingRequests([])
      return
    }

    const requests = await fetchPendingStudentRequests(user.id)
    setPendingRequests(requests)
  }

  useEffect(() => {
    let active = true

    setLoading(true)
    setError('')

    Promise.all([loadDashboardData(), loadPendingRequests()])
      .catch((err) => {
        if (!active) {
          return
        }

        setError(err.message || 'Failed to load admin dashboard data')
        setProducts([])
        setUsers([])
        setPendingRequests([])
        setUserCount(0)
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [user?.id])

  const handleApprovalAction = async (studentId, actionType) => {
    if (!user?.id) {
      return
    }

    setActionStudentId(studentId)
    setError('')
    setMessage('')

    try {
      if (actionType === 'approve') {
        await approveStudentRequest(studentId, user.id)
        setMessage('Student signup request approved successfully')
      } else {
        await rejectStudentRequest(studentId, user.id)
        setMessage('Student signup request rejected')
      }

      await Promise.all([loadDashboardData(), loadPendingRequests()])
    } catch (err) {
      setError(err.message || 'Failed to update student signup request')
    } finally {
      setActionStudentId(null)
    }
  }

  const handleDeleteListing = async (productId) => {
    if (!user?.id) {
      return
    }

    setDeletingProductId(productId)
    setError('')
    setMessage('')

    try {
      await deleteProductListing(productId, user.id)
      setMessage('Listing deleted successfully')
      await loadDashboardData()
    } catch (err) {
      setError(err.message || 'Failed to delete listing')
    } finally {
      setDeletingProductId(null)
    }
  }

  const stats = useMemo(() => {
    const totalProducts = products.length
    const totalValue = products.reduce((accumulator, product) => accumulator + Number(product.price || 0), 0)
    const categories = new Set(products.map((product) => product.category)).size

    return { totalProducts, totalValue, categories }
  }, [products])

  const selectedUser = useMemo(
    () => users.find((item) => item.id === selectedUserId) || null,
    [users, selectedUserId]
  )

  const displayedProducts = useMemo(() => {
    if (selectedUserId === null) {
      return products
    }

    return products.filter((product) => Number(product.sellerId) === Number(selectedUserId))
  }, [products, selectedUserId])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Admin Area</p>
        <h1 className="text-3xl font-bold text-gray-900 mt-1">Welcome, {user?.name || 'Admin'}</h1>
        <p className="text-gray-600 mt-2">
          Manage marketplace activity and approve pending student signup requests.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
          {message}
        </div>
      )}

      <AdminStatsCards
        loading={loading}
        userCount={userCount}
        stats={stats}
        pendingRequestCount={pendingRequests.length}
        onClearUserFilter={() => setSelectedUserId(null)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <PendingStudentApprovals
            loading={loading}
            pendingRequests={pendingRequests}
            actionStudentId={actionStudentId}
            onApprove={(studentId) => handleApprovalAction(studentId, 'approve')}
            onReject={(studentId) => handleApprovalAction(studentId, 'reject')}
          />

          <AdminListingsSection
            loading={loading}
            selectedUser={selectedUser}
            selectedUserId={selectedUserId}
            displayedProducts={displayedProducts}
            deletingProductId={deletingProductId}
            onClearUserFilter={() => setSelectedUserId(null)}
            onDeleteListing={handleDeleteListing}
          />
        </div>

        <AdminQuickActions />
      </div>

      <AdminUsersSection
        loading={loading}
        users={users}
        onSelectUser={(id) => setSelectedUserId(id)}
      />
    </div>
  )
}
