insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pet-images',
  'pet-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Clean re-apply policies to keep SQL idempotent

drop policy if exists "Public read pet images" on storage.objects;
drop policy if exists "Authenticated upload pet images" on storage.objects;
drop policy if exists "Authenticated update pet images" on storage.objects;
drop policy if exists "Authenticated delete pet images" on storage.objects;

create policy "Public read pet images"
on storage.objects
for select
using (bucket_id = 'pet-images');

create policy "Authenticated upload pet images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'pet-images');

create policy "Authenticated update pet images"
on storage.objects
for update
to authenticated
using (bucket_id = 'pet-images')
with check (bucket_id = 'pet-images');

create policy "Authenticated delete pet images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'pet-images');
