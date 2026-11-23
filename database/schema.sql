-- IDOLVERSE relational schema (PostgreSQL)
-- IDs are application-generated text identifiers for easy migration from the MVP.
CREATE TABLE agencies (
  id text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  country text,
  website text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE idols (
  id text PRIMARY KEY,
  name text NOT NULL,
  native_name text,
  direction text NOT NULL CHECK (direction IN ('K-POP','C-POP','J-POP')),
  birthday text,
  country text,
  bio text,
  debut text,
  status text NOT NULL DEFAULT 'active',
  photo_url text,
  photo_position_x numeric,
  photo_position_y numeric,
  photo_scale numeric,
  catalog_photo_position_x numeric,
  catalog_photo_position_y numeric,
  catalog_photo_scale numeric,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idols_name_idx ON idols (lower(name));

CREATE TABLE music_groups (
  id text PRIMARY KEY,
  name text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('K-POP','C-POP','J-POP')),
  country text,
  debut text,
  status text NOT NULL DEFAULT 'active',
  description text,
  group_photo_url text,
  group_card_photo_url text,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX music_groups_name_idx ON music_groups (lower(name));

CREATE TABLE group_memberships (
  id text PRIMARY KEY,
  group_id text NOT NULL REFERENCES music_groups(id),
  idol_id text NOT NULL REFERENCES idols(id),
  role text,
  start_date date,
  end_date date,
  is_current boolean NOT NULL DEFAULT true,
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
  UNIQUE (group_id, idol_id, start_date)
);
CREATE INDEX group_memberships_idol_idx ON group_memberships (idol_id, is_current);

CREATE TABLE idol_agencies (
  id text PRIMARY KEY,
  idol_id text NOT NULL REFERENCES idols(id),
  agency_id text NOT NULL REFERENCES agencies(id),
  relationship_type text NOT NULL DEFAULT 'management',
  start_date date,
  end_date date,
  is_current boolean NOT NULL DEFAULT true,
  UNIQUE (idol_id, agency_id, start_date)
);
CREATE TABLE group_agencies (
  id text PRIMARY KEY,
  group_id text NOT NULL REFERENCES music_groups(id),
  agency_id text NOT NULL REFERENCES agencies(id),
  relationship_type text NOT NULL DEFAULT 'management',
  start_date date,
  end_date date,
  is_current boolean NOT NULL DEFAULT true,
  UNIQUE (group_id, agency_id, start_date)
);

CREATE TABLE albums (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  release_date date,
  release_year text,
  album_type text NOT NULL DEFAULT 'unknown',
  cover_image_url text,
  source_url text,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX albums_release_date_idx ON albums (release_date DESC);
CREATE TABLE album_groups (
  id text PRIMARY KEY,
  album_id text NOT NULL REFERENCES albums(id),
  group_id text NOT NULL REFERENCES music_groups(id),
  relationship_type text NOT NULL DEFAULT 'group_release',
  UNIQUE (album_id, group_id)
);
CREATE TABLE album_credits (
  id text PRIMARY KEY,
  album_id text NOT NULL REFERENCES albums(id),
  idol_id text NOT NULL REFERENCES idols(id),
  credit_role text NOT NULL,
  UNIQUE (album_id, idol_id, credit_role)
);
CREATE TABLE tracks (
  id text PRIMARY KEY,
  album_id text NOT NULL REFERENCES albums(id),
  title text NOT NULL,
  track_number integer NOT NULL CHECK (track_number > 0),
  duration text,
  UNIQUE (album_id, track_number)
);
CREATE TABLE track_credits (
  id text PRIMARY KEY,
  track_id text NOT NULL REFERENCES tracks(id),
  idol_id text NOT NULL REFERENCES idols(id),
  credit_role text NOT NULL,
  UNIQUE (track_id, idol_id, credit_role)
);

CREATE TABLE news (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text,
  summary text,
  content text,
  published_at timestamptz,
  image_url text,
  source_url text,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX news_published_at_idx ON news (published_at DESC);
CREATE TABLE news_groups (
  id text PRIMARY KEY,
  news_id text NOT NULL REFERENCES news(id),
  group_id text NOT NULL REFERENCES music_groups(id),
  relationship_type text NOT NULL DEFAULT 'main_subject',
  UNIQUE (news_id, group_id)
);
CREATE TABLE news_idols (
  id text PRIMARY KEY,
  news_id text NOT NULL REFERENCES news(id),
  idol_id text NOT NULL REFERENCES idols(id),
  relationship_type text NOT NULL DEFAULT 'main_subject',
  UNIQUE (news_id, idol_id)
);

-- Images themselves live in object/file storage, not as binary blobs in PostgreSQL.
CREATE TABLE media_assets (
  id text PRIMARY KEY,
  url text NOT NULL,
  mime_type text,
  width integer,
  height integer,
  alt_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);
