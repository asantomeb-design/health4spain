'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface MediaFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  metadata: {
    size?: number;
    mimetype?: string;
    [key: string]: any;
  } | null;
  url: string;
  isFolder?: boolean;
}

interface MediaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  bucket?: string;
}

export default function MediaManager({ isOpen, onClose, onSelect, bucket = 'blog-images' }: MediaManagerProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  
  const { getAccessToken } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen, currentPath]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      // Listar archivos (esto es público, no necesita auth)
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(currentPath, {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) throw error;

      // Separar carpetas y archivos
      const items = (data || [])
        .filter((f) => !f.name.startsWith('.'))
        .map((file) => {
          const isFolder = file.id === null;
          const fullPath = currentPath ? `${currentPath}/${file.name}` : file.name;
          
          let url = '';
          if (!isFolder) {
            const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fullPath);
            url = urlData.publicUrl;
          }
          
          return {
            ...file,
            url,
            isFolder,
          };
        });

      // Ordenar: carpetas primero, luego archivos
      items.sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1;
        if (!a.isFolder && b.isFolder) return 1;
        return a.name.localeCompare(b.name);
      });

      setFiles(items);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  // Subir archivo usando la API (con auth)
  const uploadFile = async (file: File) => {
    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de archivo no permitido. Usa JPG, PNG, WebP o GIF.');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo excede 5MB');
      return;
    }

    setUploading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        alert('Sesión expirada. Por favor, vuelve a iniciar sesión.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      if (currentPath) {
        formData.append('folder', currentPath);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al subir');
      }

      await fetchFiles();
    } catch (error: any) {
      console.error('Error uploading:', error);
      alert(error.message || 'Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const token = await getAccessToken();
      if (!token) {
        alert('Sesión expirada');
        return;
      }

      const formData = new FormData();
      formData.append('bucket', bucket);
      formData.append('mkdir', '1');
      formData.append('folderName', newFolderName.trim());
      if (currentPath) {
        formData.append('folder', currentPath);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || 'Error al crear carpeta');
      }

      setNewFolderName('');
      setShowNewFolder(false);
      await fetchFiles();
    } catch (error: unknown) {
      console.error('Error creating folder:', error);
      alert(error instanceof Error ? error.message : 'Error al crear la carpeta');
    }
  };

  // Borrar archivo usando la API (con auth)
  const deleteFile = async (fileName: string) => {
    if (!confirm('¿Eliminar esta imagen?')) return;

    try {
      const token = await getAccessToken();
      if (!token) {
        alert('Sesión expirada');
        return;
      }

      const fullPath = currentPath ? `${currentPath}/${fileName}` : fileName;
      
      const response = await fetch(`/api/upload?path=${encodeURIComponent(fullPath)}&bucket=${bucket}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Error al eliminar');
      }

      setFiles(files.filter(f => f.name !== fileName));
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Error deleting:', error);
      alert(error.message || 'Error al eliminar');
    }
  };

  const navigateToFolder = (folderName: string) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(newPath);
    setSelectedFile(null);
  };

  const navigateUp = () => {
    const parts = currentPath.split('/');
    parts.pop();
    setCurrentPath(parts.join('/'));
    setSelectedFile(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(file => uploadFile(file));
  }, [currentPath]);

  const handleSelect = () => {
    if (selectedFile && !selectedFile.isFolder) {
      onSelect(selectedFile.url);
      onClose();
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copiada');
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const breadcrumbs = currentPath ? currentPath.split('/') : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Gestor de Medios</h2>
            <p className="text-sm text-gray-500">Selecciona o sube una imagen</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 border-b flex items-center justify-between gap-4 shrink-0 bg-gray-50">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-sm overflow-x-auto">
            <button
              onClick={() => setCurrentPath('')}
              className="text-[#c7956d] hover:underline whitespace-nowrap"
            >
              Raíz
            </button>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                <span className="text-gray-400">/</span>
                <button
                  onClick={() => setCurrentPath(breadcrumbs.slice(0, index + 1).join('/'))}
                  className="text-[#c7956d] hover:underline whitespace-nowrap"
                >
                  {crumb}
                </button>
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {currentPath && (
              <button
                onClick={navigateUp}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                title="Subir nivel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setShowNewFolder(true)}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
              title="Nueva carpeta"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </button>
            <label className="flex items-center gap-2 px-3 py-2 bg-[#c7956d] text-white rounded-lg hover:bg-[#b8845c] cursor-pointer text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {uploading ? 'Subiendo...' : 'Subir'}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach(file => uploadFile(file));
                  e.target.value = '';
                }}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* New Folder Input */}
        {showNewFolder && (
          <div className="p-3 border-b bg-blue-50 flex items-center gap-2 shrink-0">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createFolder()}
              placeholder="Nombre de la carpeta..."
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#c7956d] outline-none"
              autoFocus
            />
            <button
              onClick={createFolder}
              className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Crear
            </button>
            <button
              onClick={() => { setShowNewFolder(false); setNewFolderName(''); }}
              className="px-3 py-1.5 text-gray-600 text-sm hover:bg-gray-200 rounded"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Grid */}
          <div
            className={`flex-1 p-4 overflow-y-auto ${dragOver ? 'bg-[#c7956d]/10' : ''}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
          >
            {loading ? (
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : files.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Carpeta vacía</p>
                <p className="text-sm mt-1">Arrastra imágenes aquí o usa el botón Subir</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {files.map((file) => (
                  <div
                    key={file.name}
                    onClick={() => file.isFolder ? navigateToFolder(file.name) : setSelectedFile(file)}
                    onDoubleClick={() => file.isFolder ? navigateToFolder(file.name) : handleSelect()}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition ${
                      selectedFile?.name === file.name
                        ? 'border-[#c7956d] ring-2 ring-[#c7956d]/30'
                        : 'border-transparent hover:border-gray-300'
                    } ${file.isFolder ? 'bg-gray-100' : 'bg-gray-50'}`}
                  >
                    {file.isFolder ? (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                        </svg>
                        <p className="text-sm text-gray-700 mt-2 px-2 text-center truncate w-full">{file.name}</p>
                      </div>
                    ) : (
                      <>
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-xs text-white truncate">{file.name}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Selected File Details */}
          {selectedFile && !selectedFile.isFolder && (
            <div className="w-72 border-l p-4 overflow-y-auto shrink-0 bg-gray-50">
              <img
                src={selectedFile.url}
                alt={selectedFile.name}
                className="w-full aspect-video object-contain bg-white rounded-lg border mb-4"
              />
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Nombre</p>
                  <p className="text-sm text-gray-900 break-all">{selectedFile.name}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 uppercase">Tamaño</p>
                  <p className="text-sm text-gray-900">{formatSize(selectedFile.metadata?.size || 0)}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase">URL</p>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="text"
                      value={selectedFile.url}
                      readOnly
                      className="flex-1 text-xs bg-white border rounded px-2 py-1 truncate"
                    />
                    <button
                      onClick={() => copyUrl(selectedFile.url)}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t space-y-2">
                  <button
                    onClick={handleSelect}
                    className="w-full py-2 bg-[#c7956d] text-white rounded-lg hover:bg-[#b8845c] text-sm font-medium"
                  >
                    Seleccionar imagen
                  </button>
                  <button
                    onClick={() => deleteFile(selectedFile.name)}
                    className="w-full py-2 border border-accent-200 text-accent rounded-lg hover:bg-accent-50 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center shrink-0 bg-gray-50">
          <p className="text-sm text-gray-500">
            {files.filter(f => !f.isFolder).length} imágenes, {files.filter(f => f.isFolder).length} carpetas
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedFile || selectedFile.isFolder}
              className="px-4 py-2 bg-[#c7956d] text-white rounded-lg hover:bg-[#b8845c] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insertar imagen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
