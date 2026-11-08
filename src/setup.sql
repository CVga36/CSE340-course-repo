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
-- ========================================
-- CSE 340 - Week 02
-- Service Projects Table
-- ========================================

CREATE TABLE IF NOT EXISTS public.project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES public.organization(organization_id)
);


-- ========================================
-- Service Categories Table
-- ========================================

CREATE TABLE IF NOT EXISTS public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


-- ========================================
-- Project Category Relationships
-- ========================================

CREATE TABLE IF NOT EXISTS public.project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project_category_project
        FOREIGN KEY (project_id)
        REFERENCES public.project(project_id),

    CONSTRAINT fk_project_category_category
        FOREIGN KEY (category_id)
        REFERENCES public.category(category_id)
);
-- ========================================
-- Insert Service Projects
-- ========================================

INSERT INTO public.project
    (organization_id, title, description, location, project_date)

SELECT
    o.organization_id,
    s.title,
    s.description,
    s.location,
    s.project_date::DATE

FROM (
    VALUES

    -- BrightFuture Builders

    ('BrightFuture Builders',
     'Community Center Renovation',
     'Help renovate and improve a local community center.',
     'Community Center', '2026-11-16'),

    ('BrightFuture Builders',
     'School Painting Project',
     'Paint classrooms and improve school facilities.',
     'Local Elementary School', '2026-11-20'),

    ('BrightFuture Builders',
     'Playground Construction',
     'Build a safe playground for children.',
     'Community Park', '2026-11-25'),

    ('BrightFuture Builders',
     'Home Repair Assistance',
     'Help families with basic home repairs.',
     'Residential Neighborhood', '2026-12-02'),

    ('BrightFuture Builders',
     'Community Library Improvement',
     'Repair shelves and improve the local library.',
     'Public Library', '2026-12-05'),

    -- GreenHarvest Growers

    ('GreenHarvest Growers',
     'Community Garden Project',
     'Create and maintain a community vegetable garden.',
     'Community Garden', '2026-11-17'),

    ('GreenHarvest Growers',
     'Urban Tree Planting',
     'Plant trees to improve neighborhood green spaces.',
     'City Park', '2026-11-22'),

    ('GreenHarvest Growers',
     'Food Sustainability Workshop',
     'Teach families how to grow vegetables at home.',
     'Community Center', '2026-11-28'),

    ('GreenHarvest Growers',
     'Neighborhood Cleanup',
     'Clean public spaces and remove litter.',
     'Local Neighborhood', '2026-12-04'),

    ('GreenHarvest Growers',
     'School Gardening Program',
     'Help students learn about gardening and sustainability.',
     'Local School', '2026-12-08'),

    -- UnityServe Volunteers

    ('UnityServe Volunteers',
     'Food Donation Drive',
     'Collect food donations for families in need.',
     'Community Center', '2026-11-18'),

    ('UnityServe Volunteers',
     'Senior Citizen Support',
     'Assist elderly residents with daily activities.',
     'Senior Living Center', '2026-11-23'),

    ('UnityServe Volunteers',
     'Winter Clothing Collection',
     'Collect warm clothing for people in need.',
     'Community Shelter', '2026-11-30'),

    ('UnityServe Volunteers',
     'Community Health Fair',
     'Help organize a community health and wellness event.',
     'Community Park', '2026-12-06'),

    ('UnityServe Volunteers',
     'Holiday Volunteer Program',
     'Support families through holiday service activities.',
     'Community Center', '2026-12-12')

) AS s(organization_name, title, description, location, project_date)

JOIN public.organization o
    ON o.name = s.organization_name

WHERE NOT EXISTS (
    SELECT 1
    FROM public.project p
    WHERE p.organization_id = o.organization_id
      AND p.title = s.title
);
-- ========================================
-- Insert Service Project Categories
-- ========================================

INSERT INTO public.category (name)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness')
ON CONFLICT (name) DO NOTHING;
-- ========================================
-- Connect Projects with Categories
-- ========================================

INSERT INTO public.project_category
    (project_id, category_id)

SELECT
    p.project_id,
    c.category_id

FROM (
    VALUES
        ('Community Center Renovation', 'Community Service'),
        ('School Painting Project', 'Educational'),
        ('Playground Construction', 'Community Service'),
        ('Home Repair Assistance', 'Community Service'),
        ('Community Library Improvement', 'Educational'),

        ('Community Garden Project', 'Environmental'),
        ('Urban Tree Planting', 'Environmental'),
        ('Food Sustainability Workshop', 'Educational'),
        ('Neighborhood Cleanup', 'Environmental'),
        ('School Gardening Program', 'Educational'),

        ('Food Donation Drive', 'Community Service'),
        ('Senior Citizen Support', 'Health and Wellness'),
        ('Winter Clothing Collection', 'Community Service'),
        ('Community Health Fair', 'Health and Wellness'),
        ('Holiday Volunteer Program', 'Community Service'),

        -- Projects with multiple categories
        ('Community Garden Project', 'Educational'),
        ('School Gardening Program', 'Environmental'),
        ('Community Health Fair', 'Community Service')

) AS mapping(project_title, category_name)

JOIN public.project p
    ON p.title = mapping.project_title

JOIN public.category c
    ON c.name = mapping.category_name

ON CONFLICT (project_id, category_id) DO NOTHING;