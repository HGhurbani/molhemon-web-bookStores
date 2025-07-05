import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from './ui/dialog.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';

const FIELDS = [
  { key: 'title', label: 'العنوان' },
  { key: 'author', label: 'المؤلف' },
  { key: 'price', label: 'السعر' },
  { key: 'category', label: 'الفئة' },
  { key: 'description', label: 'الوصف' },
];

export default function CsvImportDialog({ open, onOpenChange, onImport }) {
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({});

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isCsv = file.name.toLowerCase().endsWith('.csv');
    const reader = new FileReader();
    reader.onload = (evt) => {
      let workbook;
      if (isCsv) {
        workbook = XLSX.read(evt.target.result, { type: 'string' });
      } else {
        const data = new Uint8Array(evt.target.result);
        workbook = XLSX.read(data, { type: 'array' });
      }
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
      setHeaders(Object.keys(json[0] || {}));
      setRows(json);
    };
    if (isCsv) reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    if (!rows.length) return;
    const books = rows.map(r => {
      const b = {};
      FIELDS.forEach(f => {
        const col = mapping[f.key];
        if (col) b[f.key] = r[col];
      });
      if (b.price) b.price = parseFloat(b.price) || 0;
      return b;
    });
    await onImport(books);
    setHeaders([]);
    setRows([]);
    setMapping({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>استيراد كتب من ملف CSV</DialogTitle>
        </DialogHeader>
        {!rows.length ? (
          <div>
            <Label htmlFor="xls-file">اختر ملف CSV أو Excel</Label>
            <Input id="xls-file" type="file" accept=".csv,.xls,.xlsx" onChange={handleFile} />
          </div>
        ) : (
          <div className="space-y-3">
            {FIELDS.map(f => (
              <div key={f.key} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Label className="w-28" htmlFor={`map-${f.key}`}>{f.label}</Label>
                <select
                  id={`map-${f.key}`}
                  className="flex-grow p-2 border border-gray-300 rounded-md"
                  value={mapping[f.key] || ''}
                  onChange={(e) => setMapping(prev => ({ ...prev, [f.key]: e.target.value }))}
                >
                  <option value="">-- تجاهل --</option>
                  {headers.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">إلغاء</Button>
          </DialogClose>
          {rows.length > 0 && (
            <Button onClick={handleImport}>استيراد</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
