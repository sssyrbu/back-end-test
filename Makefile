run:
	docker compose up -d --force-recreate db_dev
	sleep 7 && npx prisma migrate dev --name init
	yarn start:dev
