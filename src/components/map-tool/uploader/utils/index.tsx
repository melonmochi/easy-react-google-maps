import JSZip from 'jszip';
import { DecompressedGTFSFile, UploadFile, FileList, GTFSFileName, GTFSFile } from 'typings';
import { GTFSFileNamesArray } from 'utils';
import csv from 'csvtojson';

// zipToString

const ifSuccess = (promise: Promise<JSZip>) => promise.then(zip => zip).catch(() => undefined);

const arrayToObject = (
  arr: Array<{
    name: GTFSFileName;
    data: string;
  }>
) =>
  arr.reduce(
    (obj: DecompressedGTFSFile, item) => {
      obj[item.name] = item.data;
      return obj;
    },
    {} as DecompressedGTFSFile
  );

const unzipFiles = (zipFiles: JSZip.JSZipObject[]) => {
  return zipFiles.map(async (compressedFile: JSZip.JSZipObject) => {
    const fileName = compressedFile.name.split('.')[0] as GTFSFileName;
    const decompressedFile = await compressedFile.async('text', metadata => {
      console.log(
        'progression of ' + compressedFile.name + ' is ' + metadata.percent.toFixed(2) + ' %'
      );
    });
    return { name: fileName, data: decompressedFile };
  });
};

const loadAsyncZipFiles = async (zip: JSZip) => {
  const compressedFiles = Object.keys(zip.files)
    .map((k: string) => zip.files[k])
    .filter((compressedFile: JSZip.JSZipObject) =>
      GTFSFileNamesArray.includes(compressedFile.name.split('.')[0])
    );
  const decompressedFiles = unzipFiles(compressedFiles);
  const unZipGTFSFiles = await Promise.all(decompressedFiles);
  const decompressed = arrayToObject(unZipGTFSFiles);
  return decompressed;
};

const GTFSZipLoader = async (file: UploadFile) => {
  file.decompressed = new Object() as DecompressedGTFSFile;
  const zip = new JSZip();
  const unzipPromise = await ifSuccess(zip.loadAsync(file as any));
  const unzipped = unzipPromise ? await loadAsyncZipFiles(unzipPromise) : undefined;

  const uploadingStatus = unzipped ? 'done' : 'error';
  file.status = uploadingStatus;
  file.decompressed = unzipped;

  return file;
};

export const GTFSZipsLoader = (uploadList: FileList) =>
  Promise.all(uploadList.map((file: UploadFile) => GTFSZipLoader(file)));

// StringToCSV

const stringToCSV = async (file: string) => {
  return await csv().fromString(file);
};

export const loadGTFSFiles = (onSelectFile: DecompressedGTFSFile) => {
  const GTFSObject: GTFSFile = new Object();
  Object.keys(onSelectFile).forEach(async (name: keyof DecompressedGTFSFile) => {
    const fileInString = onSelectFile[name];
    if (fileInString) {
      GTFSObject[name] = await stringToCSV(fileInString);
    }
  });
  return GTFSObject;
};
