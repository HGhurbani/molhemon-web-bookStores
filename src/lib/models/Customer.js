/**
 * نموذج بيانات العميل
 */

export class Customer {
  constructor(data = {}) {
    // معلومات أساسية
    this.id = data.id || null;
    this.email = data.email || '';
    this.displayName = data.displayName || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.phone = data.phone || '';
    this.dateOfBirth = data.dateOfBirth || null;
    this.gender = data.gender || ''; // male, female, other
    
    // معلومات الحساب
    this.isActive = data.isActive || true;
    this.isVerified = data.isVerified || false;
    this.verificationToken = data.verificationToken || null;
    this.verificationExpires = data.verificationExpires || null;
    this.lastLogin = data.lastLogin || null;
    this.loginCount = data.loginCount || 0;
    
    // معلومات إضافية
    this.profileImage = data.profileImage || '';
    this.bio = data.bio || '';
    this.preferences = data.preferences || this.getDefaultPreferences();
    
    // العناوين
    this.addresses = data.addresses || [];
    this.defaultShippingAddress = data.defaultShippingAddress || null;
    this.defaultBillingAddress = data.defaultBillingAddress || null;
    
    // طرق الدفع
    this.paymentMethods = data.paymentMethods || [];
    this.defaultPaymentMethod = data.defaultPaymentMethod || null;
    
    // معلومات الطلبات
    this.totalOrders = data.totalOrders || 0;
    this.totalSpent = data.totalSpent || 0;
    this.firstOrderDate = data.firstOrderDate || null;
    this.lastOrderDate = data.lastOrderDate || null;
    
    // معلومات الولاء
    this.loyaltyPoints = data.loyaltyPoints || 0;
    this.loyaltyTier = data.loyaltyTier || 'bronze'; // bronze, silver, gold, platinum
    this.referralCode = data.referralCode || this.generateReferralCode();
    this.referredBy = data.referredBy || null;
    this.referrals = data.referrals || [];
    
    // تواريخ
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // الحصول على التفضيلات الافتراضية
  getDefaultPreferences() {
    return {
      language: 'ar',
      currency: 'SAR',
      timezone: 'Asia/Riyadh',
      emailNotifications: {
        orders: true,
        promotions: true,
        newsletter: true,
        security: true
      },
      smsNotifications: {
        orders: true,
        promotions: false,
        security: true
      },
      pushNotifications: {
        orders: true,
        promotions: true,
        security: true
      },
      privacy: {
        profileVisible: true,
        orderHistoryVisible: true,
        allowMarketing: true
      }
    };
  }

  // إنشاء رمز الإحالة
  generateReferralCode() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `REF-${timestamp}-${random}`.toUpperCase();
  }

  // إضافة عنوان جديد
  addAddress(addressData) {
    // دمج firstName و lastName إلى name إذا كانا موجودين
    const fullName = addressData.firstName && addressData.lastName 
      ? `${addressData.firstName} ${addressData.lastName}`.trim()
      : addressData.name || '';
    
    const address = {
      id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: addressData.type || 'shipping', // shipping, billing, both
      isDefault: addressData.isDefault || false,
      name: fullName,
      firstName: addressData.firstName || '',
      lastName: addressData.lastName || '',
      company: addressData.company || '',
      street: addressData.street || '',
      street2: addressData.street2 || '',
      city: addressData.city || '',
      state: addressData.state || '',
      country: addressData.country || 'SA',
      postalCode: addressData.postalCode || '',
      phone: addressData.phone || this.phone,
      email: addressData.email || this.email,
      notes: addressData.notes || '',
      createdAt: new Date()
    };

    // إذا كان العنوان الافتراضي، إلغاء الافتراضي من العناوين الأخرى
    if (address.isDefault) {
      this.addresses.forEach(addr => {
        if (addr.type === address.type || addr.type === 'both') {
          addr.isDefault = false;
        }
      });
    }

    this.addresses.push(address);

    // تعيين العنوان الافتراضي
    if (address.type === 'shipping' || address.type === 'both') {
      this.defaultShippingAddress = address.id;
    }
    if (address.type === 'billing' || address.type === 'both') {
      this.defaultBillingAddress = address.id;
    }

    return address;
  }

  // تحديث عنوان
  updateAddress(addressId, updateData) {
    const addressIndex = this.addresses.findIndex(addr => addr.id === addressId);
    if (addressIndex === -1) {
      throw new Error('العنوان غير موجود');
    }

    const address = this.addresses[addressIndex];
    Object.assign(address, updateData, { updatedAt: new Date() });

    // إذا تم تغيير النوع أو الافتراضي، تحديث العناوين الأخرى
    if (updateData.isDefault) {
      this.addresses.forEach(addr => {
        if (addr.id !== addressId && (addr.type === address.type || addr.type === 'both')) {
          addr.isDefault = false;
        }
      });
    }

    return address;
  }

  // حذف عنوان
  removeAddress(addressId) {
    const addressIndex = this.addresses.findIndex(addr => addr.id === addressId);
    if (addressIndex === -1) {
      throw new Error('العنوان غير موجود');
    }

    const address = this.addresses[addressIndex];
    this.addresses.splice(addressIndex, 1);

    // إذا كان العنوان المحذوف هو الافتراضي، تعيين عنوان آخر
    if (this.defaultShippingAddress === addressId) {
      const newDefault = this.addresses.find(addr => 
        addr.type === 'shipping' || addr.type === 'both'
      );
      this.defaultShippingAddress = newDefault ? newDefault.id : null;
    }

    if (this.defaultBillingAddress === addressId) {
      const newDefault = this.addresses.find(addr => 
        addr.type === 'billing' || addr.type === 'both'
      );
      this.defaultBillingAddress = newDefault ? newDefault.id : null;
    }

    return { success: true, message: 'تم حذف العنوان بنجاح' };
  }

  // الحصول على العنوان الافتراضي
  getDefaultAddress(type = 'shipping') {
    if (type === 'shipping' && this.defaultShippingAddress) {
      return this.addresses.find(addr => addr.id === this.defaultShippingAddress);
    }
    if (type === 'billing' && this.defaultBillingAddress) {
      return this.addresses.find(addr => addr.id === this.defaultBillingAddress);
    }
    return null;
  }

  // إضافة طريقة دفع جديدة
  addPaymentMethod(paymentData) {
    const paymentMethod = {
      id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: paymentData.type, // credit_card, debit_card, paypal, etc.
      isDefault: paymentData.isDefault || false,
      name: paymentData.name || '',
      last4: paymentData.last4 || '',
      brand: paymentData.brand || '',
      expMonth: paymentData.expMonth || null,
      expYear: paymentData.expYear || null,
      isActive: paymentData.isActive !== false,
      metadata: paymentData.metadata || {},
      createdAt: new Date()
    };

    // إذا كانت طريقة الدفع الافتراضية، إلغاء الافتراضي من الطرق الأخرى
    if (paymentMethod.isDefault) {
      this.paymentMethods.forEach(pm => {
        pm.isDefault = false;
      });
    }

    this.paymentMethods.push(paymentMethod);

    // تعيين طريقة الدفع الافتراضية
    if (paymentMethod.isDefault) {
      this.defaultPaymentMethod = paymentMethod.id;
    }

    return paymentMethod;
  }

  // تحديث طريقة دفع
  updatePaymentMethod(paymentMethodId, updateData) {
    const methodIndex = this.paymentMethods.findIndex(pm => pm.id === paymentMethodId);
    if (methodIndex === -1) {
      throw new Error('طريقة الدفع غير موجودة');
    }

    const method = this.paymentMethods[methodIndex];
    Object.assign(method, updateData, { updatedAt: new Date() });

    // إذا تم تغيير الافتراضي، تحديث الطرق الأخرى
    if (updateData.isDefault) {
      this.paymentMethods.forEach(pm => {
        if (pm.id !== paymentMethodId) {
          pm.isDefault = false;
        }
      });
      this.defaultPaymentMethod = paymentMethodId;
    }

    return method;
  }

  // حذف طريقة دفع
  removePaymentMethod(paymentMethodId) {
    const methodIndex = this.paymentMethods.findIndex(pm => pm.id === paymentMethodId);
    if (methodIndex === -1) {
      throw new Error('طريقة الدفع غير موجودة');
    }

    const method = this.paymentMethods[methodIndex];
    this.paymentMethods.splice(methodIndex, 1);

    // إذا كانت طريقة الدفع المحذوفة هي الافتراضية، تعيين طريقة أخرى
    if (this.defaultPaymentMethod === paymentMethodId) {
      const newDefault = this.paymentMethods.find(pm => pm.isActive);
      this.defaultPaymentMethod = newDefault ? newDefault.id : null;
    }

    return { success: true, message: 'تم حذف طريقة الدفع بنجاح' };
  }

  // الحصول على طريقة الدفع الافتراضية
  getDefaultPaymentMethod() {
    if (this.defaultPaymentMethod) {
      return this.paymentMethods.find(pm => pm.id === this.defaultPaymentMethod);
    }
    return this.paymentMethods.find(pm => pm.isActive) || null;
  }

  // تحديث معلومات الطلبات
  updateOrderInfo(orderAmount) {
    this.totalOrders += 1;
    this.totalSpent += orderAmount;
    
    if (!this.firstOrderDate) {
      this.firstOrderDate = new Date();
    }
    
    this.lastOrderDate = new Date();
    this.updatedAt = new Date();
  }

  // حساب نقاط الولاء
  calculateLoyaltyPoints(orderAmount) {
    const points = Math.floor(orderAmount * 10); // 10 نقاط لكل ريال
    this.loyaltyPoints += points;
    
    // تحديث مستوى الولاء
    this.updateLoyaltyTier();
    
    return points;
  }

  // تحديث مستوى الولاء
  updateLoyaltyTier() {
    if (this.loyaltyPoints >= 10000) {
      this.loyaltyTier = 'platinum';
    } else if (this.loyaltyPoints >= 5000) {
      this.loyaltyTier = 'gold';
    } else if (this.loyaltyPoints >= 1000) {
      this.loyaltyTier = 'silver';
    } else {
      this.loyaltyTier = 'bronze';
    }
  }

  // إضافة إحالة
  addReferral(referralData) {
    const referral = {
      id: referralData.id,
      email: referralData.email,
      name: referralData.name,
      status: 'pending', // pending, completed, cancelled
      reward: 0,
      createdAt: new Date()
    };

    this.referrals.push(referral);
    return referral;
  }

  // التحقق من صحة البيانات
  validate() {
    const errors = [];
    
    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('البريد الإلكتروني غير صحيح');
    }
    
    if (!this.displayName || this.displayName.trim().length === 0) {
      errors.push('اسم العرض مطلوب');
    }
    
    if (this.phone && !this.isValidPhone(this.phone)) {
      errors.push('رقم الهاتف غير صحيح');
    }
    
    return errors;
  }

  // التحقق من صحة البريد الإلكتروني
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // التحقق من صحة رقم الهاتف
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
  }

  // الحصول على الاسم الكامل
  getFullName() {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.displayName;
  }

  // الحصول على عمر العميل
  getAge() {
    if (!this.dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // تحويل إلى كائن عادي
  toObject() {
    return {
      id: this.id,
      email: this.email,
      displayName: this.displayName,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      isActive: this.isActive,
      isVerified: this.isVerified,
      verificationToken: this.verificationToken,
      verificationExpires: this.verificationExpires,
      lastLogin: this.lastLogin,
      loginCount: this.loginCount,
      profileImage: this.profileImage,
      bio: this.bio,
      preferences: this.preferences,
      addresses: this.addresses,
      defaultShippingAddress: this.defaultShippingAddress,
      defaultBillingAddress: this.defaultBillingAddress,
      paymentMethods: this.paymentMethods,
      defaultPaymentMethod: this.defaultPaymentMethod,
      totalOrders: this.totalOrders,
      totalSpent: this.totalSpent,
      firstOrderDate: this.firstOrderDate,
      lastOrderDate: this.lastOrderDate,
      loyaltyPoints: this.loyaltyPoints,
      loyaltyTier: this.loyaltyTier,
      referralCode: this.referralCode,
      referredBy: this.referredBy,
      referrals: this.referrals,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // إنشاء من كائن
  static fromObject(data) {
    return new Customer(data);
  }
}

export default Customer;



