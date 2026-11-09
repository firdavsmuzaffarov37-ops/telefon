import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://igpkeqbbaluqhjleennx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Fkw-x7uYY9mgQGU6snR4VA_5IEV8Wb9';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      // Table might not exist yet, but client connects to Supabase endpoint
      return { connected: true, tablesReady: false, message: error.message };
    }
    return { connected: true, tablesReady: true };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

// Supabase Data Sync Helpers
export const supabaseService = {
  // Products
  async getProducts() {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase getProducts warning:', e.message);
      return null;
    }
  },

  async upsertProduct(product) {
    try {
      const payload = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        model: product.model,
        storage: product.storage,
        ram: product.ram,
        color: product.color,
        colors: product.colors,
        sku: product.sku,
        imei: product.imei,
        purchase_price: Number(product.purchasePrice),
        selling_price: Number(product.sellingPrice),
        stock: Number(product.stock),
        min_stock_threshold: Number(product.minStockThreshold || 5),
        tag: product.tag,
        tag_type: product.tagType,
        status: product.status,
        image: product.image,
        description: product.description,
        views: product.views,
        rating: Number(product.rating || 4.8),
        units_sold: Number(product.unitsSold || 0),
        specs: product.specs,
        updated_at: new Date().toISOString()
      };
      const { data, error } = await supabase.from('products').upsert(payload);
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase upsertProduct warning:', e.message);
      return null;
    }
  },

  async deleteProduct(id) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteProduct warning:', e.message);
      return false;
    }
  },

  // Transactions
  async getTransactions() {
    try {
      const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase getTransactions warning:', e.message);
      return null;
    }
  },

  async insertTransaction(txn) {
    try {
      const payload = {
        id: txn.id,
        product_id: txn.productId,
        product_name: txn.productName,
        brand: txn.brand,
        quantity: Number(txn.quantity),
        purchase_price: Number(txn.purchasePrice),
        selling_price: Number(txn.sellingPrice),
        discount: Number(txn.discount || 0),
        revenue: Number(txn.revenue),
        cost: Number(txn.cost),
        profit: Number(txn.profit),
        payment_method: txn.paymentMethod,
        customer_name: txn.customerName,
        customer_phone: txn.customerPhone,
        imei: txn.imei,
        date: txn.date,
        status: txn.status || 'Completed'
      };
      const { data, error } = await supabase.from('transactions').insert([payload]);
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase insertTransaction warning:', e.message);
      return null;
    }
  },

  // Daily Reports
  async getDailyReports() {
    try {
      const { data, error } = await supabase.from('daily_reports').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase getDailyReports warning:', e.message);
      return null;
    }
  },

  async saveDailyReport(report) {
    try {
      const payload = {
        id: report.id,
        date: report.date,
        phones_sold: Number(report.phonesSold),
        revenue: Number(report.revenue),
        purchase_cost: Number(report.purchaseCost),
        discounts: Number(report.discounts || 0),
        gross_profit: Number(report.grossProfit),
        operating_expenses: Number(report.operatingExpenses || 0),
        net_profit: Number(report.netProfit),
        remaining_inventory_count: Number(report.remainingInventoryCount),
        remaining_stock_value: Number(report.remainingStockValue),
        best_selling_phone: report.bestSellingPhone,
        best_performing_brand: report.bestPerformingBrand,
        payment_breakdown: report.paymentBreakdown,
        notes: report.notes
      };
      const { data, error } = await supabase.from('daily_reports').upsert(payload);
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase saveDailyReport warning:', e.message);
      return null;
    }
  }
};

