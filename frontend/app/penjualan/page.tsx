// app/penjualan/page.tsx
"use client";

import { useState, useEffect } from "react";

interface Barang {
  id: number;
  nama_barang: string;
  kategori: string;
  harga: number;
}

interface ItemPenjualan {
  id: number;
  barang_id: number;
  qty: number;
  barang: Barang;
}

interface Pelanggan {
  id: number;
  nama: string;
  email: string;
  telepon: string;
}

interface Penjualan {
  id: number;
  pelanggan_id: number;
  subtotal: number;
  created_at: string;
  pelanggan: Pelanggan;
  items: ItemPenjualan[];
}

interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export default function PenjualanPage() {
  const [penjualans, setPenjualans] = useState<Penjualan[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingPenjualan, setEditingPenjualan] = useState<Penjualan | null>(
    null
  );
  const [selectedDetail, setSelectedDetail] = useState<Penjualan | null>(null);
  const [formData, setFormData] = useState({
    pelanggan_id: "",
    items: [] as { barang_id: number; qty: number }[],
  });
  const [availableBarangs, setAvailableBarangs] = useState<Barang[]>([]);
  const [availablePelanggans, setAvailablePelanggans] = useState<Pelanggan[]>(
    []
  );

  const fetchPenjualans = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/penjualan?page=${page}&per_pages=${perPage}`
      );
      const result = await response.json();

      if (result.status === "success") {
        setPenjualans(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message || "Failed to fetch data");
      }
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const fetchBarangs = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/barang?per_pages=100"
      ); // Get all barangs
      const result = await response.json();
      if (result.status === "success") {
        setAvailableBarangs(result.data);
      }
    } catch (err) {
      console.error("Error fetching barangs:", err);
    }
  };

  const fetchPelanggans = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/pelanggan?per_pages=100"
      ); // Get all pelanggans
      const result = await response.json();
      if (result.status === "success") {
        setAvailablePelanggans(result.data);
      }
    } catch (err) {
      console.error("Error fetching pelanggans:", err);
    }
  };

  useEffect(() => {
    fetchPenjualans(currentPage);
    fetchBarangs();
    fetchPelanggans();
  }, [currentPage, perPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (pagination?.last_page || 1)) {
      setCurrentPage(page);
    }
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { barang_id: 0, qty: 1 }],
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingPenjualan ? "PUT" : "POST";
      const url = editingPenjualan
        ? `http://localhost:8000/api/penjualan/${editingPenjualan.id}`
        : "http://localhost:8000/api/penjualan";
      console.log("data yang dikirim:", formData);
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log("Response:", response);
      const result = await response.json();

      if (result.status === "success") {
        setShowModal(false);
        setEditingPenjualan(null);
        setFormData({ pelanggan_id: "", items: [] });
        fetchPenjualans(currentPage);
      } else {
        alert(result.message || "Operation failed");
      }
    } catch (err) {
      alert("Error saving data");
    }
  };

  const handleEdit = (penjualan: Penjualan) => {
    setEditingPenjualan(penjualan);
    setFormData({
      pelanggan_id: penjualan.pelanggan_id.toString(),
      items: penjualan.items.map((item) => ({
        barang_id: item.barang_id,
        qty: item.qty,
      })),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sale?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/penjualan/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        fetchPenjualans(currentPage);
      } else {
        alert(result.message || "Delete failed");
      }
    } catch (err) {
      alert("Error deleting sale");
    }
  };

  const openCreateModal = () => {
    setEditingPenjualan(null);
    setFormData({ pelanggan_id: "", items: [] });
    setShowModal(true);
  };

  const openDetailModal = (penjualan: Penjualan) => {
    setSelectedDetail(penjualan);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Penjualan Management
          </h1>
          <button
            onClick={openCreateModal}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Add Penjualan
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700">{error}</div>
        )}

        <div className="mb-4 flex justify-end">
          <select
            value={perPage}
            onChange={handlePerPageChange}
            className="border border-gray-300 rounded px-3 py-1"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Tanggal</th>
                    <th className="border px-4 py-2">Pelanggan</th>
                    <th className="border px-4 py-2">Subtotal</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {penjualans.map((penjualan) => (
                    <tr key={penjualan.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{penjualan.id}</td>
                      <td className="border px-4 py-2">
                        {new Date(penjualan.created_at).toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">
                        {penjualan.pelanggan.nama}
                      </td>
                      <td className="border px-4 py-2">
                        Rp {penjualan.subtotal.toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => openDetailModal(penjualan)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleEdit(penjualan)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(penjualan.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && (
              <div className="mt-6 flex flex-col items-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border rounded ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Previous
                  </button>

                  {[...Array(pagination.last_page)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === i + 1
                          ? "bg-gray-800 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.last_page}
                    className={`px-3 py-1 border rounded ${
                      currentPage === pagination.last_page
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  Page {currentPage} of {pagination.last_page} • Total:{" "}
                  {pagination.total} items
                </div>
              </div>
            )}
          </>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-20 border flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full border max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingPenjualan ? "Edit Penjualan" : "Add Penjualan"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Pelanggan</label>
                  <select
                    name="pelanggan_id"
                    value={formData.pelanggan_id}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Pelanggan</option>
                    {availablePelanggans.map((pelanggan) => (
                      <option key={pelanggan.id} value={pelanggan.id}>
                        {pelanggan.nama} - {pelanggan.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700">Items</label>
                    <button
                      type="button"
                      onClick={addItem}
                      className="text-sm bg-gray-800 text-white px-2 py-1 rounded"
                    >
                      + Add Item
                    </button>
                  </div>

                  {formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center mb-2 space-x-2"
                    >
                      <select
                        value={item.barang_id}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "barang_id",
                            parseInt(e.target.value)
                          )
                        }
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                        required
                      >
                        <option value="">Select Barang</option>
                        {availableBarangs.map((barang) => (
                          <option key={barang.id} value={barang.id}>
                            {barang.nama_barang} - Rp{" "}
                            {barang.harga.toLocaleString()}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) =>
                          updateItem(index, "qty", parseInt(e.target.value))
                        }
                        className="w-20 border border-gray-300 rounded px-3 py-2"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                  >
                    {editingPenjualan ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedDetail && (
          <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Penjualan Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <p>
                  <strong>ID:</strong> {selectedDetail.id}
                </p>
                <p>
                  <strong>Tanggal:</strong>{" "}
                  {new Date(selectedDetail.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Pelanggan:</strong> {selectedDetail.pelanggan.nama}
                </p>
                <p>
                  <strong>Email:</strong> {selectedDetail.pelanggan.email}
                </p>
                <p>
                  <strong>Telepon:</strong> {selectedDetail.pelanggan.telepon}
                </p>
                <p>
                  <strong>Subtotal:</strong> Rp{" "}
                  {selectedDetail.subtotal.toLocaleString()}
                </p>
              </div>

              <h3 className="font-semibold mb-2">Items:</h3>
              <table className="min-w-full border border-gray-200 mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Barang</th>
                    <th className="border px-2 py-1">Kategori</th>
                    <th className="border px-2 py-1">Qty</th>
                    <th className="border px-2 py-1">Harga</th>
                    <th className="border px-2 py-1">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDetail.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border px-2 py-1">
                        {item.barang.nama_barang}
                      </td>
                      <td className="border px-2 py-1">
                        {item.barang.kategori}
                      </td>
                      <td className="border px-2 py-1">{item.qty}</td>
                      <td className="border px-2 py-1">
                        Rp {item.barang.harga.toLocaleString()}
                      </td>
                      <td className="border px-2 py-1">
                        Rp {(item.barang.harga * item.qty).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right">
                <p className="font-bold">
                  Total: Rp {selectedDetail.subtotal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
