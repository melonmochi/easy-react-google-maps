'use strict';
import React from 'react';
import { Upload, Icon, message, Button, Select, Row, Tooltip, Col } from 'antd';
import { zipLoader } from './ziploader';

const Option = Select.Option;

interface UploaderProps {
  onSelectGTFSFile: any;
}

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

export type FileList = Array<UploadFile>;

interface UploaderState {
  fileList: FileList;
  onSelectKey: String | undefined;
  onLoadedFiles: { key: string; file: object } | undefined;
  uploading: boolean;
}

export default class Uploader extends React.Component<UploaderProps, UploaderState> {
  state = {
    fileList: new Array(),
    onSelectKey: undefined,
    onLoadedFiles: undefined,
    uploading: false,
  };

  handleChangeSelect = (value: string) => {
    this.setState({
      onSelectKey: value,
    });
  };

  handleLoadSelect = () => {
    const { fileList, onSelectKey } = this.state;
    const onSelectGTFS = fileList.filter((file: UploadFile) => file.uid === onSelectKey)[0];

    this.props.onSelectGTFSFile(onSelectGTFS.decompressed);
  };

  handleUpload = () => {
    const { fileList } = this.state;

    this.setState({
      uploading: true,
    });

    const doneList = fileList.filter((file: UploadFile) => file.status);

    const loadingList = fileList.filter((file: UploadFile) => !file.status);

    const uploadPromises = zipLoader(loadingList);

    Promise.all(uploadPromises).then((lastUploadList: FileList) => {
      const lastSuccessFiles = lastUploadList.filter((file: UploadFile) => file.status === 'done');
      const newFileList = doneList.concat(lastUploadList);
      const uploadStatus: boolean = loadingList.length === lastSuccessFiles.length;

      this.setState({
        uploading: false,
        fileList: newFileList,
      });

      if (lastSuccessFiles.length !== 0) {
        if (!this.state.onSelectKey) {
          const newKey = lastSuccessFiles[0].uid;
          this.handleChangeSelect(newKey);
        }
        if (uploadStatus) {
          message.success('files uploaded successfully.', 10);
        } else {
          message.error('some file had not uploaded.', 10);
        }
      } else {
        message.warn('no files uploaded', 10);
      }
    });
  };

  render() {
    const { fileList, onSelectKey, uploading } = this.state;
    const props = {
      multiple: true,
      onRemove: (file: UploadFile) => {
        this.setState((state: UploaderState) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          const newLoadedList = newFileList.filter(newFile => newFile.status === 'done');
          return {
            fileList: newFileList,
            onSelectKey: newLoadedList.length > 0 ? (newLoadedList.length - 1).toString() : '',
          };
        });
      },
      beforeUpload: (file: UploadFile) => {
        const isZIP: boolean = file.type === ('application/zip' || 'application/x-zip-compressed');
        if (!isZIP) {
          message.error('You can only upload zip file!', 10);
          file.status = 'error';
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.warn('File size is better to be isZIP: booleasmaller than 2MB!', 10);
        }
        this.setState((state: any) => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      width: 214,
      fileList,
    };

    const uploadedOptionList = fileList
      .filter((file: UploadFile) => file.status === 'done')
      .map((uploadFile: UploadFile) => <Option key={uploadFile.uid}>{uploadFile.name}</Option>);

    return (
      <div style={{ margin: 6 }}>
        <Row
          gutter={{ md: 24, lg: 36, xl: 48 }}
          type="flex"
          align="top"
          justify="start"
          style={{ marginLeft: 0, marginRight: 0, marginBottom: 6 }}
        >
          <Col span={18} style={{ paddingLeft: 0, paddingRight: 0 }}>
            <Upload {...props}>
              <Button style={{ width: 214 }}>
                <Icon type="upload" /> Select File
              </Button>
            </Upload>
          </Col>
          <Col span={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
            <Tooltip title={'Upload'}>
              <Button
                type="primary"
                shape="circle"
                icon="cloud-upload"
                onClick={this.handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginLeft: 6 }}
              />
            </Tooltip>
          </Col>
        </Row>
        <Col span={18} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Select
            showSearch
            style={{ width: 214 }}
            placeholder="Imported data"
            optionFilterProp="children"
            onChange={this.handleChangeSelect}
            filterOption={(input, option) =>
              option.props.children && typeof option.props.children === 'string'
                ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : null
            }
            disabled={!onSelectKey}
            value={onSelectKey}
          >
            {uploadedOptionList}
          </Select>
        </Col>
        <Col span={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Tooltip title={'Load'}>
            <Button
              type="primary"
              shape="circle"
              icon="reload"
              onClick={this.handleLoadSelect}
              disabled={!onSelectKey}
              style={{ marginLeft: 6 }}
            />
          </Tooltip>
        </Col>
      </div>
    );
  }
}
