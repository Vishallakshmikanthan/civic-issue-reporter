-- Trigger to automatically create a profile when a new user signs up via Supabase Auth

-- 1. Create the Function
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, auth_id, role, full_name)
  values (
    new.id,              -- The UUID from auth.users
    new.email,          -- Using email as the display ID/Auth ID for now
    'citizen',          -- Default role
    split_part(new.email, '@', 1) -- Default name from email
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Create the Trigger
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
