export async function purchasePlan(api, plan, paymentMethodId = 1) {
  const customerId = localStorage.getItem('currentUserId') || 1;
  const now = new Date();
  const startDate = now.toISOString();
  const endDate = new Date(now.getTime() + plan.duration * 24 * 60 * 60 * 1000).toISOString();
  const subData = {
    customer_id: customerId,
    plan_id: plan.id,
    start_date: startDate,
    end_date: endDate,
    status: 'نشط',
  };
  if (!localStorage.getItem('trialUsed')) {
    subData.trial_end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem('trialUsed', 'true');
  }
  const subscription = await api.addSubscription(subData);
  await api.addPayment({
    customer_id: customerId,
    order_id: null,
    subscription_id: subscription.id,
    payment_method_id: paymentMethodId,
    coupon_id: null,
    amount: plan.price,
    status: subData.trial_end ? 'pending' : 'paid'
  });
  return subscription;
}

