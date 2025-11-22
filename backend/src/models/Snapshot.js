import supabase from '../config/supabase.js';

export class Snapshot {
  static async findAll() {
    const { data, error } = await supabase
      .from('snapshots')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('snapshots')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByClient(clientId, limit = null) {
    let query = supabase
      .from('snapshots')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async findByClientAndDateRange(clientId, startDate, endDate) {
    const { data, error } = await supabase
      .from('snapshots')
      .select('*')
      .eq('client_id', clientId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async findLatestByClient(clientId) {
    const { data, error } = await supabase
      .from('snapshots')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async create(data) {
    const {
      clientId,
      date,
      totalValueUsd,
      hodlValueUsd,
      gainPercent,
      apy,
      btcPrice,
      ethPrice,
      solPrice
    } = data;

    // Upsert - insere ou atualiza se já existir para o mesmo client_id e date
    const { data: snapshot, error } = await supabase
      .from('snapshots')
      .upsert({
        client_id: clientId,
        date,
        total_value_usd: totalValueUsd,
        hodl_value_usd: hodlValueUsd,
        gain_percent: gainPercent,
        apy,
        btc_price: btcPrice || null,
        eth_price: ethPrice || null,
        sol_price: solPrice || null
      }, {
        onConflict: 'client_id,date'
      })
      .select()
      .single();

    if (error) throw error;
    return snapshot;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('snapshots')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { changes: 1 };
  }

  static async deleteByClient(clientId) {
    const { error } = await supabase
      .from('snapshots')
      .delete()
      .eq('client_id', clientId);

    if (error) throw error;
    return { changes: 1 };
  }
}

export default Snapshot;
