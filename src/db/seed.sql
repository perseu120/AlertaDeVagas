-- alertaDeVagas — Seed
-- Dados fictícios cobrindo os três cenários: vagas disponíveis, últimas vagas e esgotado

INSERT INTO encontros (nome, data, vagas_max) VALUES
  ('Encontro 01 - Logica de Programacao', '2025-08-04', 10),
  ('Encontro 02 - HTML e CSS',            '2025-08-11', 5),
  ('Encontro 03 - JavaScript',            '2025-08-18', 8),
  ('Encontro 04 - Banco de Dados',        '2025-08-25', 6),
  ('Encontro 05 - React Basico',          '2025-09-01', 4);

INSERT INTO mentorados (nome, email) VALUES
  ('Ana Lima',       'ana.lima@email.com'),
  ('Bruno Carvalho', 'bruno.c@email.com'),
  ('Camila Souza',   'camila.s@email.com'),
  ('Diego Rocha',    'diego.r@email.com'),
  ('Eduarda Nunes',  'eduarda.n@email.com'),
  ('Felipe Moura',   'felipe.m@email.com'),
  ('Gabriela Pinto', 'gabi.pinto@email.com'),
  ('Henrique Dias',  'henrique.d@email.com');

INSERT INTO inscricoes (encontro_id, mentorado_id) VALUES
  -- Encontro 01: 4 inscritos de 10 vagas (vagas disponiveis)
  (1, 1), (1, 2), (1, 3), (1, 4),

  -- Encontro 02: 4 inscritos de 5 vagas (ultimas vagas - restam 1)
  (2, 1), (2, 2), (2, 5), (2, 6),

  -- Encontro 03: 6 inscritos de 8 vagas (ultimas vagas - restam 2)
  (3, 1), (3, 3), (3, 5), (3, 6), (3, 7), (3, 8),

  -- Encontro 04: 4 inscritos de 6 vagas (vagas disponiveis)
  (4, 2), (4, 3), (4, 7), (4, 8),

  -- Encontro 05: 4 inscritos de 4 vagas (esgotado)
  (5, 1), (5, 2), (5, 3), (5, 4);
