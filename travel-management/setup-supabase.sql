-- Create users table (extending Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create travels table
CREATE TABLE IF NOT EXISTS public.travels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location TEXT NOT NULL,
  travel_agency TEXT,
  commission DECIMAL(10, 2),
  total_fee DECIMAL(10, 2),
  status TEXT NOT NULL CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create participants table
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  travel_id UUID NOT NULL REFERENCES public.travels(id) ON DELETE CASCADE,
  amount_paid DECIMAL(10, 2) DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('registered', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create finances table
CREATE TABLE IF NOT EXISTS public.finances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  travel_id UUID REFERENCES public.travels(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  organization TEXT,
  role TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "Admins can do everything" ON public.travels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can do everything" ON public.participants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can do everything" ON public.finances
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can do everything" ON public.contacts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Regular users can read travels and participants
CREATE POLICY "Users can view all travels" ON public.travels
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'user'
    )
  );

CREATE POLICY "Users can view all participants" ON public.participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'user'
    )
  );

-- Regular users can only read limited financial info
CREATE POLICY "Users can view limited finances" ON public.finances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'user'
    )
  );

-- Regular users can read and create contacts
CREATE POLICY "Users can view and create contacts" ON public.contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
    )
  );

CREATE POLICY "Users can create contacts" ON public.contacts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
    )
  );

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_travels_updated_at
  BEFORE UPDATE ON public.travels
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_participants_updated_at
  BEFORE UPDATE ON public.participants
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_finances_updated_at
  BEFORE UPDATE ON public.finances
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column(); 