import {
  ActionPayload,
  AddPanelData,
  MovePanelData,
  MoveSplitterData,
  RemovePanelData,
  SelectTabData,
} from "./type";

export const isAddPanelData = (
  data: ActionPayload
): data is AddPanelData => {
  return (
    (data as AddPanelData).mask != null &&
    (data as AddPanelData).panelNode != null &&
    (data as AddPanelData).target != null
  );
};

export const isMovePanelData = (
  data: ActionPayload
): data is MovePanelData => {
  return (
    (data as MovePanelData).mask != null &&
    (data as MovePanelData).search != null &&
    (data as MovePanelData).target != null
  );
};

export const isMoveSplitterData = (
  data: ActionPayload
): data is MoveSplitterData => {
  return (
    (data as MoveSplitterData).offset != null &&
    (data as MoveSplitterData).primary != null &&
    (data as MoveSplitterData).secondary != null
  );
};

export const isRemovePanelData = (
  data: ActionPayload
): data is RemovePanelData => {
  return (data as RemovePanelData).search != null;
};

export const isSelectTabData = (
  data: ActionPayload
): data is SelectTabData => {
  return (data as SelectTabData).search != null;
};
