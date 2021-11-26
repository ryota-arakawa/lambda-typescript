# lambda-typescript
lambdaのソースコードがtypescriptの場合のサンプル。各関数ごとにソースファイルがあり、lambdaのlayer機能などを使用している。

## s3にアップロードとデプロイを行う
### Lambdaのリソースを置きたいbucketを作成する
```
make create-bucket name="$(Lambdaのリソースを置きたいbucketの名前)"
```

### typescriptのソースをコンパイルする
```
cd src/app/$(対象のfunction)
npm run build:dev
```

### sam cliでbuild
これを実行すると.aws-samに関連のリソースがbuildされる。
```
make build
```

### s3にアップロードするための事前準備
.aws-samの中の成果物を参照し、s3フォルダーにバージョン情報を含めたディレクトリ構造を作成し、zipする。
zipはoutput.yamlのparametersに合わせて設定される。
Lambdaのソースコードはzipされたものを参照する。
```
make sync-local
```

### s3にアップロードする
```
make sync-bucket bucketName="$(Lambdaのリソースを置くbucketの名前)"
```

