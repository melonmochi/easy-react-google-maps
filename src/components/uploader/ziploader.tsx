import JSZip from 'jszip';

import { DecompressedGTFSFile, UploadFile } from 'typings'

import { GTFSFileNamesArray } from 'utils'

export type FileList = Array<UploadFile>;

const ifLoadZipSuccess = (promise: Promise<JSZip>) =>
  promise.then(zip => zip).catch(() => undefined);

const arrayToObject = (
  array: {
    GTFSFileName: string;
    decompressedGTFSFile: string;
  }[]
) =>
  array.reduce((obj: { [key: string]: string }, item) => {
    obj[item.GTFSFileName] = item.decompressedGTFSFile;
    return obj;
  }, {});

const loadAsyncZipFiles = async (zipFile: JSZip) => {
  const zipFiles = Object.keys(zipFile.files)
    .map((k: string) => zipFile.files[k])
    .filter((compressedFile: JSZip.JSZipObject) =>
      GTFSFileNamesArray.includes(compressedFile.name.split('.')[0])
    );

  const unZipGTFSFilesPromises = zipFiles.map(async (compressedGTFSFile: JSZip.JSZipObject) => {
    const GTFSFileName: string = compressedGTFSFile.name.split('.')[0];
    const decompressedGTFSFile = await compressedGTFSFile.async('text', metadata => {
      console.log(
        'progression of ' + compressedGTFSFile.name + ' is ' + metadata.percent.toFixed(2) + ' %'
      );
    });
    return { GTFSFileName: GTFSFileName, decompressedGTFSFile: decompressedGTFSFile };
  });

  const unZipGTFSFiles = await Promise.all(unZipGTFSFilesPromises);

  const decompressed = arrayToObject(unZipGTFSFiles);

  return decompressed;
};

export const zipLoader = async (uploadList: FileList) => {
  const uploadPromises = uploadList.map(async (file: any) => {
    file.decompressed = new Object() as DecompressedGTFSFile;
    const zip = new JSZip();
    const zipPromise = await ifLoadZipSuccess(zip.loadAsync(file));

    const decompressed = zipPromise ? await loadAsyncZipFiles(zipPromise) : undefined;

    const uploadingStatus = decompressed ? 'done' : 'error';

    const setFileStatus = async (status: 'done' | 'error') => {
      file.status = status;
    };

    const setDecompressed = async (unzipped: { [key: string]: string } | undefined) => {
      file.decompressed = unzipped;
    };

    const newFilePromise = await Promise.all([
      await setFileStatus(uploadingStatus),
      await setDecompressed(decompressed),
    ]).then(() => {
      return file;
    });
    return await newFilePromise;
  });
  const uploadPromisesArray = await Promise.all(uploadPromises)
  return uploadPromisesArray;
};
