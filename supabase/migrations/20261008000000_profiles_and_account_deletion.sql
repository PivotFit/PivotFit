-- Profiles: one row per auth user, holding app-level account data and the
-- consent record captured at signup (which Terms version, and when).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  terms_version text,
  terms_accepted_at timestamptz,
  age_confirmed boolean not null default false
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- Create the profile automatically when someone signs up. Consent fields come
-- from the metadata sent by the signup form; the timestamp is set server-side.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, terms_version, terms_accepted_at, age_confirmed)
  values (
    new.id,
    new.raw_user_meta_data ->> 'terms_version',
    case when new.raw_user_meta_data ->> 'terms_version' is not null then now() end,
    coalesce((new.raw_user_meta_data ->> 'age_confirmed')::boolean, false)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lets a signed-in user permanently delete their own account. Deleting the
-- auth user cascades to profiles and to any future tables that reference
-- auth.users with "on delete cascade" (workouts, sessions, etc.).
create function public.delete_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.delete_account() from public, anon;
grant execute on function public.delete_account() to authenticated;
