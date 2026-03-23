import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import dotenv from "dotenv";

dotenv.config();

// AWS SNS 클라이언트 생성
const snsClient = new SNSClient({
    region: process.env.AWS_REGION,
    // 운영서버에선 필요없으니 주석처리
    // credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    // },
});

// SNS로 메시지 발행
export async function publishToSNS(payload: unknown) {
    const command = new PublishCommand({
        TopicArn: process.env.AWS_SNS_TOPIC_ARN,
        Message: JSON.stringify(payload),
    });

    await snsClient.send(command);
}