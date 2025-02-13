import { create } from 'zustand';
import {
  OpenMultipleFilesDialog,
  AddFileToWorkspace,
  HeaderFiltersFileValidation,
  GetFilesInWorkspaceInfo,
} from '../../wailsjs/go/main/App';
import { Monitor } from '../types/global';
import { WSChooserStore } from './WSChooserStore';
import { workspaces } from '../../wailsjs/go/models';
import { core } from '../../wailsjs/go/models';
type FileInfo = workspaces.FileInfo;
type XlsmFile = core.XlsmFile;

interface FileManagerProps {
  files: FileInfo[] | null;
  filesToValidate: XlsmFile[] | null;
  selectedFiles: [FileInfo, FileInfo] | null;
  monitor: Monitor;
  isVisible: boolean;
  toggleVisibility: () => void;
  loadFiles: () => void;
  uploadFiles: () => void;
  validationControl: (key: string, sign: string) => void;
  confirmValidation: () => void;
  cancelValidation: () => void;
}

export const FileManagerStore = create<FileManagerProps>((set) => ({
  files: null,
  filesToValidate: null,
  selectedFiles: null,
  monitor: { isLoading: false, error: null },
  isVisible: false,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  loadFiles: async () => {
    set({ monitor: { isLoading: true, error: null } });
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace)
      return set({
        monitor: { isLoading: false, error: 'No active workspace found.' },
      });
    try {
      const files: FileInfo[] = await GetFilesInWorkspaceInfo(activeWorkspace);
      set({ files: files, monitor: { isLoading: false, error: null } });
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  uploadFiles: async () => {
    set({ monitor: { isLoading: true, error: null } });
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace)
      return set({
        monitor: { isLoading: false, error: 'No active workspace found.' },
      });
    try {
      const filePaths: string[] = await OpenMultipleFilesDialog();
      if (!filePaths)
        return set({
          monitor: { isLoading: false, error: null },
        });
      const filesToValidate: XlsmFile[] = [];
      for (const filePath of filePaths) {
        try {
          if (filePath) {
            const initialFile: XlsmFile =
              await HeaderFiltersFileValidation(filePath);
            if (initialFile) filesToValidate.push(initialFile);
          }
          set({ filesToValidate, monitor: { isLoading: false, error: null } });
        } catch (err) {
          set({ monitor: { isLoading: false, error: String(err) } });
        }
      }
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  validationControl: (key: string, sign: string) =>
    set((state) => {
      if (!state.filesToValidate || state.filesToValidate.length === 0) {
        return {};
      }
      const file = state.filesToValidate[0];
      if (key === 'Header')
        file.filters.header =
          sign === '+'
            ? file.filters.header + 1
            : Math.max(0, file.filters.header - 1);
      if (key === 'Quantity')
        file.filters.quantity =
          sign === '+'
            ? file.filters.quantity + 1
            : Math.max(0, file.filters.quantity - 1);
      if (key === 'MPN')
        file.filters.mpn =
          sign === '+'
            ? file.filters.mpn + 1
            : Math.max(0, file.filters.mpn - 1);
      if (key === 'Description')
        file.filters.description =
          sign === '+'
            ? file.filters.description + 1
            : Math.max(0, file.filters.description - 1);
      if (key === 'Designator')
        file.filters.designator =
          sign === '+'
            ? file.filters.designator + 1
            : Math.max(0, file.filters.designator - 1);
      if (key === 'Manufacturer')
        file.filters.manufacturer =
          sign === '+'
            ? file.filters.manufacturer + 1
            : Math.max(0, file.filters.manufacturer - 1);
      return { filesToValidate: [...state.filesToValidate] };
    }),
  confirmValidation: async () => {
    set({ monitor: { isLoading: true, error: null } });
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    const filesToValidate = FileManagerStore.getState().filesToValidate;
    const file: XlsmFile | undefined = filesToValidate?.shift();
    if (!file) {
      return set({
        monitor: { isLoading: false, error: 'No file to validate.' },
      });
    }
    if (!activeWorkspace)
      return set({
        monitor: { isLoading: false, error: 'No active workspace found.' },
      });
    try {
      await AddFileToWorkspace(activeWorkspace, file);
      set((state) => {
        const updatedFiles = state.filesToValidate?.slice(1);
        return {
          filesToValidate: updatedFiles?.length === 0 ? null : updatedFiles,
        };
      });
      FileManagerStore.getState().loadFiles();
      set({ monitor: { isLoading: false, error: null } });
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  cancelValidation: () =>
    set((state) => {
      const updatedFiles = state.filesToValidate?.slice(1);
      return {
        filesToValidate: updatedFiles?.length === 0 ? null : updatedFiles,
      };
    }),
}));
