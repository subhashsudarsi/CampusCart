import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { createProductListing } from '../services/productService'

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

export default function PostListing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electronics',
    price: '',
    condition: 'good',
    location: '',
    contact: ''
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const categories = [
    'Electronics',
    'Books',
    'Furniture',
    'Sports',
    'Clothing',
    'Music',
    'Other'
  ]

  const conditions = [
    'Like New',
    'Good',
    'Fair',
    'Needs Repair'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setSubmitError('Please upload a valid image file.')
      setImagePreview(null)
      return
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setSubmitError('Image is too large. Please upload an image smaller than 5MB.')
      setImagePreview(null)
      return
    }

    setSubmitError('')
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.onerror = () => {
      setSubmitError('Could not read the selected image. Please try another file.')
      setImagePreview(null)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)

    const payload = {
      title: formData.title,
      description: `${formData.description}\n\nCondition: ${formData.condition}\nContact: ${formData.contact}`,
      category: formData.category,
      price: Number(formData.price),
      location: formData.location,
      sellerEmail: user.email,
      image: imagePreview || undefined,
    }

    try {
      await createProductListing(payload)

      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-8">
          <p className="text-gray-600 text-lg mb-4">Please login to post a listing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {user.role === 'admin' ? 'Add New Item' : 'Sell Your Item'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {submitError}
          </div>
        )}

        {/* Image Upload */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            Item Photo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-input"
            />
            <label htmlFor="image-input" className="cursor-pointer">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
              ) : (
                <div>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-14-6l-4 4m0 0l-4-4m4 4v12m12-26l-4 4m4-4l4 4"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-gray-600">Click to upload a photo</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Item Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., MacBook Pro 2021"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Price (₹) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price in rupees"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Condition *
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {conditions.map(cond => (
                <option key={cond} value={cond.toLowerCase()}>
                  {cond}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your item in detail - condition, features, why you're selling, etc."
            rows="6"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Delhi, IIT Delhi"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Contact Number *
          </label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="9876543210"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Terms */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="flex items-start cursor-pointer">
            <input type="checkbox" required className="mt-1 mr-3 w-4 h-4" />
            <span className="text-sm text-gray-700">
              I confirm that this item is not stolen, and I have the right to sell it. I agree to the terms of service.
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {submitting ? 'Saving...' : user.role === 'admin' ? 'Add Item' : 'Post Listing'}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
