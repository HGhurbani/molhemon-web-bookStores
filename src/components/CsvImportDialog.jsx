import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from './ui/dialog.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';

// Available book fields that can be mapped when importing
// Feel free to extend this list if the schema changes
const FIELDS = [
  { key: 'title', label: 'العنوان' },
  { key: 'author', label: 'المؤلف' },
  { key: 'price', label: 'السعر' },
  { key: 'originalPrice', label: 'السعر الأصلي' },
  { key: 'category', label: 'الفئة' },
  { key: 'coverImage', label: 'صورة الغلاف' },
  { key: 'description', label: 'الوصف' },
  { key: 'tags', label: 'الوسوم' },
  { key: 'type', label: 'نوع الكتاب' },
  { key: 'deliveryMethod', label: 'طريقة التوصيل' },
  { key: 'ebookFile', label: 'ملف إلكتروني' },
  { key: 'audioFile', label: 'ملف صوتي' },
  { key: 'sampleAudio', label: 'عينة صوتية' },
  { key: 'imgPlaceholder', label: 'وصف الصورة' },
];

export default function CsvImportDialog({ open, onOpenChange, onImport }) {
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({});

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const lower = file.name.toLowerCase();
    const isCsv = lower.endsWith('.csv');
    const isJson = lower.endsWith('.json');

    if (isJson) {
      try {
        let data = JSON.parse(await file.text());
        if (!Array.isArray(data)) data = [data];
        setHeaders(Object.keys(data[0] || {}));
        setRows(data);
      } catch {
        setHeaders([]);
        setRows([]);
      }
      return;
    }

    const workbook = new ExcelJS.Workbook();
    try {
      if (isCsv) {
        await workbook.csv.read(await file.text());
      } else {
        await workbook.xlsx.load(await file.arrayBuffer());
      }
      const worksheet = workbook.worksheets[0];
      const sheetValues = worksheet.getSheetValues();
      const hdrs = (sheetValues[1] || []).slice(1).map(v => {
        if (v && typeof v === 'object' && 'text' in v) return v.text;
        return v ?? '';
      });
      const data = [];
      for (let i = 2; i < sheetValues.length; i++) {
        const row = sheetValues[i] || [];
        const obj = {};
        hdrs.forEach((h, idx) => {
          let cell = row[idx + 1];
          if (cell && typeof cell === 'object' && 'text' in cell) cell = cell.text;
          obj[h] = cell ?? '';
        });
        if (Object.values(obj).some(val => val !== '')) data.push(obj);
      }
      setHeaders(hdrs);
      setRows(data);
    } catch {
      setHeaders([]);
      setRows([]);
    }
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
      if (b.originalPrice) b.originalPrice = parseFloat(b.originalPrice) || 0;
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
          <DialogTitle>استيراد كتب من ملف CSV أو Excel أو JSON</DialogTitle>
        </DialogHeader>
        {!rows.length ? (
          <div>
            <Label htmlFor="xls-file">اختر ملف CSV أو Excel أو JSON</Label>
            <Input id="xls-file" type="file" accept=".csv,.xls,.xlsx,.json" onChange={handleFile} />
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
