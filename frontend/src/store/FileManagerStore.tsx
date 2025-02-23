import { create } from 'zustand';
import {
  OpenMultipleFilesDialog,
  AddFileToWorkspace,
  HeaderFiltersFileValidation,
  GetFilesInWorkspaceInfo,
  DeleteBOMFile,
  UpdateVersionTags,
  BtnCompare,
  UpdateLastComparison,
} from '../../wailsjs/go/main/App';
import { Monitor } from '../types/global';
import { WSChooserStore } from './WSChooserStore';
import { workspaces } from '../../wailsjs/go/models';
import { core } from '../../wailsjs/go/models';
import { CompareViewStore } from './CompareViewStore';
import { CalculatorStore } from './CalculatorStore';
type FileInfo = workspaces.FileInfo;
type XlsmFile = core.XlsmFile;

interface FileManagerProps {
  files: FileInfo[] | null;
  filesToValidate: XlsmFile[] | null;
  selectedFiles: [FileInfo, FileInfo] | [FileInfo, null] | [null, null];
  monitor: Monitor;
  compareMonitor: Monitor;
  isVisible: boolean;
  toggleVisibility: () => void;
  loadFiles: () => void;
  uploadFiles: () => void;
  validationControl: (key: string, sign: string) => void;
  confirmValidation: () => void;
  cancelValidation: () => void;
  deleteFile: (file: FileInfo) => void;
  moveFile: (direction: string, file: FileInfo) => void;
  selectFile: (file: FileInfo) => void;
  compare: () => void;
  reset: () => void;
}

export const FileManagerStore = create<FileManagerProps>((set) => ({
  files: null,
  filesToValidate: null,
  selectedFiles: [null, null],
  monitor: { isLoading: false, error: null },
  compareMonitor: { isLoading: false, error: null },
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
    const file: XlsmFile | undefined = filesToValidate
      ? filesToValidate[0]
      : undefined;
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
  deleteFile: async (file: FileInfo) => {
    set({ monitor: { isLoading: true, error: null } });
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace)
      return set({
        monitor: { isLoading: false, error: 'No active workspace found.' },
      });
    try {
      await DeleteBOMFile(activeWorkspace, file);
      FileManagerStore.getState().loadFiles();
      set({ monitor: { isLoading: false, error: null } });
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  moveFile: async (direction: string, file: FileInfo) => {
    set({ monitor: { isLoading: true, error: null } });
    set((state) => {
      if (!state.files) return {};
      const currentIndex = state.files.indexOf(file);
      if (currentIndex === -1) return {};
      let newIndex = direction === '+' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex < 0 || newIndex >= state.files.length) return {};
      const newFiles = [...state.files];
      [newFiles[currentIndex], newFiles[newIndex]] = [
        newFiles[newIndex],
        newFiles[currentIndex],
      ];
      newFiles.forEach((file, index) => {
        file.version_tag = index + 1;
      });
      return { files: newFiles };
    });
    const files = FileManagerStore.getState().files;
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace || !files)
      return set({
        monitor: {
          isLoading: false,
          error: 'No active workspace or no files found.',
        },
      });
    try {
      await UpdateVersionTags(activeWorkspace, files);
      set({ monitor: { isLoading: false, error: null } });
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  selectFile: (file: FileInfo) =>
    set((state) => {
      const [file1, file2] = state.selectedFiles;
      if (file1 === file || file2 === file) {
        if (file === file1) {
          return { selectedFiles: [file2, null] };
        }
        return { selectedFiles: [file1, null] };
      }
      if (!file1) {
        return { selectedFiles: [file, null] };
      }
      if (!file2) {
        return { selectedFiles: [file1, file] };
      }
      return { selectedFiles: [file1, file] };
    }),
  compare: async () => {
    set({ compareMonitor: { isLoading: true, error: null } });
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace)
      return set({
        compareMonitor: {
          isLoading: false,
          error: 'No active workspace found.',
        },
      });
    const filesToCompare = FileManagerStore.getState().selectedFiles;
    if (!filesToCompare[0] || !filesToCompare[1])
      return set({
        compareMonitor: { isLoading: false, error: 'No files selected.' },
      });
    try {
      await BtnCompare(
        filesToCompare[0].components,
        filesToCompare[1].components,
      );
      await UpdateLastComparison(
        activeWorkspace,
        filesToCompare[0],
        filesToCompare[1],
      );
      set({ compareMonitor: { isLoading: false, error: null } });
      FileManagerStore.getState().toggleVisibility();
      CompareViewStore.getState().loadComponents();
      CalculatorStore.getState().getProductionQuantity();
      if (!CompareViewStore.getState().isVisible)
        CompareViewStore.getState().toggleVisibility();
    } catch (err) {
      set({ compareMonitor: { isLoading: false, error: String(err) } });
    }
  },
  reset: () => {
    set({
      files: null,
      filesToValidate: null,
      selectedFiles: [null, null],
      monitor: { isLoading: false, error: null },
      compareMonitor: { isLoading: false, error: null },
      isVisible: false,
    });
  },
}));
