import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * 로드한 게임에셋
 */
let gameAssets = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 최상위 경로 + assets 폴더
const __basePath = path.join(__dirname, '../../assets');

/**
 * 파일을 비동기 병렬로 읽는 함수
 *
 * loadGameAssets()에서 게임에셋을 불러올 때 쓰기 위한 헬퍼 함수로 쓰임
 * @param {string} filename 파일이름
 * @returns
 */
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__basePath, filename), 'utf8', (error, data) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

/**
 * 전체 게임에셋을 불러오는 함수
 *
 * 게임 시작시 실행
 * @returns
 */
export const loadGameAssets = async () => {
  try {
    // 비동기 병렬로 게임에셋 로드
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);

    // ID순으로 정렬
    stages.data.sort((a, b) => a.id - b.id);
    items.data.sort((a, b) => a.id - b.id);
    itemUnlocks.data.sort((a, b) => a.id - b.id);

    // 로드한 에셋 반환
    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (error) {
    console.error('게임에셋을 로드하는데 실패했습니다:', error.message);
  }
};

/**
 * 로드한 게임에셋 전체를 조회하는 함수
 * @returns {JSON} JSON화된 모든 게임에셋
 */
export const getGameAssets = () => {
  return gameAssets;
};
