# makeコマンドの引数をテストしたいとき
test:
	echo $(name)-$(shell date +%s)

deploy:
	sam deploy

# インタラクティブにデプロイができる
# samconfig.toml（configが予め設定済みのファイル）があればsam deployだけデプロイができる
deploy-guide:
	sam deploy --guided

# sam cliを使ってのbuild
# template.yamlの環境変数を変えたらbuildをしておかないとlocalでendpointを実行したときに環境変数が反映されない
build:
	sam build

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

####### s3 #######

# s3のbucket一覧を取得する
list-bucket:
	aws s3 ls

# s3のbucketを作成する（regionはprofileのdefault）
# 例； example-lambda-${currentTimeStamp}
create-bucket:
	aws s3 mb s3://$(name)-$(shell date +%s)


