install-backend-deps:
	pip3 install -r backend/requirements.txt

run-backend:
	cd backend && python3 -m srv.run --port 8080
