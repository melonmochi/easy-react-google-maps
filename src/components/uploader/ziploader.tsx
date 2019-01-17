import JSZip from 'jszip';

export declare type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';

type UploadFile = {
  uid: string;
  size: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  originFileObj?: File;
  response?: any;
  error?: any;
  linkProps?: any;
  type: string;
  decompressed?: { [key: string]: string };
};

const GTFSFiles = [
  'agency',
  'stops',
  'routes',
  // 'trips',
  // 'stop_times',
  'calendar',
  'calendar_dates',
  'fare_attributes',
  'fare_rules',
  // 'shapes',
  'frequencies',
  'transfers',
  'feed_info',
];

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
      GTFSFiles.includes(compressedFile.name.split('.')[0])
    );

  const unZipGTFSFilesPromises = zipFiles.map(async (compressedGTFSFile: JSZip.JSZipObject) => {
    const GTFSFileName = compressedGTFSFile.name.split('.')[0];
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

export const zipLoader = (uploadList: FileList) => {
  const uploadPromises = uploadList.map(async (file: any) => {
    file.decompressed = new Object();
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

    const newFilePromise = Promise.all([
      setFileStatus(uploadingStatus),
      setDecompressed(decompressed),
    ]).then(() => {
      return file;
    });
    return await newFilePromise;
  });
  return uploadPromises;
};
