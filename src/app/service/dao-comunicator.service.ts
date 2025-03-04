import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthResponse, createClient } from '@supabase/supabase-js';
import { from, map, Observable } from 'rxjs';
import { IClient } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class DaoComunicatorService {
  supabase = createClient(environment.supabase.url, environment.supabase.key);
  currentUser = signal<{ email: string; username: string } | null>(null);
  tableName = signal('');

  constructor() {
    this.tableName.set(localStorage.getItem('client')!)
  }

  register(email: string, username: string, password: string): Observable<AuthResponse> {
    const promise = this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      }
    })
    return from(promise);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const promise = this.supabase.auth.signInWithPassword({
      email,
      password
    });
    return from(promise);
  }

  updateUser(email: string, username: string, phone: string) {
    const promise = this.supabase.auth.updateUser({
      data: {
        username,
        email,
        phone,
      }
    })
    return from(promise)
  }

  getClients(): Observable<IClient[]> {
    const promise = this.supabase.from(this.tableName()).select('*');
    return from(promise).pipe(
      map((response) => {
        return response.data ?? [];
      })
    )
  }

  async saveClient(client: IClient) {
    const { error } = await this.supabase
      .from(this.tableName())
      .insert([client])
      .select();

    return { error };
  }

  async updateClient(client: IClient) {
    const { data, error } = await this.supabase
      .from(this.tableName())
      .update(client)
      .eq('id', client.id)
      .select();

    return { data, error }
  }

  async deleteClient(client: IClient) {
    const { error } = await this.supabase
      .from(this.tableName())
      .delete()
      .eq('id', client)
  }

  logout() {
    this.supabase.auth.signOut();
  }
}
