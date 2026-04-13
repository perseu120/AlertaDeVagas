# alertaDeVagas — Database Specification

**Desafio C - Alerta de Vagas**
LABs

| Campo          | Valor                       |
|----------------|-----------------------------|
| Projeto        | alertaDeVagas               |
| Responsável    | Modelagem de Banco de Dados |
| Banco de Dados | PostgreSQL 17 (Neon)        |
| Versão         | 1.0                         |

---

## 1. Visão Geral

O alertaDeVagas é o sistema de gerenciamento de vagas da Labs para a nova rodada de mentorias. Este documento especifica o modelo de banco de dados que sustenta o Desafio C: verificar o status de vagas de cada encontro e categorizar como `disponivel`, `ultimas vagas` ou `esgotado`.

> **Escopo:** Este spec cobre apenas o banco de dados. A lógica de categorização e as queries de demonstração estão incluídas, mas a camada de aplicação é responsabilidade do restante do squad.

---

## 2. Decisões de Modelagem

Antes de definir as tabelas, três decisões estruturais foram tomadas.

### 2.1 Por que três tabelas e não duas

A versão mínima do desafio precisaria apenas de `encontros` e `inscricoes`. A tabela `mentorados` foi adicionada porque sem ela o mesmo mentorado pode aparecer com nomes diferentes em inscrições distintas, e o banco não teria como saber que é a mesma pessoa. Com um `id` fixo para cada mentorado, essa ambiguidade desaparece.

### 2.2 Por que não existe coluna vagas_ocupadas

Manter um contador manual cria o problema de dupla fonte de verdade: o número na coluna pode divergir da contagem real de inscrições se alguma operação falhar. A abordagem correta é contar as inscrições em tempo real com `COUNT()` na query. Esse número sempre vai refletir o estado real do banco.

---

## 3. Schema do Banco de Dados

O banco é composto por três tabelas. Um mentorado pode ter muitas inscrições, um encontro pode ter muitas inscrições, e cada inscrição pertence a exatamente um mentorado e um encontro.

### 3.1 Tabela: `encontros`

Armazena os dados de cada encontro da rodada de mentorias, incluindo o limite de vagas definido na criação.

| Coluna      | Tipo    | Restrições          | Descrição                                  |
|-------------|---------|---------------------|--------------------------------------------|
| `id`        | SERIAL  | PRIMARY KEY         | Identificador único gerado automaticamente |
| `nome`      | TEXT    | NOT NULL            | Nome do encontro                           |
| `data`      | DATE    | NOT NULL            | Data de realização                         |
| `vagas_max` | INTEGER | NOT NULL, CHECK > 0 | Número máximo de vagas disponibilizadas    |

```sql
CREATE TABLE encontros (
  id        SERIAL  PRIMARY KEY,
  nome      TEXT    NOT NULL,
  data      DATE    NOT NULL,
  vagas_max INTEGER NOT NULL CHECK (vagas_max > 0)
);
```

### 3.2 Tabela: `mentorados`

Armazena o cadastro único de cada participante. O email funciona como identificador natural e impede duplicatas.

| Coluna  | Tipo   | Restrições       | Descrição                                  |
|---------|--------|------------------|--------------------------------------------|
| `id`    | SERIAL | PRIMARY KEY      | Identificador único gerado automaticamente |
| `nome`  | TEXT   | NOT NULL         | Nome completo do mentorado                 |
| `email` | TEXT   | NOT NULL, UNIQUE | Email único que impede cadastro duplicado  |

```sql
CREATE TABLE mentorados (
  id    SERIAL PRIMARY KEY,
  nome  TEXT   NOT NULL,
  email TEXT   NOT NULL UNIQUE
);
```

### 3.3 Tabela: `inscricoes`

Representa o relacionamento entre mentorado e encontro. Cada linha é uma inscrição. A combinação `encontro_id + mentorado_id` é única, impedindo que a mesma pessoa se inscreva duas vezes no mesmo encontro.

| Coluna                       | Tipo    | Restrições                 | Descrição                                  |
|------------------------------|---------|----------------------------|--------------------------------------------|
| `id`                         | SERIAL  | PRIMARY KEY                | Identificador único gerado automaticamente |
| `encontro_id`                | INTEGER | NOT NULL, FK -> encontros  | Referência ao encontro                     |
| `mentorado_id`               | INTEGER | NOT NULL, FK -> mentorados | Referência ao mentorado                    |
| `encontro_id + mentorado_id` | -       | UNIQUE                     | Impede inscrição duplicada                 |

```sql
CREATE TABLE inscricoes (
  id           SERIAL  PRIMARY KEY,
  encontro_id  INTEGER NOT NULL REFERENCES encontros(id),
  mentorado_id INTEGER NOT NULL REFERENCES mentorados(id),
  UNIQUE (encontro_id, mentorado_id)
);
```

---

## 4. Dados Fictícios (Seed)

Os dados cobrem os três cenários possíveis de status: vagas disponíveis, últimas vagas e esgotado.

### 4.1 encontros

```sql
INSERT INTO encontros (nome, data, vagas_max) VALUES
  ('Encontro 01 - Logica de Programacao', '2025-08-04', 10),
  ('Encontro 02 - HTML e CSS',            '2025-08-11', 5),
  ('Encontro 03 - JavaScript',            '2025-08-18', 8),
  ('Encontro 04 - Banco de Dados',        '2025-08-25', 6),
  ('Encontro 05 - React Basico',          '2025-09-01', 4);
```

### 4.2 mentorados

```sql
INSERT INTO mentorados (nome, email) VALUES
  ('Ana Lima',       'ana.lima@email.com'),
  ('Bruno Carvalho', 'bruno.c@email.com'),
  ('Camila Souza',   'camila.s@email.com'),
  ('Diego Rocha',    'diego.r@email.com'),
  ('Eduarda Nunes',  'eduarda.n@email.com'),
  ('Felipe Moura',   'felipe.m@email.com'),
  ('Gabriela Pinto', 'gabi.pinto@email.com'),
  ('Henrique Dias',  'henrique.d@email.com');
```

### 4.3 inscricoes

Distribuição calculada para garantir os três status na query principal.

```sql
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
```

---

## 5. Queries Principais

### 5.1 Alerta de Vagas por Encontro

Query principal do Desafio C. Retorna todos os encontros com status calculado, ordenados por status.

```sql
SELECT
  e.nome                              AS encontro,
  e.vagas_max,
  COUNT(i.id)                         AS ocupadas,
  e.vagas_max - COUNT(i.id)           AS restantes,
  CASE
    WHEN e.vagas_max - COUNT(i.id) = 0 THEN 'esgotado'
    WHEN e.vagas_max - COUNT(i.id) <= 2 THEN 'ultimas vagas'
    ELSE 'vagas disponiveis'
  END                                 AS status
FROM encontros e
LEFT JOIN inscricoes i ON i.encontro_id = e.id
GROUP BY e.id
ORDER BY status;
```

> **LEFT JOIN:** garante que encontros sem nenhuma inscrição ainda apareçam no resultado, com `ocupadas = 0`.

### 5.2 Inscritos por Encontro

Query auxiliar para demonstração. Mostra quem está inscrito em um encontro específico, útil para demonstrar o JOIN entre as três tabelas.

```sql
SELECT
  m.nome AS mentorado,
  e.nome AS encontro
FROM inscricoes i
JOIN mentorados m ON m.id = i.mentorado_id
JOIN encontros  e ON e.id = i.encontro_id
WHERE e.id = 1
ORDER BY m.nome;
```

---

## 6. Resultado Esperado da Query Principal

Com os dados do seed, a query 5.1 deve retornar:

| encontro                             | vagas_max | ocupadas | restantes | status            |
|--------------------------------------|-----------|----------|-----------|-------------------|
| Encontro 05 - React Basico           | 4         | 4        | 0         | esgotado          |
| Encontro 02 - HTML e CSS             | 5         | 4        | 1         | ultimas vagas     |
| Encontro 03 - JavaScript             | 8         | 6        | 2         | ultimas vagas     |
| Encontro 01 - Logica de Programacao  | 10        | 4        | 6         | vagas disponiveis |
| Encontro 04 - Banco de Dados         | 6         | 4        | 2         | vagas disponiveis |

> **Atenção:** O Encontro 03 aparece como `ultimas vagas` porque restam exatamente 2 vagas, que é o limite definido na regra de negócio.

---

## 7. Regras de Negócio

| Regra               | Condição                            | Status retornado              |
|---------------------|-------------------------------------|-------------------------------|
| Esgotado            | `restantes = 0`                     | `esgotado`                    |
| Últimas vagas       | `restantes` entre 1 e 2             | `ultimas vagas`               |
| Disponível          | `restantes >= 3`                    | `vagas disponiveis`           |
| Sem inscrições      | `ocupadas = 0` (LEFT JOIN)          | `vagas disponiveis`           |
| Inscrição duplicada | mesmo `mentorado_id + encontro_id`  | rejeitada pelo banco (UNIQUE) |
