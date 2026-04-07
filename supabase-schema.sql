-- Run this in Supabase Dashboard → SQL Editor

create table if not exists saved_activities (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  activity_id  text not null,
  name         text not null,
  type         text,
  image_url    text,
  address      text,
  cost_label   text,
  distance     numeric,
  created_at   timestamptz default now()
);

-- Each user can save an activity only once
create unique index if not exists saved_activities_user_activity
  on saved_activities(user_id, activity_id);

-- Enable Row Level Security
alter table saved_activities enable row level security;

-- Users can only see and manage their own saved activities
create policy "Users can view own saved activities"
  on saved_activities for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved activities"
  on saved_activities for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own saved activities"
  on saved_activities for delete
  using (auth.uid() = user_id);
