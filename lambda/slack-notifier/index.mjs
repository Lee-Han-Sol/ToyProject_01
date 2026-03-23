const LEVEL_EMOJI = {
WARNING: "🟠",
DANGER: "🔴",
NORMAL: "🟢",
};

const LEVEL_LABEL = {
WARNING: "WARNING",
DANGER: "DANGER",
NORMAL: "NORMAL",
};

// 날짜 포맷(가독성용)
function formatKST(isoLike) {
if (!isoLike) return "N/A";
const d = new Date(isoLike);
if (Number.isNaN(d.getTime())) return String(isoLike);
// 한국 시간(Asia/Seoul)으로 보기 좋게
return new Intl.DateTimeFormat("ko-KR", {
timeZone: "Asia/Seoul",
year: "numeric",
month: "2-digit",
day: "2-digit",
hour: "2-digit",
minute: "2-digit",
second: "2-digit",
}).format(d);
}

function safeJsonParse(str) {
try {
return { ok: true, value: JSON.parse(str) };
} catch {
return { ok: false, value: str };
}
}

// Slack Block payload 생성
function buildSlackPayload(msg) {
const eventType = msg?.eventType ?? "UnknownEvent";
const p = msg?.payload ?? {};

const sensorId = p.sensorId ?? "N/A";
const readingId = p.readingId ?? "N/A";
const alertId = p.alertId ?? "N/A";

const gasType = p.gasType ?? "N/A";
const value = p.value ?? "N/A";
const unit = p.unit ?? "";
const level = p.level ?? "NORMAL";
const reason = p.reason ?? "N/A";
const occurredAt = formatKST(p.occurredAt || p.occurredAtKst || p.occurredAtISO);

const emoji = LEVEL_EMOJI[level] ?? "⚪️";
const levelText = LEVEL_LABEL[level] ?? String(level);

// Slack blocks
return {
text: `${emoji} [${levelText}] 가스 경보 (${gasType} ${value}${unit})`, // fallback
blocks: [
// 1) 헤더
{
type: "header",
text: {
type: "plain_text",
text: `${emoji} 가스 경보 발생 (${levelText})`,
},
},

      // 2) 서브텍스트
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Event:* \`${eventType}\`  •  *발생시각(KST):* ${occurredAt}`,
          },
        ],
      },

      { type: "divider" },

      // 3) 핵심 정보 (필드 2열)
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Sensor ID*\n\`${sensorId}\``,
          },
          {
            type: "mrkdwn",
            text: `*Gas*\n\`${gasType}\``,
          },
          {
            type: "mrkdwn",
            text: `*Value*\n\`${value}${unit}\``,
          },
          {
            type: "mrkdwn",
            text: `*Level*\n\`${levelText}\``,
          },
          {
            type: "mrkdwn",
            text: `*Alert ID*\n\`${alertId}\``,
          },
          {
            type: "mrkdwn",
            text: `*Reading ID*\n\`${readingId}\``,
          },
        ],
      },

      // 4) 사유(긴 텍스트)
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Reason*\n>${String(reason).replace(/\n/g, "\n>")}`,
        },
      },

      { type: "divider" },

      // 5) 액션(선택): 향후 대시보드/로그 링크가 생기면 URL 넣기
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "대시보드 열기" },
            style: "primary",
            // TODO: 운영 URL 생기면 변경
            url: "https://example.com/dashboard",
          },
          {
            type: "button",
            text: { type: "plain_text", text: "로그 보기" },
            // TODO: 운영 URL 생기면 변경
            url: "https://example.com/logs",
          },
        ],
      },

      // 6) 푸터
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "※ 이 메시지는 SNS → Lambda → Slack Webhook 경로로 자동 발송되었습니다.",
          },
        ],
      },
    ],
};
}

async function postToSlack(webhookUrl, payload) {
const res = await fetch(webhookUrl, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});

if (!res.ok) {
const text = await res.text();
throw new Error(`Slack webhook failed: ${res.status} ${text}`);
}
}

export const handler = async (event) => {
const webhookUrl = process.env.SLACK_WEBHOOK_URL;
if (!webhookUrl) {
throw new Error("Missing env: SLACK_WEBHOOK_URL");
}

const records = event?.Records ?? [];
let sent = 0;

for (const record of records) {
const raw = record?.Sns?.Message;
if (!raw) continue;

    const parsed = safeJsonParse(raw);

    // 메시지가 JSON이 아니면 raw 그대로 정보 표시
    const msg = parsed.ok
      ? parsed.value
      : { eventType: "RawMessage", payload: { reason: String(parsed.value) } };

    const slackPayload = buildSlackPayload(msg);

    await postToSlack(webhookUrl, slackPayload);
    sent += 1;
}

return {
ok: true,
sent,
};
};