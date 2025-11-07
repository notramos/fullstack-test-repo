// app/pelanggan/page.tsx
"use client";

import { useState, useEffect } from "react";

interface Pelanggan {
  id: number;
  nama: string;
  domisili: string;
  jenis_kelamin: string;
  created_at: string;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export default function PelangganPage() {
  const [pelanggans, setPelanggans] = useState<Pelanggan[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [editingPelanggan, setEditingPelanggan] = useState<Pelanggan | null>(
    null
  );
  const [formData, setFormData] = useState({
    nama: "",
    domisili: "",
    jenis_kelamin: "",
  });

  const fetchPelanggans = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/pelanggan?page=${page}&per_pages=${perPage}`
      );
      const result = await response.json();

      if (result.status === "success") {
        setPelanggans(result.data);
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

  useEffect(() => {
    fetchPelanggans(currentPage);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingPelanggan ? "PUT" : "POST";
      const url = editingPelanggan
        ? `http://localhost:8000/api/pelanggan/${editingPelanggan.id}`
        : "http://localhost:8000/api/pelanggan";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "success") {
        setShowModal(false);
        setEditingPelanggan(null);
        setFormData({ nama: "", domisili: "", jenis_kelamin: "" });
        fetchPelanggans(currentPage);
      } else {
        alert(result.message || "Operation failed");
      }
    } catch (err) {
      alert("Error saving data");
    }
  };

  const handleEdit = (pelanggan: Pelanggan) => {
    setEditingPelanggan(pelanggan);
    setFormData({
      nama: pelanggan.nama,
      domisili: pelanggan.domisili,
      jenis_kelamin: pelanggan.jenis_kelamin,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/pelanggan/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        fetchPelanggans(currentPage);
      } else {
        alert(result.message || "Delete failed");
      }
    } catch (err) {
      alert("Error deleting customer");
    }
  };

  const openCreateModal = () => {
    setEditingPelanggan(null);
    setFormData({ nama: "", domisili: "", jenis_kelamin: "" });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Pelanggan Management
          </h1>
          <button
            onClick={openCreateModal}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Add Pelanggan
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
                    <th className="border px-4 py-2">Nama</th>
                    <th className="border px-4 py-2">Domisili</th>
                    <th className="border px-4 py-2">Jenis Kelamin</th>
                    <th className="border px-4 py-2">Created At</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pelanggans.map((pelanggan) => (
                    <tr key={pelanggan.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{pelanggan.id}</td>
                      <td className="border px-4 py-2">{pelanggan.nama}</td>
                      <td className="border px-4 py-2">{pelanggan.domisili}</td>
                      <td className="border px-4 py-2">
                        {pelanggan.jenis_kelamin === "laki-laki"
                          ? "Laki-laki"
                          : "Perempuan"}
                      </td>
                      <td className="border px-4 py-2">
                        {new Date(pelanggan.created_at).toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleEdit(pelanggan)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pelanggan.id)}
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
          <div className="fixed inset-0 backdrop-blur-xs bg-opacity-20 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4">
                {editingPelanggan ? "Edit Pelanggan" : "Add Pelanggan"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Nama</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Domisili</label>
                  <input
                    type="text"
                    name="domisili"
                    value={formData.domisili}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    name="jenis_kelamin"
                    value={formData.jenis_kelamin}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="laki-laki">Laki-laki</option>
                    <option value="perempuan">Perempuan</option>
                  </select>
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
                    {editingPelanggan ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
