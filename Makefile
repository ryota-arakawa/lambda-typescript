
deploy:
	sam deploy

# インタラクティブにデプロイができる
# samconfig.toml（configが予め設定済みのファイル）があればsam deployだけデプロイができる
deploy-guide:
	sam deploy --guided

# localで起動ができる
start:
	sam local start-api

# 修正を監視する
# make startを行ったあと、別のターミナル画面でやるといい
watch:
	npm run watch

# 公式からdynamoDBのimageでdocker composeを起動する
docker-build-up:
	docker-compose up --build

docker-up:
	docker-compose up
