CREATE TABLE encontros (
  id        SERIAL  PRIMARY KEY,
  nome      TEXT    NOT NULL,
  data      DATE    NOT NULL,
  vagas_max INTEGER NOT NULL CHECK (vagas_max > 0)
);

CREATE TABLE mentorados (
  id    SERIAL PRIMARY KEY,
  nome  TEXT   NOT NULL,
  email TEXT   NOT NULL UNIQUE
);

CREATE TABLE inscricoes (
  id           SERIAL  PRIMARY KEY,
  encontro_id  INTEGER NOT NULL REFERENCES encontros(id),
  mentorado_id INTEGER NOT NULL REFERENCES mentorados(id),
  UNIQUE (encontro_id, mentorado_id)
);
