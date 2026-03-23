'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const BUCKET = 'blog-images';

interface MediaFile {
  name: string;
  id: string | null;
  updated_at: string;
  created_at: string;
  metadata: {
    size?: number;
    mimetype?: string;
    [key: string]: unknown;
  } | null;
  url: string;
  isFolder: boolean;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  const { getAccessToken } = useAuth();

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(BUCKET).list(currentPath, {
        limit: 500,
        sortBy: { column: 'name', order: 'asc' },
      });

      if (error) throw error;

      const items = (data || [])
        .filter((f) => !f.name.startsWith('.'))
        .map((file) => {
          const isFolder = file.id === null;
          const fullPath = currentPath ? `${currentPath}/${file.name}` : file.name;
          let url = '';
          if (!isFolder) {
            const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fullPath);
            url = urlData.publicUrl;
          }
          return { ...file, url, isFolder };
        });

      items.sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1;
        if (!a.isFolder && b.isFolder) return 1;
        return a.name.localeCompare(b.name);
      });

      setFiles(items);
    } catch (e) {
      console.error('Error fetching files:', e);
    } finally {
      setLoading(false);
    }
  }, [currentPath]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const uploadFile = useCallback(
    async (file: File) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Tipo de archivo no permitido. Usa JPG, PNG, WebP o GIF.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo excede 5MB');
        return;
      }

      setUploading(true);
      try {
        const token = await getAccessToken();
        if (!token) {
          alert('Sesión expirada. Vuelve a iniciar sesión.');
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', BUCKET);
        if (currentPath) {
          formData.append('folder', currentPath);
        }

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Error al subir');
        }

        await fetchFiles();
      } catch (e: unknown) {
        console.error('Error uploading:', e);
        alert(e instanceof Error ? e.message : 'Error al subir el archivo');
      } finally {
        setUploading(false);
      }
    },
    [currentPath, fetchFiles, getAccessToken]
  );

  const createFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const token = await getAccessToken();
      if (!token) {
        alert('Sesión expirada');
        return;
      }

      const formData = new FormData();
      formData.append('bucket', BUCKET);
      formData.append('mkdir', '1');
      formData.append('folderName', newFolderName.trim());
      if (currentPath) {
        formData.append('folder', currentPath);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || 'Error al crear carpeta');
      }

      setNewFolderName('');
      setShowNewFolder(false);
      await fetchFiles();
    } catch (e: unknown) {
      console.error('Error creating folder:', e);
      alert(e instanceof Error ? e.message : 'Error al crear la carpeta');
    }
  };

  const deleteFile = async (fileName: string) => {
    if (!confirm('¿Eliminar este elemento?')) return;

    try {
      const token = await getAccessToken();
      if (!token) {
        alert('Sesión expirada');
        return;
      }

      const fullPath = currentPath ? `${currentPath}/${fileName}` : fileName;

      const response = await fetch(
        `/api/upload?path=${encodeURIComponent(fullPath)}&bucket=${BUCKET}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || 'Error al eliminar');
      }

      setFiles((prev) => prev.filter((f) => f.name !== fileName));
      setSelectedFile(null);
      await fetchFiles();
    } catch (e: unknown) {
      console.error('Error deleting:', e);
      alert(e instanceof Error ? e.message : 'Error al eliminar');
    }
  };

  const navigateToFolder = (folderName: string) => {
    setCurrentPath((p) => (p ? `${p}/${folderName}` : folderName));
    setSelectedFile(null);
  };

  const navigateUp = () => {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath(parts.join('/'));
    setSelectedFile(null);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copiada al portapapeles');
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      Array.from(e.dataTransfer.files).forEach((f) => uploadFile(f));
    },
    [uploadFile]
  );

  const formatSize = (bytes: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const breadcrumbs = currentPath ? currentPath.split('/').filter(Boolean) : [];

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Media</h1>
          <p className="text-gray-500 mt-1">
            Bucket Supabase «{BUCKET}». Organiza por carpetas (p. ej. blog / 2026 01 enero).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {currentPath ? (
            <button
              type="button"
              onClick={navigateUp}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              title="Carpeta superior"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Subir nivel
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setShowNewFolder((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
            Nueva carpeta
          </button>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 cursor-pointer transition text-sm font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {uploading ? 'Subiendo…' : 'Subir imágenes'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                Array.from(e.target.files || []).forEach((f) => uploadFile(f));
                e.target.value = '';
              }}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Ruta actual */}
      <div className="mb-4 flex flex-wrap items-center gap-1 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
        <span className="text-gray-400">Ubicación:</span>
        <button type="button" onClick={() => setCurrentPath('')} className="text-accent hover:underline font-medium">
          Raíz
        </button>
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb + index} className="flex items-center gap-1">
            <span className="text-gray-300">/</span>
            <button
              type="button"
              onClick={() => setCurrentPath(breadcrumbs.slice(0, index + 1).join('/'))}
              className="text-accent hover:underline"
            >
              {crumb}
            </button>
          </span>
        ))}
      </div>

      {showNewFolder ? (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/80 px-4 py-3">
          <span className="text-sm text-blue-900 font-medium">Nombre de la carpeta</span>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createFolder()}
            placeholder="Ej. blog o 2026 01 enero"
            className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/40 outline-none"
            autoFocus
          />
          <button
            type="button"
            onClick={createFolder}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Crear
          </button>
          <button
            type="button"
            onClick={() => {
              setShowNewFolder(false);
              setNewFolderName('');
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      ) : null}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        className={`mb-6 border-2 border-dashed rounded-lg p-6 text-center transition ${
          dragOver ? 'border-accent bg-accent/5' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <p className="text-gray-600 text-sm">
          Arrastra imágenes aquí para subirlas a{' '}
          <strong>{currentPath || 'la raíz'}</strong>
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP o GIF hasta 5MB · varios archivos a la vez</p>
      </div>

      <p className="text-sm text-gray-500 mb-3">
        {files.filter((f) => !f.isFolder).length} imagen(es), {files.filter((f) => f.isFolder).length} carpeta(s) en
        esta vista
      </p>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-600">Carpeta vacía</p>
          <p className="text-sm text-gray-400 mt-1">Crea una carpeta o sube imágenes</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file) => (
            <div
              key={file.name}
              role="button"
              tabIndex={0}
              onClick={() => (file.isFolder ? navigateToFolder(file.name) : setSelectedFile(file))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  file.isFolder ? navigateToFolder(file.name) : setSelectedFile(file);
                }
              }}
              className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition ${
                selectedFile?.name === file.name && !file.isFolder
                  ? 'border-accent ring-2 ring-accent/25'
                  : 'border-transparent hover:border-gray-300'
              } ${file.isFolder ? 'bg-amber-50' : 'bg-gray-100'}`}
            >
              {file.isFolder ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                  <svg className="w-14 h-14 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                  </svg>
                  <p className="text-xs text-gray-800 mt-2 text-center line-clamp-2 font-medium">{file.name}</p>
                  <span className="text-[10px] text-gray-500 mt-1">Abrir</span>
                </div>
              ) : (
                <>
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition flex gap-2 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyUrl(file.url);
                        }}
                        className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                        title="Copiar URL"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFile(file.name);
                        }}
                        className="p-2 bg-white rounded-full shadow hover:bg-accent-50 text-accent-500"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                    <p className="text-[10px] text-white truncate">{file.name}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedFile && !selectedFile.isFolder ? (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedFile(null)}
          role="presentation"
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex flex-col md:flex-row max-h-[90vh]">
              <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 min-h-[200px]">
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>

              <div className="w-full md:w-80 p-6 border-t md:border-t-0 md:border-l overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-gray-900">Detalles</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Cerrar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Ruta</p>
                    <p className="break-all text-gray-900">
                      {currentPath ? `${currentPath}/` : ''}
                      {selectedFile.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Tamaño</p>
                    <p>{formatSize(selectedFile.metadata?.size || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">URL</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={selectedFile.url}
                        readOnly
                        className="flex-1 text-xs bg-gray-50 border rounded px-2 py-1 truncate"
                      />
                      <button
                        type="button"
                        onClick={() => copyUrl(selectedFile.url)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs shrink-0"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t space-y-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(selectedFile.url)}
                    className="w-full py-2 px-4 bg-accent text-white rounded-lg hover:bg-accent-600 text-sm"
                  >
                    Copiar URL
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteFile(selectedFile.name)}
                    className="w-full py-2 px-4 border border-accent-200 text-accent rounded-lg hover:bg-accent-50 text-sm"
                  >
                    Eliminar imagen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
