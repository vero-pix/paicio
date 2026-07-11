-- ─────────────────────────────────────────────────────────────────────────
-- PAICIO · Analítica de producto — tabla `eventos` + función de stats.
--
-- Registra eventos de juego ANÓNIMOS (solo el client_id del navegador, el mismo
-- que usa el buzón). Sin datos personales. RLS on sin policies: solo el
-- service_role (las funciones /api) puede leer/escribir, igual que `feedback`.
--
-- Correr UNA vez en Supabase → SQL editor (proyecto "paicio").
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists public.eventos (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  evento      text not null,           -- 'inicia_partida' | 'completa_partida'
  episodio    text,                    -- ej. 'ep16'
  resultado   text,                    -- 'perfect' | 'partial' | 'wrong' (solo al completar)
  estrellas   int,                     -- 0..3 (solo al completar)
  client_id   text,                    -- identidad anónima por navegador
  url         text
);

alter table public.eventos enable row level security;
-- (sin policies a propósito: nadie con la anon key entra; solo service_role.)

create index if not exists eventos_client_idx on public.eventos (client_id);
create index if not exists eventos_evento_idx on public.eventos (evento);
create index if not exists eventos_episodio_idx on public.eventos (episodio);

-- Stats agregadas para el buzón (contador de jugadores únicos + funnel).
create or replace function public.stats_eventos()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'jugadores_unicos', (select count(distinct client_id) from public.eventos where client_id is not null),
    'inicia',           (select count(*) from public.eventos where evento = 'inicia_partida'),
    'completa',         (select count(*) from public.eventos where evento = 'completa_partida'),
    'por_episodio', coalesce((
      select json_agg(t order by t.episodio)
      from (
        select episodio,
               count(*) filter (where evento = 'inicia_partida')   as inicia,
               count(*) filter (where evento = 'completa_partida') as completa
        from public.eventos
        where episodio is not null
        group by episodio
      ) t
    ), '[]'::json)
  );
$$;
