// src/components/ListItems.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2, FiStar, FiHeart } from 'react-icons/fi';
import { FiEdit } from 'react-icons/fi';
import AdminNavbar from '../Navbar/Navbar';
import { styles } from '../../assets/dummyadmin';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ListItems = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Add withCredentials to handle CORS properly
        const response = await axios.get('http://localhost:4000/api/items', {
          withCredentials: true
        });
        console.log('Raw API response:', response.data);
        
        // Ensure we're getting an array of items
        let itemsArray = [];
        if (Array.isArray(response.data)) {
          itemsArray = response.data;
        } else if (response.data && typeof response.data === 'object') {
          // Try to extract items from response object
          if (Array.isArray(response.data.items)) {
            itemsArray = response.data.items;
          } else {
            // If all else fails, try to convert object values to array
            itemsArray = Object.values(response.data).filter(item => item && typeof item === 'object');
          }
        }
        
        console.log('Total items available:', itemsArray.length);
        setItems(itemsArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching items:', err);
        // Set loading to false even on error to show empty state
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Delete handler
  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      // Remove authentication requirement for delete operation
      await axios.delete(`http://localhost:4000/api/items/${itemId}`);
      setItems(prev => prev.filter(item => item._id !== itemId));
      console.log('Deleted item ID:', itemId);
      alert('Item deleted successfully!');
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Error deleting item: ' + (err.response?.data?.message || err.message));
    }
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`text-xl ${i < rating ? 'text-amber-400 fill-current' : 'text-amber-100/30'}`}
      />
    ));

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className={styles.pageWrapper.replace(/bg-gradient-to-br.*/, '').concat(' flex items-center justify-center text-amber-100')}>
          Loading menu…
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className={styles.pageWrapper}>
        <div className="max-w-7xl mx-auto">
          <div className={styles.cardContainer}>
            <h2 className={styles.title}>Manage Menu Items</h2>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>Image</th>
                    <th className={styles.th}>Name</th>
                    <th className={styles.th}>Category</th>
                    <th className={styles.th}>Price ($ CAD)</th>
                    <th className={styles.th}>Rating</th>
                    <th className={styles.th}>Hearts</th>
                    <th className={styles.thCenter}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {items
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map(item => (
                      <tr key={item._id} className={styles.tr}>
                        <td className={styles.imgCell}>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className={styles.img}
                          />
                        </td>
                        <td className={styles.nameCell}>
                          <div className="space-y-1">
                            <p className={styles.nameText}>{item.name}</p>
                            <p className={styles.descText}>{item.description}</p>
                          </div>
                        </td>
                        <td className={styles.categoryCell}>{item.category}</td>
                        <td className={styles.priceCell}>${item.price} CAD</td>
                        <td className={styles.ratingCell}>
                          <div className="flex gap-1">{renderStars(item.rating)}</div>
                        </td>
                        <td className={styles.heartsCell}>
                          <div className={styles.heartsWrapper}>
                            <FiHeart className="text-xl" />
                            <span>{item.hearts}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => setEditingItem(item)} className={styles.editBtn} title="Edit">
                              <FiEdit className="text-xl" />
                            </button>
                            <button onClick={() => handleDelete(item._id)} className={styles.deleteBtn}>
                              <FiTrash2 className="text-2xl" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Edit modal / inline form */}
            {editingItem && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto">
                <div className="bg-[#1b1512] rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl text-amber-200 mb-4">Edit Item: {editingItem.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-amber-100">Name</label>
                      <input type="text" value={editingItem.name || ''} onChange={e => setEditingItem(prev => ({ ...prev, name: e.target.value }))} className={styles.inputField} />
                    </div>
                    <div>
                      <label className="text-amber-100">Category</label>
                      <input type="text" value={editingItem.category || ''} onChange={e => setEditingItem(prev => ({ ...prev, category: e.target.value }))} className={styles.inputField} />
                    </div>

                    <div>
                      <label className="text-amber-100">Price</label>
                      <input type="number" step="0.01" value={editingItem.price || 0} onChange={e => setEditingItem(prev => ({ ...prev, price: Number(e.target.value) }))} className={styles.inputField} />
                    </div>
                    <div>
                      <label className="text-amber-100">GST (%)</label>
                      <input type="number" step="0.01" value={editingItem.gst || 0} onChange={e => setEditingItem(prev => ({ ...prev, gst: Number(e.target.value) }))} className={styles.inputField} />
                    </div>

                    <div>
                      <label className="text-amber-100">Price Type</label>
                      <input type="text" value={editingItem.priceType || ''} onChange={e => setEditingItem(prev => ({ ...prev, priceType: e.target.value }))} className={styles.inputField} />
                    </div>
                    <div>
                      <label className="text-amber-100">Price Unit</label>
                      <input type="text" value={editingItem.priceUnit || ''} onChange={e => setEditingItem(prev => ({ ...prev, priceUnit: e.target.value }))} className={styles.inputField} />
                    </div>

                    <div>
                      <label className="text-amber-100">Cost</label>
                      <input type="number" step="0.01" value={editingItem.cost || 0} onChange={e => setEditingItem(prev => ({ ...prev, cost: Number(e.target.value) }))} className={styles.inputField} />
                    </div>
                    <div>
                      <label className="text-amber-100">Product Code</label>
                      <input type="text" value={editingItem.productCode || ''} onChange={e => setEditingItem(prev => ({ ...prev, productCode: e.target.value }))} className={styles.inputField} />
                    </div>

                    <div>
                      <label className="text-amber-100">SKU</label>
                      <input type="text" value={editingItem.sku || ''} onChange={e => setEditingItem(prev => ({ ...prev, sku: e.target.value }))} className={styles.inputField} />
                    </div>
                    <div>
                      <label className="text-amber-100">Modifier Groups (comma separated)</label>
                      <input type="text" value={(editingItem.modifierGroups || []).join ? (editingItem.modifierGroups.join(', ')) : (editingItem.modifierGroups || '')} onChange={e => setEditingItem(prev => ({ ...prev, modifierGroups: e.target.value }))} className={styles.inputField} />
                    </div>

                    <div>
                      <label className="text-amber-100">Printer Labels (comma separated)</label>
                      <input type="text" value={(editingItem.printerLabels || []).join ? (editingItem.printerLabels.join(', ')) : (editingItem.printerLabels || '')} onChange={e => setEditingItem(prev => ({ ...prev, printerLabels: e.target.value }))} className={styles.inputField} />
                    </div>
                    <div>
                      <label className="text-amber-100">Flavour Options (comma separated)</label>
                      <input type="text" value={(editingItem.flavourOptions || []).join ? (editingItem.flavourOptions.join(', ')) : (editingItem.flavourOptions || '')} onChange={e => setEditingItem(prev => ({ ...prev, flavourOptions: e.target.value }))} className={styles.inputField} />
                    </div>

                    <div>
                      <label className="text-amber-100">Quantity</label>
                      <input type="number" value={editingItem.quantity || 0} onChange={e => setEditingItem(prev => ({ ...prev, quantity: Number(e.target.value) }))} className={styles.inputField} />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!editingItem.hidden} onChange={e => setEditingItem(prev => ({ ...prev, hidden: e.target.checked }))} />
                        <span className="text-amber-200">Hidden (do not show on frontend)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={!!editingItem.nonRevenue} onChange={e => setEditingItem(prev => ({ ...prev, nonRevenue: e.target.checked }))} />
                        <span className="text-amber-200">Non-revenue item</span>
                      </label>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-amber-100">Description</label>
                      <textarea value={editingItem.description || ''} onChange={e => setEditingItem(prev => ({ ...prev, description: e.target.value }))} className={styles.inputField + ' h-28'} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button className="px-4 py-2 rounded bg-amber-800/30" onClick={() => setEditingItem(null)}>Cancel</button>
                    <button className="px-4 py-2 rounded bg-amber-700 text-white" onClick={async () => {
                      try {
                        // Prepare payload: convert comma-separated strings into arrays
                        const payload = { ...editingItem };
                        if (typeof payload.modifierGroups === 'string') payload.modifierGroups = payload.modifierGroups.split(',').map(s => s.trim()).filter(Boolean);
                        if (typeof payload.printerLabels === 'string') payload.printerLabels = payload.printerLabels.split(',').map(s => s.trim()).filter(Boolean);
                        if (typeof payload.flavourOptions === 'string') payload.flavourOptions = payload.flavourOptions.split(',').map(s => s.trim()).filter(Boolean);

                        // Send update (JSON) - backend will parse numbers/booleans
                        const res = await axios.put(`http://localhost:4000/api/items/${editingItem._id}`, payload, { headers: { 'Content-Type': 'application/json' } });
                        // Update local list
                        setItems(prev => prev.map(it => it._id === res.data._id ? res.data : it));
                        setEditingItem(null);
                        alert('Item updated');
                      } catch (err) {
                        console.error('Update error', err);
                        alert('Failed to update item');
                      }
                    }}>Save</button>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-amber-100">
              <div>
                Showing {Math.min(items.length, currentPage * itemsPerPage)} of {items.length} items
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-800'}`}
                >
                  <FiChevronLeft />
                </button>
                <span className="flex items-center px-2">Page {currentPage}</span>
                <button 
                  onClick={() => setCurrentPage(prev => (prev * itemsPerPage < items.length ? prev + 1 : prev))}
                  disabled={currentPage * itemsPerPage >= items.length}
                  className={`p-2 rounded ${currentPage * itemsPerPage >= items.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-800'}`}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>

            {items.length === 0 && (
              <div className={styles.emptyState}>
                No items found in the menu
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListItems;