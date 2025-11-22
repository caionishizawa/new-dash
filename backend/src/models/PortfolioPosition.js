import supabase from '../config/supabase.js';

export class PortfolioPosition {
  static async findAll() {
    const { data, error } = await supabase
      .from('portfolio_positions')
      .select('*')
      .order('client_id')
      .order('asset');

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('portfolio_positions')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByClient(clientId) {
    const { data, error } = await supabase
      .from('portfolio_positions')
      .select('*')
      .eq('client_id', clientId)
      .order('asset');

    if (error) throw error;
    return data;
  }

  static async findByClientAndAsset(clientId, asset, protocol = null) {
    let query = supabase
      .from('portfolio_positions')
      .select('*')
      .eq('client_id', clientId)
      .eq('asset', asset);

    if (protocol) {
      query = query.eq('protocol', protocol);
    } else {
      query = query.is('protocol', null);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async create(data) {
    const {
      clientId,
      asset,
      quantity,
      avgBuyPrice,
      currentPrice,
      protocol = null,
      chain = null
    } = data;

    // Upsert - insere ou atualiza se já existir
    const { data: position, error } = await supabase
      .from('portfolio_positions')
      .upsert({
        client_id: clientId,
        asset,
        quantity,
        avg_buy_price: avgBuyPrice,
        current_price: currentPrice,
        protocol,
        chain,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'client_id,asset,protocol'
      })
      .select()
      .single();

    if (error) throw error;
    return position;
  }

  static async update(id, data) {
    const updates = { updated_at: new Date().toISOString() };

    if (data.quantity !== undefined) updates.quantity = data.quantity;
    if (data.avgBuyPrice !== undefined) updates.avg_buy_price = data.avgBuyPrice;
    if (data.currentPrice !== undefined) updates.current_price = data.currentPrice;
    if (data.protocol !== undefined) updates.protocol = data.protocol;
    if (data.chain !== undefined) updates.chain = data.chain;

    const { data: updated, error } = await supabase
      .from('portfolio_positions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('portfolio_positions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { changes: 1 };
  }

  static async deleteByClient(clientId) {
    const { error } = await supabase
      .from('portfolio_positions')
      .delete()
      .eq('client_id', clientId);

    if (error) throw error;
    return { changes: 1 };
  }

  static async updateCurrentPrices(clientId, prices) {
    const positions = await this.findByClient(clientId);

    for (const position of positions) {
      if (prices[position.asset]) {
        await this.update(position.id, { currentPrice: prices[position.asset] });
      }
    }
  }
}

export default PortfolioPosition;
