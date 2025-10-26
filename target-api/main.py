import asyncio

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ログ出力
async def output_log(request: Request, client: any):
    print("----- request received -----")

    # クライアント情報のコンソール出力
    if client is not None:
        print(f"client      : {client.host}:{client.port}")
    else:
        print("client      : unknown")

    # リクエスト情報のコンソール出力
    print(f"method path : {request.method} {request.url.path}")

    # クエリのコンソール出力
    if request.url.query:
        print(f"query       : {request.url.query}")

    # リクエストヘッダのコンソール出力
    print("headers     :")
    for k, v in request.headers.items():
        print(f"  {k}: {v}")

    # リクエストボディのコンソール出力
    body = await request.body()
    if body:
        try:
            decoded = body.decode("utf-8", errors="replace")
        except Exception:
            decoded = str(body)

        print("body        :")
        print(decoded)
    print("-----------------------------", flush=True)


@app.get("/")
async def do_get(request: Request):
    client = request.client

    # ログ出力
    await output_log(request, client)

    # レスポンス生成
    return {"message": "Settings OK."}


@app.post("/")
async def do_post(request: Request):
    client = request.client

    # ログ出力
    await output_log(request, client)

    # レスポンス生成
    return {"message": "Settings OK."}


@app.post("/plans")
async def do_post(request: Request):
    await asyncio.sleep(1)

    client = request.client

    # ログ出力
    await output_log(request, client)

    # レスポンス生成
    return {"message": "Settings OK."}
