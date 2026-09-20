-- PostgreSQL example: grouping, types, parameters and constraints.
CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

SELECT active, COUNT(*) AS user_count
FROM users
WHERE created_at >= $1
GROUP BY active
ORDER BY user_count DESC;
