## 環境構築

### クローン
```bash
cd 作業ディレクトリ
git clone git@github.com:TOKIUM/summer-intern.git
cd summer-intern
```

### 各種セットアップ
```bash
docker-compose up --build
docker-compose run web rails db:setup
docker-compose run web rails db:migrate
docker-compose run web bundle exec rails webpacker:compile
```

### ローカルサーバーへのアクセス
すべてが正常に動作している場合、ブラウザで http://localhost:3000 にアクセスして、アプリケーションが期待通りに動作しているか確認
