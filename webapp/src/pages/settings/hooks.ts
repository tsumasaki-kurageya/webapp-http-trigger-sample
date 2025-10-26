import axios, { AxiosError } from "axios";
import { useCallback, useMemo, useState } from "react";
import type { AxiosRequestConfig, Method } from "axios";

/** KeyValueセット */
export type KeyValueRow = { id: string; key: string; value: string };

/** フォームデータ */
export type RequestFormState = {
  url: string;
  method: Method;
  queryParams: KeyValueRow[];
  headers: KeyValueRow[];
  body: string;
};

/** リクエスト結果 */
export type RequestResult = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
} | null;

/** リクエストエラー */
export type RequestError = {
  message: string;
  status?: number;
  statusText?: string;
  data?: unknown;
} | null;

/** ランダムな一意文字列を生成します。 */
const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

/** FIXME: テスト用データ */
export type TestBodyData = {
  appName: string;
  title: string;
  start: Date;
  end: Date;
  attendees: string;
};
const testBody = {
  appName: "サンプルUI",
  title: "【テスト】計画タイトル",
  start: new Date().toISOString(),
  end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  attendees: "aaa@example.com,bbb@example.com,ccc@example.com",
};

/** リクエスト作成機能を提供します。 */
export function useHttpRequestTool() {
  const [form, setForm] = useState<RequestFormState>({
    // FIXME: テスト用
    url: "http://localhost:8000/plans",
    method: "POST",
    queryParams: [{ id: generateId(), key: "", value: "" }],
    headers: [
      { id: generateId(), key: "X-My-Authorization", value: generateId() },
    ],
    // FIXME: テスト用
    body: JSON.stringify(
      JSON.parse(
        '{"name":"{{title}}","start_at":"{{start}}","end_at":"{{end}}","eventMenu":"{{appName}}","stakeholder":"{{attendees}}"}'
      ),
      null,
      2
    ),
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RequestResult>(null);
  const [error, setError] = useState<RequestError>(null);

  /** JSONをフォーマットして返却します。 */
  const formatJsonValue = useCallback((value: string) => {
    if (!value.trim()) return value;
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value; // パースできないときは整形しない
    }
  }, []);

  /** フォームを更新します。 */
  const updateForm = useCallback(
    <K extends keyof RequestFormState>(key: K, value: RequestFormState[K]) => {
      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  /** ヘッダーもしくはクエリパラメータのKeyValueセット行を更新します。 */
  const updateRow = useCallback(
    (
      field: "headers" | "queryParams",
      id: string,
      key: "key" | "value",
      value: string
    ) => {
      setForm((prev) => ({
        ...prev,
        [field]: prev[field].map((row) =>
          row.id === id ? { ...row, [key]: value } : row
        ),
      }));
    },
    []
  );

  /** ヘッダーもしくはクエリパラメータのKeyValueセット行を追加します。 */
  const addRow = useCallback((field: "headers" | "queryParams") => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], { id: generateId(), key: "", value: "" }],
    }));
  }, []);

  /** ヘッダーもしくはクエリパラメータのKeyValueセット行を削除します。 */
  const removeRow = useCallback(
    (field: "headers" | "queryParams", id: string) => {
      setForm((prev) => ({
        ...prev,
        [field]:
          prev[field].length > 1
            ? prev[field].filter((row) => row.id !== id)
            : prev[field],
      }));
    },
    []
  );

  /**
   * リクエスト情報
   * フォームの変更を監視します。
   */
  const requestConfig = useMemo(() => {
    // クエリパラメータ
    const params = Object.fromEntries(
      form.queryParams
        .filter((row) => row.key.trim() !== "")
        .map((row) => [row.key.trim(), row.value])
    );

    // リクエストヘッダー
    const headers = Object.fromEntries(
      form.headers
        .filter((row) => row.key.trim() !== "")
        .map((row) => [row.key.trim(), row.value])
    );

    // リクエスト設定
    const config: AxiosRequestConfig = {
      url: form.url,
      method: form.method,
      params: Object.keys(params).length ? params : undefined,
      headers: Object.keys(headers).length ? headers : undefined,
      data: form.body ? tryParseJson(form.body) : undefined,
    };

    return config;
  }, [form]);

  /** リクエストを送信します。 */
  const sendRequest = useCallback(async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    // FIXME: Bodyデータの変換
    const oldFormBody = form.body;

    if (form.body) {
      const newbody = form.body
        .replace("{{appName}}", `"${testBody.appName}"`)
        .replace("{{title}}", `"${testBody.title}"`)
        .replace("{{start}}", `"${testBody.start}"`)
        .replace("{{end}}", `"${testBody.end}"`)
        .replace("{{attendees}}", `"${testBody.attendees}"`);
      updateForm("body", newbody);
    }

    try {
      const response = await axios(requestConfig);
      const cleanHeaders = Object.fromEntries(
        Object.entries(response.headers ?? {}).map(([key, value]) => [
          key,
          String(value),
        ])
      );
      setResult({
        status: response.status,
        statusText: response.statusText,
        headers: cleanHeaders,
        data: response.data,
      });
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        setError({
          message: axiosError.message,
          status: axiosError.response.status,
          statusText: axiosError.response.statusText,
          data: axiosError.response.data,
        });
      } else if (axiosError.request) {
        setError({
          message: "No response received from server.",
        });
      } else {
        setError({
          message: axiosError.message,
        });
      }
    } finally {
      updateForm("body", oldFormBody);
      setLoading(false);
    }
  }, [form.body, requestConfig, updateForm]);

  return {
    formatJsonValue,
    form,
    updateForm,
    updateRow,
    addRow,
    removeRow,
    requestConfig,
    sendRequest,
    loading,
    result,
    error,
  };
}

/**
 * JSONへの変換を試行します。
 * エラーになった場合、変換前の文字列をそのまま返却します。
 * @param raw 変換前の文字列
 * @returns JSON変換後の文字列 or 変換前の文字列
 */
function tryParseJson(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}
