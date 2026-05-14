import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { fetchProductById, submitProductReport } from '../services/productService'

export default function ProductDetail() {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [liked, setLiked] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportReason, setReportReason] = useState('spam')
  const [reportDetails, setReportDetails] = useState('')
  const [reporting, setReporting] = useState(false)
  const [reportMessage, setReportMessage] = useState('')
  const [reportError, setReportError] = useState('')

  useEffect(() => {
    let isCancelled = false

    const loadProduct = async () => {
      setLoading(true)
      setError('')

      try {
        const loadedProduct = await fetchProductById(id)

        if (!isCancelled) {
          setProduct(loadedProduct)
        }
      } catch (loadError) {
        if (!isCancelled) {
          setProduct(null)
          setError(loadError.message || 'Failed to load product')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      isCancelled = true
    }
  }, [id])

  const postedLabel = useMemo(() => {
    if (!product) {
      return ''
    }

    if (Number(product.postedDaysAgo) === 0) {
      return 'Posted today'
    }

    return `Posted ${product.postedDaysAgo} days ago`
  }, [product])

  const handleContact = () => {
    if (!product) {
      return
    }

    navigate('/messages', {
      state: {
        productId: product.id,
        productTitle: product.title,
        sellerId: product.sellerId,
        sellerName: product.seller,
      },
    })
  }

  const handleReportSubmit = async (event) => {
    event.preventDefault()

    if (!product) {
      return
    }

    if (!user?.id) {
      navigate('/login', { state: { from: `/product/${product.id}` } })
      return
    }

    setReportError('')
    setReportMessage('')
    setReporting(true)

    try {
      const response = await submitProductReport(product.id, {
        reporterId: user.id,
        reason: reportReason,
        details: reportDetails,
      })

      setReportMessage(response.message || 'Report submitted successfully.')
      setReportDetails('')
      setShowReportForm(false)
    } catch (submitError) {
      setReportError(submitError.message || 'Failed to submit report')
    } finally {
      setReporting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-600">Loading product...</div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">Product unavailable</p>
          <p className="text-gray-600 mb-6">{error || 'This listing does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          <div className="relative bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setLiked(!liked)}
              className="absolute top-4 right-4 bg-white rounded-full p-3 shadow hover:shadow-lg transition"
            >
              <svg
                className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                fill={liked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-gray-600">{postedLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-blue-600">₹{product.price}</p>
              <p className="text-green-600 font-medium capitalize">{product.category}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-700">
                <span className="text-blue-600 mr-3">•</span>
                Category: {product.category}
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-blue-600 mr-3">•</span>
                Location: {product.location || 'Not specified'}
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-blue-600 mr-3">•</span>
                Listing ID: {product.id}
              </li>
            </ul>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Seller Information</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-gray-900">{product.seller}</p>
                <p className="text-gray-600">{product.location || 'Location not provided'}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleContact}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
          >
            Interested? Text the seller
          </button>

          {reportMessage && (
            <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              {reportMessage}
            </p>
          )}

          {reportError && (
            <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
              {reportError}
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              setReportError('')
              setReportMessage('')
              setShowReportForm((currentValue) => !currentValue)
            }}
            className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            {showReportForm ? 'Cancel Report' : 'Report Listing'}
          </button>

          {showReportForm && (
            <form onSubmit={handleReportSubmit} className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
              <select
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value)}
                className="w-full mb-3 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="spam">Spam</option>
                <option value="fraud">Fraud / Scam</option>
                <option value="prohibited">Prohibited Item</option>
                <option value="misleading">Misleading Information</option>
                <option value="other">Other</option>
              </select>

              <label className="block text-sm font-medium text-gray-700 mb-2">Details (optional)</label>
              <textarea
                value={reportDetails}
                onChange={(event) => setReportDetails(event.target.value)}
                rows="3"
                maxLength={500}
                placeholder="Tell us what is wrong with this listing"
                className="w-full mb-3 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={reporting}
                className="w-full rounded-lg bg-rose-600 py-2 font-semibold text-white hover:bg-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reporting ? 'Submitting Report...' : 'Submit Report'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Safety Tips */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">Safety Tips</h3>
        <ul className="space-y-2 text-blue-900 text-sm">
          <li>• Meet in safe, public locations only</li>
          <li>• Always inspect the item before making payment</li>
          <li>• Use cash or secure payment methods</li>
          <li>• Never share personal financial details</li>
        </ul>
      </div>
    </div>
  )
}
