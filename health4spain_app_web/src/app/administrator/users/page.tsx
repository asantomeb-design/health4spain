'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { AdminUser } from '@/lib/types';

const PER_PAGE = 20;

const emptyForm = {
  email: '',
  name: '',
  password: '',
};

export default function AdminUsersPage() {
  const { fetchWithAuth, isLoading: authLoading, user: currentUser } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);

  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('per_page', String(PER_PAGE));
      if (search.trim()) params.set('search', search.trim());
      if (filterActive) params.set('active', filterActive);

      const res = await fetchWithAuth(`/api/admin/users?${params}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || 'Error obteniendo usuarios');
      }
      setUsers(json.data || []);
      setTotalPages(json.total_pages || 1);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, page, search, filterActive]);

  useEffect(() => {
    if (authLoading) return;
    fetchUsers();
  }, [authLoading, fetchUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setActionMsg(null);
    setActionErr(null);
    try {
      const res = await fetchWithAuth('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(createForm),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Error al crear usuario');
      }
      setActionMsg(`Usuario ${createForm.email} creado correctamente.`);
      setCreateForm(emptyForm);
      setShowCreate(false);
      await fetchUsers();
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    setActionMsg(null);
    setActionErr(null);
    try {
      const body: Record<string, unknown> = { name: editName };
      if (editPassword.trim()) body.password = editPassword.trim();

      const res = await fetchWithAuth(`/api/admin/users/${selected.id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Error al actualizar usuario');
      }
      setActionMsg('Usuario actualizado.');
      setEditPassword('');
      setSelected({ ...selected, ...json.data });
      await fetchUsers();
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (target: AdminUser) => {
    const newActive = !target.active;
    const label = newActive ? 'activar' : 'desactivar';
    if (!window.confirm(`¿${label.charAt(0).toUpperCase() + label.slice(1)} a ${target.email}?`)) return;

    setActionMsg(null);
    setActionErr(null);
    try {
      const res = await fetchWithAuth(`/api/admin/users/${target.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: newActive }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || `Error al ${label} usuario`);
      }
      setActionMsg(`Usuario ${newActive ? 'activado' : 'desactivado'}.`);
      if (selected?.id === target.id) {
        setSelected({ ...selected, active: newActive });
      }
      await fetchUsers();
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleDelete = async (target: AdminUser) => {
    if (
      !window.confirm(
        `¿Eliminar permanentemente a ${target.email}?\n\nSe borrará de admin_users y de Supabase Auth. Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    setActionMsg(null);
    setActionErr(null);
    try {
      const res = await fetchWithAuth(`/api/admin/users/${target.id}?hard=true`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Error al eliminar usuario');
      }
      setActionMsg('Usuario eliminado permanentemente.');
      if (selected?.id === target.id) setSelected(null);
      await fetchUsers();
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const openDetail = (u: AdminUser) => {
    setSelected(u);
    setEditName(u.name || '');
    setEditPassword('');
  };

  const formatDate = (iso?: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isSelf = (u: AdminUser) =>
    currentUser?.email?.toLowerCase() === u.email.toLowerCase();

  return (
    <div className="p-8 md:p-12">
      <header className="mb-10 flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">
            Health4Spain · Admin
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Gestiona los administradores del panel. Los usuarios activos en{' '}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">admin_users</code> pueden
            acceder al panel con su cuenta de Supabase Auth.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => fetchUsers()}
            className="btn-minimal text-sm"
            disabled={loading}
          >
            {loading ? 'Cargando…' : '↻ Refrescar'}
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            + Nuevo usuario
          </button>
        </div>
      </header>

      {(actionMsg || actionErr) && (
        <div
          className={`mb-6 rounded-md p-4 text-sm ${
            actionErr
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-green-50 border border-green-200 text-green-800'
          }`}
          role="status"
          onClick={() => {
            setActionMsg(null);
            setActionErr(null);
          }}
        >
          {actionErr || actionMsg}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-md p-4 text-sm bg-red-50 border border-red-200 text-red-800">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setPage(1);
              fetchUsers();
            }
          }}
          placeholder="Buscar por email o nombre…"
          className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-accent"
        />
        <select
          value={filterActive}
          onChange={(e) => {
            setFilterActive(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-accent"
        >
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
        <button
          type="button"
          onClick={() => {
            setPage(1);
            fetchUsers();
          }}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
        >
          Aplicar filtros
        </button>
      </section>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Auth</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Último acceso</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Creado</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Cargando usuarios…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No hay usuarios que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{u.name || '—'}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {u.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.has_auth_account
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {u.has_auth_account ? 'Con cuenta' : 'Sin cuenta Auth'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(u.last_sign_in_at)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openDetail(u)}
                        className="text-accent hover:underline text-xs"
                      >
                        Editar
                      </button>
                      {!isSelf(u) && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(u)}
                            className="text-gray-600 hover:underline text-xs"
                          >
                            {u.active ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(u)}
                            className="text-red-600 hover:underline text-xs"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="px-3 py-1 border rounded text-sm disabled:opacity-40"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="px-3 py-1 border rounded text-sm disabled:opacity-40"
          >
            Siguiente →
          </button>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">Nuevo administrador</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña * (mín. 6 caracteres)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-md disabled:opacity-50"
                >
                  {creating ? 'Creando…' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">{selected.email}</h2>
                <p className="text-sm text-gray-500">Editar administrador</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva contraseña (opcional)
                </label>
                <input
                  type="password"
                  minLength={6}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Dejar vacío para no cambiar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm pt-2 border-t">
                <div>
                  <dt className="text-gray-500">Estado</dt>
                  <dd className="font-medium">{selected.active ? 'Activo' : 'Inactivo'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Cuenta Auth</dt>
                  <dd className="font-medium">
                    {selected.has_auth_account ? 'Sí' : 'No'}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Último acceso</dt>
                  <dd className="font-medium">{formatDate(selected.last_sign_in_at)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Creado</dt>
                  <dd className="font-medium">{formatDate(selected.created_at)}</dd>
                </div>
              </dl>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={saving}
                  className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-md disabled:opacity-50"
                >
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
