\set email 'info@mitkof.cl'
\set n 20

WITH u AS (
  SELECT id FROM public.users WHERE email = :'email' LIMIT 1
), src AS (
  SELECT
    gen_random_uuid()                                 AS id,
    CASE WHEN g % 3 = 0 THEN NULL ELSE (SELECT id FROM u) END::uuid AS user_id,
    format('Seeded %s %s #%s',
           (ARRAY['system','maintenance','feature','message'])[(floor(random()*4)+1)::int],
           (ARRAY['info','success','warning','error'])[(floor(random()*4)+1)::int],
           g)                                         AS title,
    format('This is a seeded notification #%s created for testing.', g) AS body,
    (ARRAY['system','maintenance','feature','message'])[(floor(random()*4)+1)::int]::notification_kind   AS kind,
    (ARRAY['info','success','warning','error'])[(floor(random()*4)+1)::int]::notification_level          AS level,
    CASE WHEN random() < 0.5 THEN NULL ELSE 'https://example.com/feature' END                            AS link_url,
    CASE WHEN random() < 0.7 THEN 'unread'::notification_status ELSE 'read'::notification_status END     AS status,
    now() - (g * interval '2 hours')                                                                      AS published_at
  FROM generate_series(1, :n) AS g
)
INSERT INTO public.notifications
  (id, user_id, title, body, kind, level, link_url, status, published_at)
SELECT id, user_id, title, body, kind, level, link_url, status, published_at
FROM src;
