import { CLIENT_VERSION, HOST, PORT } from '../constants/env.js';
import { PACKET_TYPE_BYTES, TOTAL_LENGTH_BYTES } from '../constants/header.js';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    totalLength: TOTAL_LENGTH_BYTES,
    typeLength: PACKET_TYPE_BYTES,
  },
};
