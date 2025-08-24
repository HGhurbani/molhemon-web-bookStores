import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Plus, Trash2, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';

const DataTable = ({
  title,
  data = [],
  columns = [],
  onAdd,
  onEdit,
  onDelete,
  addButtonText = 'إضافة جديد',
  searchable = true,
  filterable = false,
  exportable = false,
  loading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);

  const filteredData = searchQuery
    ? data.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedData.map(item => item.id));
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{filteredData.length} عنصر</p>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-sm text-gray-600">عرض:</span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                value={itemsPerPage}
                onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                {[10,25,50].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="بحث..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-9 rtl:pr-9 rtl:pl-3 w-64 h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {filterable && (
              <Button variant="outline" size="sm" className="rounded-xl">
                <Filter className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                تصفية
              </Button>
            )}
            {exportable && (
              <Button variant="outline" size="sm" className="rounded-xl">
                <Download className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                تصدير
              </Button>
            )}
            {selectedItems.length > 0 && (
              <Button variant="outline" size="sm" className="rounded-xl text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                حذف ({selectedItems.length})
              </Button>
            )}
            {onAdd && (
              <Button onClick={onAdd} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-md">
                <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {addButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="mr-3 rtl:ml-3 rtl:mr-0 text-gray-600">جاري التحميل...</span>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right rtl:text-right">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {columns.map((column, index) => (
                  <th key={index} className="px-6 py-4 text-right rtl:text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {column.header}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    الإجراءات
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((item, index) => (
                <motion.tr
                  key={item.id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 transition-colors ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                        {onEdit && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEdit(item)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete(item.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            عرض {startIndex + 1} إلى {Math.min(startIndex + itemsPerPage, filteredData.length)} من {filteredData.length} عنصر
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {[...Array(totalPages)].slice(0,5).map((_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-lg ${currentPage === page ? 'bg-blue-600 text-white' : ''}`}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DataTable;

