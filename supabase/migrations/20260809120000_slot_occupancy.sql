-- Function to retrieve booked slot counts per time slot for a specific date
CREATE OR REPLACE FUNCTION public.get_slot_occupancy(target_date date)
RETURNS TABLE (preferred_time text, booked_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT preferred_time, COUNT(*)::bigint AS booked_count
  FROM public.appointments
  WHERE preferred_date = target_date
    AND status != 'cancelled'
  GROUP BY preferred_time;
$$;

-- Grant execution permission to anonymous visitors and authenticated users
GRANT EXECUTE ON FUNCTION public.get_slot_occupancy(date) TO anon, authenticated;
