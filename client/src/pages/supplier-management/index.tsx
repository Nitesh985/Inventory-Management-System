import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import { useFetch } from '@/hooks/useFetch';
import { useMutation } from '@/hooks/useMutation';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '@/api/suppliers';
import type { Supplier, CreateSupplierDTO } from '@/api/suppliers';

const emptyForm: CreateSupplierDTO = {
  name: '',
  phone: '',
  email: '',
  company: '',
  address: '',
  notes: '',
};

const SupplierManagement: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [form, setForm] = useState<CreateSupplierDTO>({ ...emptyForm });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: rawData, loading } = useFetch(getSuppliers, [refreshKey]);
  const { mutate: createMutation, loading: creating } = useMutation(createSupplier);
  const { mutate: deleteMutation, loading: deleting } = useMutation(deleteSupplier);

  const suppliers: Supplier[] = useMemo(() => {
    if (!rawData) return [];
    return Array.isArray(rawData) ? rawData : [];
  }, [rawData]);

  const filteredSuppliers = useMemo(() => {
    if (!search.trim()) return suppliers;
    const q = search.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.company?.toLowerCase().includes(q) ||
        s.phone?.includes(q) ||
        s.email?.toLowerCase().includes(q)
    );
  }, [suppliers, search]);

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  const openAddModal = () => {
    setEditingSupplier(null);
    setForm({ ...emptyForm });
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setForm({
      name: supplier.name,
      phone: supplier.phone || '',
      email: supplier.email || '',
      company: supplier.company || '',
      address: supplier.address || '',
      notes: supplier.notes || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
    setForm({ ...emptyForm });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (!form.phone && !form.email && !form.address) {
      alert('Please provide at least one of: phone, email, or address.');
      return;
    }
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier._id, form);
      } else {
        await createMutation(form);
      }
      closeModal();
      handleRefresh();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to save supplier.';
      alert(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation(id);
      setDeleteConfirmId(null);
      handleRefresh();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete supplier.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Supplier Management - Digital Khata</title>
        <meta name="description" content="Manage your shop suppliers. Add, edit, and organize supplier information." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} syncStatus="online" />
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} syncStatus="online" />

        <main className={`pt-16 pb-20 lg:pb-8 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}`}>
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Icon name="Truck" size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Supplier Management</h1>
                    <p className="text-muted-foreground mt-1">Manage and organize your shop suppliers</p>
                  </div>
                </div>
                <Button variant="default" iconName="Plus" iconPosition="left" onClick={openAddModal}>
                  Add Supplier
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Suppliers</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{suppliers.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Icon name="Truck" size={20} className="text-indigo-600" />
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">With Email</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {suppliers.filter((s) => s.email).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="Mail" size={20} className="text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">With Phone</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {suppliers.filter((s) => s.phone).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Icon name="Phone" size={20} className="text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Card */}
            <div className="bg-card rounded-xl border border-border shadow-sm">
              {/* Search Bar */}
              <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative flex-1 w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="Search" size={16} className="text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search suppliers by name, company, phone, or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {filteredSuppliers.length} of {suppliers.length} suppliers
                </div>
              </div>

              {/* Table */}
              <div className="p-4">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg animate-pulse">
                        <div className="h-10 w-10 bg-muted rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/3" />
                          <div className="h-3 bg-muted rounded w-1/4" />
                        </div>
                        <div className="h-4 bg-muted rounded w-24" />
                        <div className="h-4 bg-muted rounded w-20" />
                      </div>
                    ))}
                  </div>
                ) : filteredSuppliers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Icon name="Truck" size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {search ? 'No suppliers found' : 'No suppliers yet'}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                      {search
                        ? 'Try adjusting your search query.'
                        : 'Get started by adding your first supplier.'}
                    </p>
                    {!search && (
                      <Button variant="default" iconName="Plus" iconPosition="left" onClick={openAddModal}>
                        Add Supplier
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Supplier</th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address</th>
                          <th className="py-3 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredSuppliers.map((supplier) => (
                          <tr key={supplier._id} className="hover:bg-muted/40 transition-colors group">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold text-sm">
                                  {supplier.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <span className="font-medium text-foreground">{supplier.name}</span>
                                  {supplier.notes && (
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{supplier.notes}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {supplier.company ? (
                                <span className="inline-flex items-center gap-1.5 text-foreground">
                                  <Icon name="Building2" size={14} className="text-muted-foreground" />
                                  {supplier.company}
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div className="space-y-1">
                                {supplier.phone && (
                                  <div className="flex items-center gap-1.5 text-sm">
                                    <Icon name="Phone" size={13} className="text-muted-foreground" />
                                    <span className="text-foreground">{supplier.phone}</span>
                                  </div>
                                )}
                                {supplier.email && (
                                  <div className="flex items-center gap-1.5 text-sm">
                                    <Icon name="Mail" size={13} className="text-muted-foreground" />
                                    <span className="text-foreground">{supplier.email}</span>
                                  </div>
                                )}
                                {!supplier.phone && !supplier.email && (
                                  <span className="text-muted-foreground text-xs">—</span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {supplier.address ? (
                                <span className="flex items-center gap-1.5 text-sm text-foreground">
                                  <Icon name="MapPin" size={13} className="text-muted-foreground" />
                                  <span className="line-clamp-1">{supplier.address}</span>
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => openEditModal(supplier)}
                                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Icon name="Pencil" size={15} className="text-muted-foreground" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(supplier._id)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Icon name="Trash2" size={15} className="text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Icon name={editingSupplier ? 'Pencil' : 'Truck'} size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingSupplier ? 'Update supplier details' : 'Fill in supplier details below'}
                  </p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Icon name="X" size={18} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Supplier Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="User" size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter supplier name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="Building2" size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Company name"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon name="Phone" size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder="98XXXXXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon name="Mail" size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="supplier@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="MapPin" size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
                <textarea
                  placeholder="Any additional notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <p className="text-xs text-slate-400">At least one of phone, email, or address is required.</p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !form.name.trim()}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <Icon name="Loader2" size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Icon name="Check" size={16} />
                      {editingSupplier ? 'Update Supplier' : 'Save Supplier'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Supplier</h3>
                <p className="text-sm text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Icon name="Trash2" size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupplierManagement;
