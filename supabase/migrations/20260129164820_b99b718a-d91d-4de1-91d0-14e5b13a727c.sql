-- Drop existing INSERT policy on user_roles
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;

-- Create new policy allowing first user to become admin OR existing admins to add roles
CREATE POLICY "Admins can insert roles or first admin setup" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (
  is_admin() OR (
    NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
    AND role = 'admin'
    AND user_id = auth.uid()
  )
);