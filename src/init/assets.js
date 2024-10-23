import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ASSET_TYPE } from '../constants/assets.js';

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
    fs.readFile(path.join(__basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
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
  } catch (e) {
    throw new Error('Failed to load game assets: ' + e.message);
  }
};

/**
 * 로드한 게임에셋을 조회하는 함수
 *
 * 호출 예시: const items = getGameAsset(ASSET_TYPE.ITEM);
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @returns {JSON} JSON화된 게임에셋
 */
export const getGameAsset = (assetType) => {
  const { stages, items, itemUnlocks } = gameAssets;

  switch (assetType) {
    case ASSET_TYPE.STAGE:
      return stages;
    case ASSET_TYPE.ITEM:
      return items;
    case ASSET_TYPE.ITEM_UNLOCK:
      return itemUnlocks;
    default:
      throw new Error('Invalid asset type: ' + assetType);
  }
};

/**
 * 게임에셋의 특정 데이터를 id로 조회하는 함수
 *
 * 호출 예시: const stageData = findGameAsset(ASSET_TYPE.STAGE, stageId);
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @param {number} id 조회할 항목의 id
 * @returns {JSON} 해당 id의 항목 ( 예시: { "id: 1001, score: 0, scorePerSecond: 1" } )
 */
export const findGameAsset = (assetType, id) => {
  const { stages, items, itemUnlocks } = gameAssets;

  switch (assetType) {
    case ASSET_TYPE.STAGE:
      return stages.data.find((stage) => stage.id === id);
    case ASSET_TYPE.ITEM:
      return items.data.find((item) => item.id === id);
    case ASSET_TYPE.ITEM_UNLOCK:
      return itemUnlocks.data.find((itemUnlock) => itemUnlock.id === id);
    default:
      throw new Error('Invalid asset type: ' + assetType);
  }
};

/**
 * 특정 게임에셋의 다음 항목을 조회하는 함수
 *
 * 호출 예시: const nextStage = findNextGameAsset(ASSET_TYPE.STAGE, stageId);
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @param {number} id 현재 항목의 id ( 예시: 1001 )
 * @returns {JSON} 다음 id의 항목 ( 예시: { "id: 1002, score: 10, scorePerSecond: 2" } )
 */
export const findNextGameAsset = (assetType, id) => {
  return findGameAsset(assetType, id + 1);
};

/**
 * 특정 게임에셋의 첫 항목을 조회하는 함수
 *
 * 호출 예시: const firstStage = findFirstGameAsset(ASSET_TYPE.STAGE);
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @returns {JSON} 지정한 게임애셋의 첫 항목 ( 예시: { "id: 1001, score: 0, scorePerSecond: 1" } )
 */
export const findFirstGameAsset = (assetType) => {
  const { stages, items, itemUnlocks } = gameAssets;

  switch (assetType) {
    case ASSET_TYPE.STAGE:
      return stages.data[0].id;
    case ASSET_TYPE.ITEM:
      return items.data[0].id;
    case ASSET_TYPE.ITEM_UNLOCK:
      return itemUnlocks.data[0].id;
    default:
      throw new Error('Invalid asset type: ' + assetType);
  }
};

/**
 * 스테이지ID를 받아 스테이지 넘버를 리턴하는 함수 (1부터 시작)
 * @param {number} stageId 스테이지 ID ( 예시: 1001 )
 * @returns {number} 스테이지 넘버 ( 예시: 0 )
 */
export const getStageNumber = (stageId) => {
  const { stages } = gameAssets;
  const stageDataIndex = stages.data.findIndex((stage) => stage.id === stageId);
  if (stageDataIndex === -1) throw new Error('Not found stage');
  const stageNumber = stageDataIndex + 1;
  return stageNumber;
};
