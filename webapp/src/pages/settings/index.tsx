import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Code,
  Container,
  Flex,
  Group,
  Loader,
  Skeleton,
  SegmentedControl,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
  JsonInput,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo } from "react";
import "../../App.css";
import { useHttpRequestTool } from "./hooks";
import type { KeyValueRow, RequestResult } from "./hooks";
import type { FormEvent } from "react";
import "./style.css";

/** HTTPメソッドの選択肢 */
const httpMethods = ["POST"];

type HeadersTableProps = {
  rows: KeyValueRow[];
  onChange: (id: string, key: "key" | "value", value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  title: string;
  type: undefined | "password";
};

/**
 * KeyValueのリストを持つ場合のテーブル
 */
function HeadersTable({
  rows,
  onChange,
  onAdd,
  onRemove,
  title,
  type,
}: HeadersTableProps) {
  return (
    <Card withBorder radius="md">
      <Group justify="space-between" mb="md">
        <Title order={4}>{title}</Title>
        <ActionIcon variant="light" onClick={onAdd} aria-label={`Add ${title}`}>
          <IconPlus size={18} />
        </ActionIcon>
      </Group>
      <Stack gap="sm">
        {rows.map((row) => (
          <Flex key={row.id} gap="sm">
            <TextInput
              label="Key"
              placeholder="Authorization"
              value={row.key}
              onChange={(event) =>
                onChange(row.id, "key", event.currentTarget.value)
              }
              flex={1}
            />
            <TextInput
              label="Value"
              type={type ?? "text"}
              placeholder="Bearer ..."
              value={row.value}
              onChange={(event) =>
                onChange(row.id, "value", event.currentTarget.value)
              }
              flex={1}
            />
            <ActionIcon
              mt={28}
              variant="subtle"
              color="red"
              aria-label="Remove row"
              onClick={() => onRemove(row.id)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Flex>
        ))}
      </Stack>
    </Card>
  );
}

/**
 * レスポンス情報
 */
function ResponseViewer({
  result,
  loading,
}: {
  result: RequestResult | null;
  loading: boolean;
}) {
  const prettyBody = useMemo(() => {
    if (!result) return "";
    try {
      return JSON.stringify(result.data, null, 2);
    } catch {
      return String(result.data);
    }
  }, [result]);

  if (loading) {
    return (
      <Card withBorder radius="md">
        <Stack gap="sm">
          <Skeleton height={20} width="30%" />
          <Skeleton height={16} width="45%" />
          <Skeleton height={120} />
        </Stack>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card withBorder radius="md">
        <Text c="dimmed">まだレスポンスはありません。</Text>
      </Card>
    );
  }

  return (
    <Card withBorder radius="md">
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          <Badge color="green">{result.status}</Badge>
          <Text>{result.statusText}</Text>
        </Group>
      </Group>
      <Stack gap="sm">
        <div>
          <Text fw={600} mb={4}>
            Headers
          </Text>
          <Table striped withColumnBorders>
            <Table.Tbody>
              {Object.entries(result.headers).map(([key, value]) => (
                <Table.Tr key={key}>
                  <Table.Td>{key}</Table.Td>
                  <Table.Td>
                    <Code>{value}</Code>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
        <div>
          <Text fw={600} mb={4}>
            Body
          </Text>
          <Textarea readOnly minRows={8} value={prettyBody} />
        </div>
      </Stack>
    </Card>
  );
}

/**
 * 計画画面
 */
function Settings() {
  const {
    formatJsonValue,
    form,
    updateForm,
    updateRow,
    addRow,
    removeRow,
    sendRequest,
    loading,
    result,
    error,
  } = useHttpRequestTool();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendRequest();
  };

  const bodyDescription = `JSONフォーマット
データは "{{変数名}}" で埋め込みを行うことができます
- appName: アプリ名
- title: 計画名
- start: 開始日時(UTC)
- end: 終了日時(UTC)
- attendees: 参加者のカンマ区切りメールアドレスリスト ex).aaa@example.com,bbb@example.com,ccc@example.com
例)
{
  "name":"{{title}}",
  "start_at":"{{start}}",
  "end_at":"{{end}}",
  "eventMenu":"{{appName}}",
  "stakeholder":"{{attendees}}"
}
`;

  return (
    <Container size="lg">
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          <Title order={2}>計画トリガー設定</Title>
          <Text size="sm" c="dimmed" className="description">
            計画ステータス確定時に、任意のAPIを呼び出すことができます。
          </Text>
          <Card withBorder radius="md" padding="lg">
            <Stack gap="md">
              {/* HTTPメソッド選択コントロール */}
              <SegmentedControl
                fullWidth
                data={httpMethods.map((method) => ({
                  label: method,
                  value: method,
                }))}
                value={form.method}
                onChange={(value) =>
                  updateForm("method", value as typeof form.method)
                }
              />

              {/* リクエストURL */}
              {loading ? (
                <Card withBorder radius="md">
                  <Stack gap="sm">
                    <Skeleton height={24} width="20%" />
                    <Skeleton height={40} />
                  </Stack>
                </Card>
              ) : (
                <TextInput
                  label="Request URL"
                  placeholder="https://api.example.com/resource"
                  required
                  value={form.url}
                  onChange={(event) =>
                    updateForm("url", event.currentTarget.value)
                  }
                />
              )}

              {/* リクエストヘッダー */}
              {loading ? (
                <Card withBorder radius="md">
                  <Stack gap="sm">
                    <Skeleton height={24} width="20%" />
                    <Skeleton height={80} />
                  </Stack>
                </Card>
              ) : (
                <HeadersTable
                  title="Headers"
                  type="password"
                  rows={form.headers}
                  onChange={(id, key, value) =>
                    updateRow("headers", id, key, value)
                  }
                  onAdd={() => addRow("headers")}
                  onRemove={(id) => removeRow("headers", id)}
                />
              )}

              {/* リクエストボディ */}
              {loading ? (
                <Card withBorder radius="md">
                  <Stack gap="sm">
                    <Skeleton height={24} width="20%" />
                    <Skeleton height={120} />
                  </Stack>
                </Card>
              ) : (
                <Card withBorder radius="md">
                  <Group justify="space-between" mb="md">
                    <Title order={4}>Body</Title>
                  </Group>
                  <Stack gap="sm">
                    <JsonInput
                      description={bodyDescription}
                      placeholder='{ "name": "Vite" }'
                      autosize
                      minRows={4}
                      value={form.body}
                      onChange={(value) => updateForm("body", value)}
                      onBlur={(event) => {
                        const formatted = formatJsonValue(
                          event.currentTarget.value
                        );
                        if (formatted !== event.currentTarget.value) {
                          updateForm("body", formatted);
                        }
                      }}
                    />
                  </Stack>
                </Card>
              )}
            </Stack>
          </Card>

          <Group justify="flex-end">
            {/* 送信ボタン */}
            <Button
              type="submit"
              size="md"
              disabled={loading}
              rightSection={loading ? <Loader size="xs" color="white" /> : null}
            >
              テスト送信
            </Button>
          </Group>

          {/* エラーメッセージ */}
          {error && (
            <Card withBorder radius="md" c="red" bg="red.1">
              <Stack gap={4}>
                <Text fw={600}>リクエストエラー</Text>
                <Text>{error.message}</Text>
                {error.status && (
                  <Text size="sm">
                    ステータス: {error.status} {error.statusText ?? ""}
                  </Text>
                )}
                {error.data !== undefined && (
                  <Textarea
                    readOnly
                    minRows={4}
                    value={JSON.stringify(error.data, null, 2)}
                  />
                )}
              </Stack>
            </Card>
          )}

          {/* レスポンス情報 */}
          <ResponseViewer result={result} loading={loading} />
        </Stack>
      </form>
    </Container>
  );
}

export default Settings;
