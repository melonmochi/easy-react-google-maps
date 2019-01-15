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
  'trips',
  'stop_times',
  'calendar',
  'calendar_dates',
  'fare_attributes',
  'fare_rules',
  'shapes',
  'frequencies',
  'transfers',
  'feed_info',
];

export type FileList = Array<UploadFile>;

export const zipLoader = (uploadList: FileList) => {
  const uploadPromises = uploadList.map((file: any) => {
    const zip = new JSZip();
    const zipPromise = zip
      .loadAsync(file)
      .then(() => {
        const unZipPromises = Object.keys(zip.files)
          .map((k: string) => zip.files[k])
          .filter((compressedFile: JSZip.JSZipObject) =>
            GTFSFiles.includes(compressedFile.name.split('.')[0]),
          )
          .map((compressedFile: JSZip.JSZipObject) => {
            compressedFile
              .async(
                'text', /*, metadata => {
                        console.log("progression of " + compressedFile.name +  " is " + metadata.percent.toFixed(2) + " %")
                      }*/
              )
              .then((u8: string) => {
                file.decompressed = {
                  ...file.decompressed,
                  [compressedFile.name.split('.')[0]]: u8,
                };
              });
          });
        Promise.all(unZipPromises).then(() => {
          file.status = 'done';
        });
        return file;
      })
      .catch(() => {
        file.status = 'error';
        return file;
      });
    return zipPromise;
  });
  return uploadPromises;
};
