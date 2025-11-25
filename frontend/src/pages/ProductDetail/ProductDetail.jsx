import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { ProductStructuredData, BreadcrumbStructuredData } from '../../components/SEO/StructuredData';
import apiClient from '../../utils/apiClient';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useCart } from '../../CartContext/CartContext';
import { FaPlus, FaMinus, FaStar } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/items/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6]">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <div className="bg-gray-200 rounded-xl h-96"></div>
                </div>
                <div className="md:w-1/2">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 mb-8"></div>
                  <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6]">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-dancingscript text-gray-800 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <a 
              href="/menu" 
              className="inline-block bg-[#4CAF50] text-white px-6 py-3 rounded-full font-cinzel hover:bg-[#45a049] transition duration-300"
            >
              Back to Menu
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate tax and GST
  const taxAmount = product.taxRate ? (product.price * product.taxRate / 100) : 0;
  const gstAmount = product.gst ? (product.price * product.gst / 100) : 0;
  const totalPrice = Number(product.price) + taxAmount + gstAmount;

  // Get rating information
  const averageRating = product.averageRating || product.rating || 0;
  const totalReviews = product.totalReviews || product.total || 0;

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'Home', url: 'https://lakeshoreconvenience.com' },
    { name: 'Menu', url: 'https://lakeshoreconvenience.com/menu' },
    { name: product.category, url: `https://lakeshoreconvenience.com/menu#${product.category}` },
    { name: product.name, url: `https://lakeshoreconvenience.com/item/${product._id}` }
  ];

  return (
    <>
      <SEO 
        title={`${product.name} - Lakeshore Convenience`}
        description={product.description}
        keywords={`${product.name}, ${product.category}, grocery, convenience store, Canada, nationwide delivery`}
        ogTitle={`${product.name} - Lakeshore Convenience`}
        ogDescription={product.description}
        ogImage={product.imageUrl}
        ogUrl={`https://lakeshoreconvenience.com/item/${product._id}`}
        ogType="product"
        canonicalUrl={`https://lakeshoreconvenience.com/item/${product._id}`}
      />
      <ProductStructuredData product={product} />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] py-8 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm font-cinzel">
              <ol className="flex items-center space-x-2 text-gray-600">
                {breadcrumbs.slice(0, -1).map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    <a href={crumb.url} className="hover:text-[#4CAF50] transition-colors">
                      {crumb.name}
                    </a>
                    <span className="mx-2">/</span>
                  </li>
                ))}
                <li className="text-gray-800 font-bold">{product.name}</li>
              </ol>
            </nav>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Product Image with lazy loading */}
                <div className="md:w-1/2 p-6 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="max-h-96 object-contain rounded-lg"
                      loading="lazy" // Add lazy loading
                      onError={(e) => {
                        e.target.src = 'https://source.unsplash.com/400x400/?grocery';
                      }}
                    />
                  ) : (
                    <div className="bg-gray-100 rounded-lg w-full h-96 flex items-center justify-center">
                      <span className="text-gray-500">No Image Available</span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="md:w-1/2 p-6 sm:p-8">
                  <div className="mb-4">
                    <span className="inline-block bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-sm font-cinzel">
                      {product.category}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-dancingscript text-gray-800 mb-4">
                    {product.name}
                  </h1>

                  {/* Rating */}
                  {averageRating > 0 && (
                    <div className="flex items-center mb-6">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'} mr-1`} 
                          />
                        ))}
                      </div>
                      <span className="text-gray-700 font-cinzel">
                        {averageRating.toFixed(1)} ({totalReviews} reviews)
                      </span>
                    </div>
                  )}

                  <p className="text-gray-600 mb-8 font-cinzel">
                    {product.description}
                  </p>

                  {/* Price Information */}
                  <div className="mb-8">
                    <div className="flex items-baseline mb-2">
                      <span className="text-3xl font-bold text-gray-800 font-cinzel">
                        ${Number(product.price).toFixed(2)} CAD
                      </span>
                      {product.priceUnit && (
                        <span className="ml-2 text-gray-600 font-cinzel">/ {product.priceUnit}</span>
                      )}
                    </div>
                    
                    {(taxAmount > 0 || gstAmount > 0) && (
                      <div className="text-sm text-gray-600 font-cinzel space-y-1">
                        {taxAmount > 0 && (
                          <div className="flex justify-between">
                            <span>Tax ({product.taxRate}%):</span>
                            <span>${taxAmount.toFixed(2)}</span>
                          </div>
                        )}
                        {gstAmount > 0 && (
                          <div className="flex justify-between">
                            <span>GST ({product.gst}%):</span>
                            <span>${gstAmount.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800 font-cinzel">Total:</span>
                        <span className="text-2xl font-bold text-[#4CAF50] font-cinzel">
                          ${totalPrice.toFixed(2)} CAD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                    <div className="flex items-center border border-gray-300 rounded-full">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-gray-600 hover:text-[#4CAF50] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus />
                      </button>
                      <span className="px-4 py-2 text-gray-800 font-cinzel">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 text-gray-600 hover:text-[#4CAF50] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-6 py-3 rounded-full font-cinzel hover:from-[#45a049] hover:to-[#3d8b40] transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Add to Cart
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-dancingscript text-gray-800 mb-3">Product Information</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-cinzel text-gray-600">Category:</span>
                        <span className="ml-2 text-gray-800">{product.category}</span>
                      </div>
                      <div>
                        <span className="font-cinzel text-gray-600">SKU:</span>
                        <span className="ml-2 text-gray-800">{product.sku || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-cinzel text-gray-600">In Stock:</span>
                        <span className="ml-2 text-gray-800">{product.quantity > 0 ? 'Yes' : 'No'}</span>
                      </div>
                      {product.productCode && (
                        <div>
                          <span className="font-cinzel text-gray-600">Product Code:</span>
                          <span className="ml-2 text-gray-800">{product.productCode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;