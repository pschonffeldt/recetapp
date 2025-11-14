-- Notifications (broadcast if user_id IS NULL)
CREATE TYPE notification_kind AS ENUM ('system', 'maintenance', 'feature', 'message');
CREATE TYPE notification_level AS ENUM ('info', 'success', 'warning', 'error');
CREATE TYPE notification_status AS ENUM ('unread', 'read', 'archived');

CREATE TABLE IF NOT EXISTS public.notifications (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title               text NOT NULL,
  body                text NOT NULL,
  kind                notification_kind NOT NULL DEFAULT 'system',
  level               notification_level NOT NULL DEFAULT 'info',
  link_url            text NULL,

  status              notification_status NOT NULL DEFAULT 'unread', -- only used for per-user rows
  -- For broadcasts (user_id NULL), status is ignored; users see them as "virtual unread" until they mark read via a per-user row

  published_at        timestamptz NOT NULL DEFAULT now(),  -- when it becomes visible
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),

  created_by          uuid NULL REFERENCES public.users(id) ON DELETE SET NULL
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS trg_notifications_updated_at ON public.notifications;
CREATE TRIGGER trg_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes: common filters
CREATE INDEX IF NOT EXISTS idx_notifications_user_created
  ON public.notifications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_published
  ON public.notifications (published_at DESC)
  WHERE user_id IS NULL;

-- Fast unread per-user
CREATE INDEX IF NOT EXISTS idx_notifications_user_status
  ON public.notifications (user_id, status)
  WHERE user_id IS NOT NULL;
