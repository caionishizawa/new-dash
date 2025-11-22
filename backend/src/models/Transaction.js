import supabase from '../config/supabase.js';

export class Transaction {
  static async findAll() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('id', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByClient(clientId, limit = null) {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false })
      .order('id', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async findByClientAndDateRange(clientId, startDate, endDate) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('client_id', clientId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getInitialTransactions(clientId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('client_id', clientId)
      .eq('type', 'buy')
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getTotalInvested(clientId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('type, total_usd')
      .eq('client_id', clientId);

    if (error) throw error;

    let total = 0;
    data.forEach(tx => {
      if (['deposit', 'buy'].includes(tx.type)) {
        total += tx.total_usd;
      } else if (['withdrawal', 'sell', 'fee'].includes(tx.type)) {
        total -= tx.total_usd;
      }
    });

    return total;
  }

  static async create(data) {
    const { clientId, date, type, asset, quantity, priceUsd, totalUsd, notes } = data;

    const { data: newTransaction, error } = await supabase
      .from('transactions')
      .insert({
        client_id: clientId,
        date,
        type,
        asset,
        quantity,
        price_usd: priceUsd,
        total_usd: totalUsd,
        notes: notes || null
      })
      .select()
      .single();

    if (error) throw error;
    return newTransaction;
  }

  static async update(id, data) {
    const updates = {};

    if (data.date !== undefined) updates.date = data.date;
    if (data.type !== undefined) updates.type = data.type;
    if (data.asset !== undefined) updates.asset = data.asset;
    if (data.quantity !== undefined) updates.quantity = data.quantity;
    if (data.priceUsd !== undefined) updates.price_usd = data.priceUsd;
    if (data.totalUsd !== undefined) updates.total_usd = data.totalUsd;
    if (data.notes !== undefined) updates.notes = data.notes;

    const { data: updated, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { changes: 1 };
  }
}

export default Transaction;
