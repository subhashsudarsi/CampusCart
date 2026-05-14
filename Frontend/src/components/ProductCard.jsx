import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)

  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden">
        {/* Image Container */}
        <div className="relative bg-gray-200 h-48 overflow-hidden group">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          
          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setLiked(!liked)
            }}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:shadow-md transition"
          >
            <svg
              className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Price Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
            <p className="text-white text-lg font-bold">₹{product.price}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 truncate">
            {product.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Seller Info */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="text-xs text-gray-500">
              <p className="font-medium">{product.seller}</p>
              <p>{product.location}</p>
            </div>
            <div className="text-xs text-gray-500">
              {product.postedDaysAgo && <p>{product.postedDaysAgo} days ago</p>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
