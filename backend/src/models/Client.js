import supabase from '../config/supabase.js';

export class Client {
  static async findAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async create(data) {
    const { name, email, passwordHash, role = 'client', entryDate } = data;

    const { data: newClient, error } = await supabase
      .from('clients')
      .insert({
        name,
        email,
        password_hash: passwordHash,
        role,
        entry_date: entryDate
      })
      .select()
      .single();

    if (error) throw error;
    return newClient;
  }

  static async update(id, data) {
    const updates = {};

    if (data.name !== undefined) updates.name = data.name;
    if (data.email !== undefined) updates.email = data.email;
    if (data.passwordHash !== undefined) updates.password_hash = data.passwordHash;
    if (data.isActive !== undefined) updates.is_active = data.isActive;
    updates.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('clients')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return { changes: 1 };
  }

  static getDaysSinceEntry(entryDate) {
    const entry = new Date(entryDate);
    const now = new Date();
    const diffTime = Math.abs(now - entry);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}

export default Client;
