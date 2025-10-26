# target-api

FastAPI ベースのシンプルな API です。ルートエンドポイント `/` で受け取ったリクエストの情報（メソッド、パス、クエリ、ヘッダー、ボディ）を標準出力にログとして出力し、固定メッセージを JSON で返します。

- フレームワーク: FastAPI
- エントリポイント: `target-api/main.py`
- 提供エンドポイント: `GET /`
- OpenAPI: `target-api/openapi.yaml`（OpenAPI 3.1, YAML）

## 動作要件
- Python 3.9+（3.11 など最新系を推奨）

## セットアップ
```bash
# 仮想環境の作成（任意）
python -m venv .venv
# Windows PowerShell
. .venv/Scripts/Activate.ps1
# macOS/Linux (bash/zsh)
# source .venv/bin/activate

pip install fastapi uvicorn
```

## 実行方法
次のいずれかの方法でサーバーを起動します。

1) target-api ディレクトリに移動して起動（推奨）
```bash
cd target-api
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2) ルートからアプリディレクトリを指定して起動
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000 --app-dir target-api
```

- ブラウザ: http://127.0.0.1:8000/
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

> 注: ディレクトリ名 `target-api` は Python モジュール名としては利用できないため、`uvicorn target-api.main:app` のような指定は失敗します。上記いずれかの方法で実行してください。

## エンドポイント
- `GET /`
  - 概要: リクエスト情報をログに出力し、`{"message": "Hello, FastAPI!"}` を返す
  - レスポンス: `200 OK`, `application/json`
  - 例:
    ```bash
    curl -i "http://127.0.0.1:8000/?q=test" -H "X-Debug: sample"
    ```

## ログ出力について
`main.py` 内の `output_log` 関数で、以下を標準出力に出力します。
- クライアント情報（IP:Port）
- メソッドとパス
- クエリ文字列（存在する場合）
- すべてのヘッダー
- リクエストボディ（存在する場合。UTF-8 としてデコードを試行）

## OpenAPI ドキュメント
このリポジトリには、実装に対応する OpenAPI 3.1 仕様 `target-api/openapi.yaml` を同梱しています。
- サーバー URL は `http://localhost:8000` を想定しています。必要に応じて変更してください。
- FastAPI 既定の `/openapi.json` も利用可能です（実行時自動生成）。

## 開発メモ
- エンドポイントは `GET /` のみです。
- 実装ファイル: `target-api/main.py`
- 依存は `fastapi` と ASGI サーバーの `uvicorn` のみです。
