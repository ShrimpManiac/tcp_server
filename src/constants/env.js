// 중앙 집중식 관리

import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const CLIENT_VERSION = process.env.CLIENT_VERSION;
