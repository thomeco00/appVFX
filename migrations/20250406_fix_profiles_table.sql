-- Verificando colunas da tabela profiles
DO $$
BEGIN
    -- Adicionar coluna avatar_url se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
        RAISE NOTICE 'Coluna avatar_url adicionada';
    ELSE
        RAISE NOTICE 'Coluna avatar_url já existe';
    END IF;
    
    -- Adicionar coluna full_name se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'full_name'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
        RAISE NOTICE 'Coluna full_name adicionada';
    ELSE
        RAISE NOTICE 'Coluna full_name já existe';
    END IF;
    
    -- Adicionar coluna username se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'username'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN username TEXT;
        RAISE NOTICE 'Coluna username adicionada';
    ELSE
        RAISE NOTICE 'Coluna username já existe';
    END IF;

    -- Adicionar coluna subscription_tier se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'subscription_tier'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN subscription_tier TEXT DEFAULT 'free';
        RAISE NOTICE 'Coluna subscription_tier adicionada';
    ELSE
        RAISE NOTICE 'Coluna subscription_tier já existe';
    END IF;

    -- Adicionar coluna subscription_status se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'subscription_status'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN subscription_status TEXT DEFAULT 'active';
        RAISE NOTICE 'Coluna subscription_status adicionada';
    ELSE
        RAISE NOTICE 'Coluna subscription_status já existe';
    END IF;
END $$; 