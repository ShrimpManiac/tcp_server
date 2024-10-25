import { ASSET_TYPE } from '../../constants/assets.js';
import { getGameAssets } from '../../init/assets.js';

/**
 * 로드한 게임에셋을 조회하는 함수
 *
 * 호출 예시: const items = getGameAsset(ASSET_TYPE.ITEM);
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @returns {JSON} JSON화된 게임에셋
 */
export const getGameAsset = (assetType) => {
  const { stages, items, itemUnlocks } = getGameAssets();

  switch (assetType) {
    case ASSET_TYPE.STAGE:
      return stages;
    case ASSET_TYPE.ITEM:
      return items;
    case ASSET_TYPE.ITEM_UNLOCK:
      return itemUnlocks;
    default:
      console.error('올바르지 않은 assetType입니다:', assetType);
  }
};

/**
 * 게임에셋의 특정 데이터를 id로 조회하는 함수
 *
 * 호출 예시: const stageData = getGameAssetById(ASSET_TYPE.STAGE, stageId);
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @param {number} id 조회할 항목의 id
 * @returns {JSON} 해당 id의 항목 ( 예시: { "id: 1001, score: 0, scorePerSecond: 1" } )
 */
export const getGameAssetById = (assetType, id) => {
  const { stages, items, itemUnlocks } = getGameAssets();

  switch (assetType) {
    case ASSET_TYPE.STAGE:
      return stages.data.find((stage) => stage.id === id);
    case ASSET_TYPE.ITEM:
      return items.data.find((item) => item.id === id);
    case ASSET_TYPE.ITEM_UNLOCK:
      return itemUnlocks.data.find((itemUnlock) => itemUnlock.id === id);
    default:
      console.error('올바르지 않은 assetType입니다:', assetType);
  }
};

/**
 * 특정 게임에셋의 다음 항목을 조회하는 함수
 *
 * 호출 예시: const nextStage = getNextGameAsset(ASSET_TYPE.STAGE, stageId);
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @param {number} id 현재 항목의 id ( 예시: 1001 )
 * @returns {JSON} 다음 id의 항목 ( 예시: { "id: 1002, score: 10, scorePerSecond: 2" } )
 */
export const getNextGameAsset = (assetType, id) => {
  return getGameAssetById(assetType, id + 1);
};

/**
 * 특정 게임에셋의 첫 항목을 조회하는 함수
 *
 * 호출 예시: const firstStage = getFirstGameAsset(ASSET_TYPE.STAGE);
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @returns {JSON} 지정한 게임애셋의 첫 항목 ( 예시: { "id: 1001, score: 0, scorePerSecond: 1" } )
 */
export const getFirstGameAsset = (assetType) => {
  const { stages, items, itemUnlocks } = getGameAssets();

  switch (assetType) {
    case ASSET_TYPE.STAGE:
      return stages.data[0].id;
    case ASSET_TYPE.ITEM:
      return items.data[0].id;
    case ASSET_TYPE.ITEM_UNLOCK:
      return itemUnlocks.data[0].id;
    default:
      console.error('올바르지 않은 assetType입니다:', assetType);
  }
};

/**
 * 스테이지ID를 받아 스테이지 넘버를 리턴하는 함수 (1부터 시작)
 * @param {number} stageId 스테이지 ID ( 예시: 1001 )
 * @returns {number} 스테이지 넘버 ( 예시: 0 )
 */
export const getStageNumber = (stageId) => {
  const { stages } = getGameAssets();
  const stageDataIndex = stages.data.findIndex((stage) => stage.id === stageId);
  if (stageDataIndex === -1) {
    console.error(`존재하지 않는 스테이지입니다: ${stageId}`);
  }
  const stageNumber = stageDataIndex + 1;
  return stageNumber;
};
