install:
	npm run build-production

generate_docs:
	cd mkdocs
	mkdocs build -d ../docs