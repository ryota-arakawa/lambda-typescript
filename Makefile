# makeコマンドの引数をテストしたいとき
test:
	echo $(name)-$(shell date +%s)

directory = ./s3

# localのs3フォルダーの存在確認
# なければs3フォルダーを作成する
check-directory: | $(directory)
	@echo "Continuation regardless of existence of $(directory)"

$(directory):
	@echo "Folder $(directory) does not exist"
	mkdir -p $@

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
# 末尾をtimestampにしているのはdirectory名が被って作成できない時があるため
# 例； example-lambda-${currentTimeStamp}
create-bucket:
	aws s3 mb s3://$(name)-$(shell date +%s)

# localのs3が空だからといってcloudのs3のbucketが空になることはない
sync-bucket:
	make check-directory
	aws s3 sync s3 s3://$(target)

# localのs3フォルダーにs3にアップするためのcompileされたlambdaコードを配置する
sync-local:
	cd scripts && node syncBucket.js

# 既存のtemplate.yamlからs3のpathを参照したtemplateのyamlを生成してくれる
# make deploy-package bucketName=""
create-package-yaml:
	sam package \
		--template-file template.yaml \
		--s3-bucket $(bucketName) \
		--output-template-file output.yaml

# s3のpathを参照したtemplateのyamlを基にdeployを行う
# make deploy-package stackName=""
deploy-package:
	sam deploy \
		--template-file output.yaml \
		--stack-name $(stackName) \
		--capabilities CAPABILITY_IAM

# cloudのs3にアップロードする事前準備
# version情報を切るようにlocalのs3にsam buildした成果物を配置する
#prepare-bucket:
#	rsync -a .aws-sam/build/* ./s3 --exclude "template.yaml"

#zip-bucket:
#	cd s3/$(target) && zip -r ../$(target).zip *
