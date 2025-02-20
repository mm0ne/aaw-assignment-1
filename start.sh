#!/bin/bash


service_list=("authentication" "tenant" "products" "orders")
prepare_db() {
    local service=$1

  (
    cd "$service"
    rm -rf drizzle
    pnpm install && pnpm run generate && pnpm run migrate

    if [[ "$service" == "authentication" ]]; then
      pnpm generate-token
    fi
  )
  echo "Successfully initiated DB for $service service."
}

echo "Building and Starting Services..."
docker compose up --build -d
echo "Services up."
sleep 1

echo "Initializing DB..."

for service in "${service_list[@]}"; do
    prepare_db $service
done
echo "DB Initialized."
