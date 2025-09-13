# ⚡ البدء السريع - متجر ملهمون للكتب

## 🚀 التثبيت في 5 دقائق

### 1. **المتطلبات**
```bash
# تحقق من Node.js (يجب أن يكون 18+)
node --version

# تثبيت Firebase CLI
npm install -g firebase-tools
```

### 2. **استنساخ المشروع**
```bash
git clone https://github.com/your-username/molhemon-web-bookStores.git
cd molhemon-web-bookStores
```

### 3. **تثبيت التبعيات**
```bash
npm install
cd functions && npm install && cd ..
```

### 4. **إعداد Firebase**
```bash
# تسجيل الدخول
firebase login

# ربط المشروع (إذا لم يكن مربوطاً)
firebase use --add
# اختر: molhem-book-store
```

### 5. **تشغيل المشروع**
```bash
# تشغيل التطبيق
npm run dev
```

**🎉 تم!** التطبيق يعمل على: http://localhost:5173

---

## 📋 الأوامر الأساسية

```bash
# التطوير
npm run dev                    # تشغيل التطبيق
npm run build                  # بناء للإنتاج

# Firebase
firebase deploy                # نشر كل شيء
firebase deploy --only hosting # نشر الموقع فقط
firebase deploy --only functions # نشر Functions فقط

# Emulators
npm run firebase:emulators     # تشغيل Firebase Emulators
```

---

## 🔗 الروابط المهمة

- **الموقع الرئيسي:** http://localhost:5173
- **لوحة التحكم:** http://localhost:5173/dashboard
- **إعدادات المتجر:** http://localhost:5173/store-settings

---

## 🆘 مشاكل شائعة

### **خطأ في التثبيت:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **مشكلة Firebase:**
```bash
firebase logout
firebase login
firebase use
```

### **مشكلة البناء:**
```bash
rm -rf dist
npm run build
```

---

## 📖 دليل مفصل

للحصول على دليل مفصل، راجع: [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)

---

**🚀 استمتع بالعمل مع متجر ملهمون!**
