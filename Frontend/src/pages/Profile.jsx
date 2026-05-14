import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Profile() {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    college: user?.college || ''
  })

  const [userListings] = useState([
    {
      id: 1,
      title: 'MacBook Pro 2021',
      price: 35000,
      postedDate: '2 days ago',
      views: 45,
      interested: 2
    },
    {
      id: 2,
      title: 'Guitar - Acoustic',
      price: 6000,
      postedDate: '5 days ago',
      views: 12,
      interested: 1
    }
  ])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    setUser({ ...user, ...formData })
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Please login to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center mt-2 text-yellow-400">
                <span className="text-lg">★</span>
                <span className="ml-2 text-gray-700">4.8 Rating (23 reviews)</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center py-6 border-y border-gray-200">
            <div>
              <p className="text-2xl font-bold text-gray-900">{userListings.length}</p>
              <p className="text-gray-600">Active Listings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-gray-600">Sold</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">15</p>
              <p className="text-gray-600">Followers</p>
            </div>
          </div>
        )}
      </div>

      {/* Active Listings */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Active Listings</h3>
        {userListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-lg shadow p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{listing.title}</h4>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-lg font-bold text-blue-600">₹{listing.price}</p>
                  <p className="text-sm text-gray-500">{listing.postedDate}</p>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <span>👁️ {listing.views} views</span>
                  <span>💬 {listing.interested} interested</span>
                </div>
                <button className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition text-sm">
                  Edit Listing
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You haven't posted any listings yet.</p>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  )
}
