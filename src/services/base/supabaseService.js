import { supabase } from '@/lib/supabase';

export class SupabaseService {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async select(query = '*', options = {}) {
    const { 
      filters = [], 
      orderBy = null, 
      ascending = false,
      single = false 
    } = options;

    let queryBuilder = supabase
      .from(this.tableName)
      .select(query);

    // Apply filters
    filters.forEach(filter => {
      queryBuilder = queryBuilder.eq(filter.field, filter.value);
    });

    // Apply ordering
    if (orderBy) {
      queryBuilder = queryBuilder.order(orderBy, { ascending });
    }

    // Get single result if specified
    if (single) {
      queryBuilder = queryBuilder.single();
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data;
  }

  async insert(data, options = {}) {
    const { select = false, single = false } = options;
    let query = supabase
      .from(this.tableName)
      .insert(data);

    if (select) {
      query = query.select();
      if (single) {
        query = query.single();
      }
    }

    const { data: result, error } = await query;

    if (error) throw error;
    return result;
  }

  async update(id, data) {
    const { error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id);

    if (error) throw error;
  }

  async delete(id) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
} 