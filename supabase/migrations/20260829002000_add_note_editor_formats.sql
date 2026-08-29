alter table public.pages
  add column if not exists editor_format text not null default 'standard',
  add column if not exists blocknote_content jsonb;

alter table public.pages
  drop constraint if exists pages_editor_format_check;

alter table public.pages
  add constraint pages_editor_format_check
  check (editor_format in ('standard', 'notion'));

comment on column public.pages.editor_format is
  'Editor used by the page: standard (EditorJS) or notion (BlockNote).';

comment on column public.pages.blocknote_content is
  'BlockNote native JSON content, kept separate from the legacy EditorJS content for lossless switching and future conversion.';
