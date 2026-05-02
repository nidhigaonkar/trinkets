
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Friends table
CREATE TABLE public.friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birthday TEXT,
  notes TEXT,
  interests JSONB NOT NULL DEFAULT '[]'::jsonb,
  aesthetics JSONB NOT NULL DEFAULT '[]'::jsonb,
  favorites JSONB NOT NULL DEFAULT '[]'::jsonb,
  clothing_sizes JSONB NOT NULL DEFAULT '{}'::jsonb,
  moodboard JSONB NOT NULL DEFAULT '[]'::jsonb,
  gift_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
CREATE INDEX friends_user_id_idx ON public.friends(user_id);

CREATE POLICY "friends_select_own" ON public.friends FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "friends_insert_own" ON public.friends FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "friends_update_own" ON public.friends FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "friends_delete_own" ON public.friends FOR DELETE USING (auth.uid() = user_id);

-- Wishlist items
CREATE TABLE public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT,
  description TEXT,
  price_range TEXT,
  emoji TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
CREATE INDEX wishlist_items_user_id_idx ON public.wishlist_items(user_id);

CREATE POLICY "wishlist_select_own" ON public.wishlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wishlist_insert_own" ON public.wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlist_update_own" ON public.wishlist_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "wishlist_delete_own" ON public.wishlist_items FOR DELETE USING (auth.uid() = user_id);

-- Liked inspiration items
CREATE TABLE public.liked_inspiration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  inspiration_key TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, inspiration_key)
);
ALTER TABLE public.liked_inspiration ENABLE ROW LEVEL SECURITY;
CREATE INDEX liked_inspiration_user_id_idx ON public.liked_inspiration(user_id);

CREATE POLICY "liked_select_own" ON public.liked_inspiration FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "liked_insert_own" ON public.liked_inspiration FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "liked_update_own" ON public.liked_inspiration FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "liked_delete_own" ON public.liked_inspiration FOR DELETE USING (auth.uid() = user_id);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER friends_set_updated_at BEFORE UPDATE ON public.friends
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
