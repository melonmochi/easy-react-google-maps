'use strict'
import React from 'react'
import { Upload, Icon, message, Button, Select, Row, Tooltip } from 'antd';
import JSZip from 'jszip'

const csv = require('csvtojson')

const Option = Select.Option;

interface UploaderProps {
  addFileToData: any
}

interface UploaderState {
  fileList: Array<any>,
  uploading: boolean,
  onSelectFiles: { [key: string]: any },
  lastUploadedFiles: Array<any>,
  onSelectKey: String | undefined,
}

export default class Uploader extends React.Component<UploaderProps, UploaderState> {
  state = {
    fileList: new Array(),
    uploading: false,
    onSelectFiles: new Object(),
    lastUploadedFiles: new Array(),
    onSelectKey: undefined,
  }

  handleChangeSelect = (value: string) => {
    this.setState({
      onSelectKey: value,
    })
  }

  handleUpload = () => {
    const { fileList } = this.state;

    const ifDone = (file: any) => {
      return file.status === 'ok'
    }

    this.setState({
      lastUploadedFiles: new Array(),
    })

    const uploadingList = new Array()

    const loadingPromises =
      fileList
        .filter(file => !file.status)
        .map(file => {
          const zip = new JSZip()
          this.setState({
            uploading: true,
          })
          zip.loadAsync(file)
            .then(
              () => {
                const loadedFile = { ...file, status: 'ok' }
                uploadingList.push(loadedFile)
                file.status = 'done'
                Object.keys(zip.files).forEach((key) => {
                  zip.files[key].async("text").then(
                    (u8: any) => {
                      csv()
                        .fromString(u8)
                        .then((jsonObj: object) => {
                          const fileName: string = zip.files[key].name.split('.')[0];
                          this.props.addFileToData(fileName, jsonObj)
                        })
                    })
                });
                file.uncompressedFiles = zip
                this.setState({
                  onSelectKey: fileList.indexOf(file).toString(),
                })
              },
            )
            .catch(
              () => {
                const loadedFile = { ...file, status: 'failed' }
                uploadingList.push(loadedFile)
                file.status = 'error'
              },
            )
            .then(
              () => {
                this.setState({
                  lastUploadedFiles: uploadingList,
                  uploading: false,
                })
              },
            )
        },
        )

    Promise.all(loadingPromises).then(() => {
      const { lastUploadedFiles, uploading } = this.state
      const uploadStatus = lastUploadedFiles.every(ifDone)

      if (lastUploadedFiles.length === 0 && !uploading) {
        message.warn('no files uploaded', 10);
      } else if (uploadStatus) {
        message.success('files uploaded successfully.', 10);
      } else if (!uploadStatus) {
        message.error('some file had not uploaded.', 10);
      }
    })
  }

  render() {
    const { uploading, fileList, onSelectKey } = this.state;
    const props = {
      multiple: true,
      onRemove: (file: any) => {
        this.setState((state: UploaderState) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          const newLoadedList = newFileList.filter(newFile => newFile.status === 'done')
          return {
            fileList: newFileList,
            onSelectKey:
              newLoadedList.length > 0
                ?
                (newLoadedList.length - 1).toString()
                :
                '',
          };
        });
      },
      beforeUpload: (file: any) => {
        const isZIP = file.type === 'application/zip' || 'application/x-zip-compressed';
        if (!isZIP) {
          message.error('You can only upload zip file!', 10);
          file.status = 'error'
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.warn('File size is better to be smaller than 2MB!', 10);
        }
        this.setState((state: any) => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    const uploadedList = new Array()
    for (let i = 0; i < fileList.length && fileList[i].status === 'done'; i++) {
      uploadedList.push(<Option key={i.toString()}>{fileList[i].name}</Option>);
    }
    return (
      <div style={{ margin: 6 }}>
        <Row
          gutter={{ md: 24, lg: 36, xl: 48 }}
          type="flex"
          align="top"
          justify='start'
          style={{ marginLeft: 0, marginRight: 0, marginBottom: 6 }}
        >
          <Upload
            {...props}
          >
            <Button
              style={{ width: 214 }}
            >
              <Icon type="upload" /> Select File
              </Button>
          </Upload>
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
        </Row>
        <Select
          showSearch
          style={{ width: 214 }}
          placeholder="Imported data"
          optionFilterProp="children"
          onChange={this.handleChangeSelect}
          filterOption={(input, option) => option.props.children && typeof (option.props.children) === 'string' ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : null}
          disabled={!onSelectKey}
          value={onSelectKey}
        >
          {uploadedList}
        </Select>
      </div>
    )
  }
}
