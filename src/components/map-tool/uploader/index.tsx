import React, { FunctionComponent, useState, useContext } from 'react';
import { Upload, Button, Icon, Card, message, Select, Tooltip } from 'antd';
import { FileList, UploadFile } from 'typings';
import { GTFSZipsLoader, loadGTFSFiles } from './utils';
import { GlobalContext } from 'src/components/global-context';
const Option = Select.Option;

export const Uploader: FunctionComponent = () => {
  const { dispatch } = useContext(GlobalContext);
  const [fileList, setFileList] = useState<FileList>([]);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const handleChangeSelect = (value: string) => {
    setSelectedKey(value);
  };

  const handleLoadSelect = () => {
    const onSelectGTFS = fileList.find((file: UploadFile) => file.uid === selectedKey);
    if (onSelectGTFS && onSelectGTFS.decompressed) {
      const fileInObject = loadGTFSFiles(onSelectGTFS.decompressed);
      dispatch({ type: 'CHANGE_GTFS', payload: fileInObject });
    }
  };

  const handleUploadAsync = async () => {
    setUploading(true);

    const doneList = fileList.filter((file: UploadFile) => file.status);
    const loadingList = fileList.filter((file: UploadFile) => !file.status);
    const lastUploadList = await GTFSZipsLoader(loadingList);
    const lastSuccessFiles = lastUploadList.filter((file: UploadFile) => file.status === 'done');
    const newFileList = doneList.concat(lastUploadList);
    const uploadStatus: boolean = loadingList.length === lastSuccessFiles.length;

    if (lastSuccessFiles.length !== 0) {
      if (!selectedKey) {
        const newKey = lastSuccessFiles[0].uid;
        handleChangeSelect(newKey);
      }
      if (uploadStatus) {
        message.success('files uploaded successfully.', 10);
      } else {
        message.error('some file had not uploaded.', 10);
      }
    } else {
      message.warn('no files uploaded', 10);
    }

    setFileList(newFileList);
  };

  const handleUpload = () => {
    handleUploadAsync().then(() => setUploading(false));
  };

  const props = {
    multiple: true,
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      const newLoadedList = newFileList.filter(newFile => newFile.status === 'done');
      setFileList(newFileList);
      setSelectedKey(newLoadedList.length > 0 ? (newLoadedList.length - 1).toString() : '');
    },
    beforeUpload: (file: UploadFile) => {
      const isZIP: boolean = file.type === 'application/zip' || file.type === 'application/x-zip-compressed';
      if (!isZIP) {
        message.error('You can only upload zip file!', 10);
        file.status = 'error';
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.warn('File size is better to be smaller than 2MB!', 10);
      }
      setFileList([...fileList, file]);
      return false;
    },
    width: 214,
    fileList,
  };

  const uploadList = fileList
    .filter((file: UploadFile) => file.status === 'done')
    .map((f: UploadFile) => <Option key={f.uid}>{f.name}</Option>);

  return (
    <Card bordered={false} bodyStyle={{ padding: '10px' }}>
      <div style={{ display: 'flex' }}>
        <Upload {...props}>
          <Button style={{ width: 214 }}>
            <Icon type="upload" />
            Select File
          </Button>
        </Upload>
        <Tooltip title={'Upload'}>
          <Button
            type="primary"
            shape="circle"
            icon="cloud-upload"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginLeft: 6 }}
          />
        </Tooltip>
      </div>
      <div style={{ display: 'flex', marginTop: '6px' }}>
        <Select
          showSearch
          style={{ width: 214 }}
          placeholder="Imported data"
          optionFilterProp="children"
          onChange={handleChangeSelect}
          filterOption={(input, option) =>
            option.props.children && typeof option.props.children === 'string'
              ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              : null
          }
          disabled={!selectedKey}
          value={selectedKey}
        >
          {uploadList}
        </Select>
        <Tooltip title={'Load'}>
          <Button
            type="primary"
            shape="circle"
            icon="reload"
            onClick={handleLoadSelect}
            disabled={!selectedKey || uploading}
            style={{ marginLeft: 6 }}
          />
        </Tooltip>
      </div>
    </Card>
  );
};
