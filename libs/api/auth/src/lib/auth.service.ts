import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';

export interface User {
  id: string;
  username: string;
  password?: string;
  password_hash?: string;
}

export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env['SUPABASE_URL'] || '';
    const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || '';
    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        'Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are not set.',
      );
    }
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  public async getUserByUsername(
    username: string,
  ): Promise<Omit<User, 'password' | 'password_hash'> | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, username')
      .eq('username', username)
      .single();

    if (error || !data) return null;
    return { id: data.id, username: data.username };
  }

  // register a new user
  public async register(
    username: string,
    password: string,
  ): Promise<{
    success: boolean;
    message: string;
    user?: Omit<User, 'password' | 'password_hash'>;
  }> {
    try {
      const password_hash = await bcrypt.hash(password, 10);
      const id = Date.now().toString();

      const { error } = await this.supabase
        .from('users')
        .insert([{ id, username, password_hash }]);

      if (error) {
        if (error.code === '23505') {
          // unique violation
          return { success: false, message: 'Username already exists' };
        }
        return {
          success: false,
          message: 'Registration failed: ' + error.message,
        };
      }

      return {
        success: true,
        message: 'Registration successful',
        user: { id, username },
      };
    } catch (err: any) {
      return { success: false, message: 'Registration failed: ' + err.message };
    }
  }

  // login an existing user
  public async login(
    username: string,
    password: string,
  ): Promise<{
    success: boolean;
    message: string;
    user?: Omit<User, 'password' | 'password_hash'>;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('id, username, password_hash')
        .eq('username', username)
        .single();

      if (error || !data) {
        return { success: false, message: 'Invalid username or password' };
      }

      const isValid = await bcrypt.compare(password, data.password_hash);

      if (!isValid) {
        return { success: false, message: 'Invalid username or password' };
      }

      return {
        success: true,
        message: 'Login successful',
        user: { id: data.id, username: data.username },
      };
    } catch (err: any) {
      return { success: false, message: 'Login failed: ' + err.message };
    }
  }
}
