-- Cria a tabela profiles se não existir
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  bio TEXT,
  company_name TEXT,
  industry TEXT,
  target_audience TEXT,
  company_description TEXT,
  instagram_username TEXT,
  employee_count TEXT
);

-- Adiciona RLS (Row Level Security) para a tabela
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Cria política para permitir leitura de qualquer perfil para usuários autenticados
CREATE POLICY "Qualquer pessoa pode ver perfis" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

-- Cria política para permitir que usuários editem apenas seus próprios perfis
CREATE POLICY "Usuários podem editar seus próprios perfis" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Cria política para permitir que usuários insiram seus próprios perfis
CREATE POLICY "Usuários podem inserir seus próprios perfis" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Adiciona trigger para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column(); 