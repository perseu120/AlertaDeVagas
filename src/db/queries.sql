-- ============================================
-- ARQUIVO: queries.sql
-- DESCRIÇÃO:
--   Conjunto de queries para validação e testes
--   do sistema de gerenciamento de encontros.
--
-- OBS:
--   Execute as queries após rodar o script de seed.
-- ============================================


-- QUERY 1: Visualização geral dos dados
-- Objetivo:
--   Conferir se os dados foram inseridos corretamente
--   em todas as tabelas do banco.
--
-- O que retorna:
--   - Lista completa de encontros
--   - Lista completa de mentorados
--   - Lista completa de inscrições
--
-- Quando usar:
--   Após rodar o seed para validar rapidamente o estado do banco.
-- ============================================

SELECT * FROM encontros;
SELECT * FROM mentorados;
SELECT * FROM inscricoes;


-- ============================================
-- QUERY 2: Listar inscritos por encontro (JOIN)
-- Objetivo:
--   Verificar o relacionamento entre encontros e mentorados
--   através da tabela de inscrições.
--
-- O que retorna:
--   - Nome do encontro
--   - Nome do mentorado inscrito
--
-- Quando usar:
--   Para validar integridade dos relacionamentos (FOREIGN KEY)
--   e entender quem está inscrito em cada encontro.
-- ============================================

SELECT 
  e.nome AS encontro,
  m.nome AS mentorado
FROM inscricoes i
JOIN encontros e ON e.id = i.encontro_id
JOIN mentorados m ON m.id = i.mentorado_id
ORDER BY e.id;


-- ============================================
-- QUERY 3: Total de inscritos por encontro
-- Objetivo:
--   Calcular quantos mentorados estão inscritos
--   em cada encontro.
--
-- O que retorna:
--   - Nome do encontro
--   - Total de inscritos
--   - Número máximo de vagas
--
-- Quando usar:
--   Para análise geral de ocupação dos encontros.
-- ============================================

SELECT 
  e.nome,
  COUNT(i.id) AS total_inscritos,
  e.vagas_max
FROM encontros e
LEFT JOIN inscricoes i ON e.id = i.encontro_id
GROUP BY e.id
ORDER BY e.id;


-- ============================================
-- QUERY 4: Status das vagas por encontro
-- Objetivo:
--   Classificar automaticamente cada encontro
--   de acordo com a quantidade de vagas disponíveis.
--
-- Regras de classificação:
--   - "Esgotado"       → quando inscritos >= vagas_max
--   - "Últimas vagas"  → quando restam 1 ou 2 vagas
--   - "Vagas disponíveis" → quando há mais vagas disponíveis
--
-- O que retorna:
--   - Nome do encontro
--   - Total de vagas
--   - Total de inscritos
--   - Vagas restantes
--   - Status calculado
--
-- Quando usar:
--   Essa é a query principal do sistema (alerta de vagas).
-- ============================================

SELECT 
  e.nome,
  e.vagas_max,
  COUNT(i.id) AS inscritos,
  (e.vagas_max - COUNT(i.id)) AS vagas_restantes,
  
  CASE
    WHEN COUNT(i.id) >= e.vagas_max THEN 'Esgotado'
    WHEN (e.vagas_max - COUNT(i.id)) <= 2 THEN 'Últimas vagas'
    ELSE 'Vagas disponíveis'
  END AS status
FROM encontros e
LEFT JOIN inscricoes i ON e.id = i.encontro_id
GROUP BY e.id
ORDER BY e.id;



-- ============================================
-- QUERY 5: Encontros com vagas disponíveis
-- Objetivo:
--   Listar apenas encontros que ainda possuem vagas.
--
-- Critério:
--   Total de inscritos < vagas_max
--
-- Quando usar:
--   Para exibir opções abertas para inscrição.
-- ============================================

SELECT 
  e.*
FROM encontros e
LEFT JOIN inscricoes i ON e.id = i.encontro_id
GROUP BY e.id
HAVING COUNT(i.id) < e.vagas_max;



-- ============================================
-- QUERY 6: Encontros esgotados
-- Objetivo:
--   Listar encontros que já atingiram o limite de vagas.
--
-- Critério:
--   Total de inscritos >= vagas_max
--
-- Quando usar:
--   Para bloquear novas inscrições ou exibir aviso.
-- ============================================

SELECT 
  e.nome
FROM encontros e
JOIN inscricoes i ON e.id = i.encontro_id
GROUP BY e.id
HAVING COUNT(i.id) >= e.vagas_max;