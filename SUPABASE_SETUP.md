# Supabase Setup Instructions

## 1. Environment Variables
Add to `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 2. Storage Bucket Setup
In Supabase Dashboard:
1. Go to Storage
2. Create new bucket: `company-logos`
3. Make it PUBLIC
4. Set allowed file types: `image/png, image/jpeg`
5. Max file size: 2MB

## 3. User Login Flow
When user logs in, store in localStorage:
```javascript
localStorage.setItem('arento_user', JSON.stringify({
  user_id: 'uuid',
  client_id: 'uuid',
  user_fullname: 'name',
  role: 'Owner'
}));
```

## 4. Multi-Tenancy
- All queries filter by `client_id`
- RLS policies enforce data isolation
- Users only see their client's data
- `client_id` stored in localStorage but hidden from UI
