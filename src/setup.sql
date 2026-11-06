-- CSE 340 - Week 02
-- Database Setup

-- Create organization table

CREATE TABLE IF NOT EXISTS public.organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Insert organizations if they do not already exist

INSERT INTO public.organization
(name, description, contact_email, logo_filename)
SELECT
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
WHERE NOT EXISTS (
    SELECT 1 FROM public.organization
    WHERE name = 'BrightFuture Builders'
);

INSERT INTO public.organization
(name, description, contact_email, logo_filename)
SELECT
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
WHERE NOT EXISTS (
    SELECT 1 FROM public.organization
    WHERE name = 'GreenHarvest Growers'
);

INSERT INTO public.organization
(name, description, contact_email, logo_filename)
SELECT
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
WHERE NOT EXISTS (
    SELECT 1 FROM public.organization
    WHERE name = 'UnityServe Volunteers'
);

-- Display all organizations

SELECT * FROM public.organization
ORDER BY organization_id;