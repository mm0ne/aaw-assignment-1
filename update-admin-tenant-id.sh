id=
psql "postgres://postgres:postgres@localhost:5000/postgres" -c "UPDATE users SET tenant_id = '$1' WHERE id = '$id';"