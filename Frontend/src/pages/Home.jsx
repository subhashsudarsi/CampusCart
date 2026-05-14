import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import { fetchAvailableProducts } from '../services/productService'

const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'books', name: 'Books' },
  { id: 'sports', name: 'Sports' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'music', name: 'Music' },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvailableProducts()
      .then((loadedProducts) => {
        setProducts(loadedProducts)
        setFilteredProducts(loadedProducts)
      })
      .catch((err) => console.error('Error fetching products:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = ({ searchTerm, selectedCategory, priceRange }) => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    filtered = filtered.filter(p => p.price <= priceRange[1])

    setFilteredProducts(filtered)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to CampusCart</h1>
        <p className="text-xl text-gray-600">
          Buy and sell items with fellow students. No shipping, direct meetups.
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} categories={categories} />

      {/* Products Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Available Items ({filteredProducts.length})
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No products found</p>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
