-- Migration to create collection_items table and storage bucket for portfolio image management

-- 1. Create collection_items table
CREATE TABLE IF NOT EXISTS public.collection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text,
  src text NOT NULL,
  alt text,
  width integer DEFAULT 1200,
  height integer DEFAULT 1000,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Grants & RLS for collection_items
GRANT SELECT ON public.collection_items TO anon, authenticated;
GRANT ALL ON public.collection_items TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.collection_items TO authenticated;

ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view collection items"
  ON public.collection_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert collection items"
  ON public.collection_items
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update collection items"
  ON public.collection_items
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete collection items"
  ON public.collection_items
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS collection_items_category_idx ON public.collection_items (category);
CREATE INDEX IF NOT EXISTS collection_items_order_idx ON public.collection_items (display_order ASC, created_at DESC);

-- 3. Storage Bucket Setup for 'collections'
INSERT INTO storage.buckets (id, name, public)
VALUES ('collections', 'collections', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Storage Bucket 'collections'
CREATE POLICY "Public Read Collections Bucket"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'collections');

CREATE POLICY "Admin Insert Collections Bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'collections' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin Update Collections Bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'collections' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin Delete Collections Bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'collections' AND public.has_role(auth.uid(), 'admin'));
