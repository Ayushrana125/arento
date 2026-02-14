import { supabase } from './supabase';

export interface UserPermissions {
  addSalesPurchase: boolean;
  addInventory: boolean;
  modifyDeleteInventory: boolean;
  exportInventory: boolean;
}

let cachedPermissions: UserPermissions | null = null;
let cachedRole: string | null = null;

export async function getUserPermissions(): Promise<UserPermissions> {
  const userData = localStorage.getItem('arento_user');
  if (!userData) {
    return {
      addSalesPurchase: false,
      addInventory: false,
      modifyDeleteInventory: false,
      exportInventory: false,
    };
  }

  const parsed = JSON.parse(userData);
  const userRole = parsed.role;
  const clientId = parsed.client_id;

  // Return cached permissions if role hasn't changed
  if (cachedRole === userRole && cachedPermissions) {
    return cachedPermissions;
  }

  // Owner has all permissions
  if (userRole?.toLowerCase() === 'owner') {
    const permissions = {
      addSalesPurchase: true,
      addInventory: true,
      modifyDeleteInventory: true,
      exportInventory: true,
    };
    cachedPermissions = permissions;
    cachedRole = userRole;
    return permissions;
  }

  // Fetch permissions from database
  if (!supabase || !clientId || !userRole) {
    return {
      addSalesPurchase: false,
      addInventory: false,
      modifyDeleteInventory: false,
      exportInventory: false,
    };
  }

  const { data } = await supabase
    .from('roles_management')
    .select('*')
    .eq('client_id', clientId)
    .eq('role_name', userRole)
    .single();

  if (data) {
    const permissions = {
      addSalesPurchase: data.add_sales_purchase === 0,
      addInventory: data.add_inventory === 0,
      modifyDeleteInventory: data.modify_delete_inventory === 0,
      exportInventory: data.export_inventory === 0,
    };
    cachedPermissions = permissions;
    cachedRole = userRole;
    return permissions;
  }

  return {
    addSalesPurchase: false,
    addInventory: false,
    modifyDeleteInventory: false,
    exportInventory: false,
  };
}

export function clearPermissionsCache() {
  cachedPermissions = null;
  cachedRole = null;
}
