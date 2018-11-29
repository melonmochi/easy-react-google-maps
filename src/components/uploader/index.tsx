import React from 'react'
import { Upload, Icon, message, Button, Select } from 'antd';
import JSZip from 'jszip'

// const Dragger = Upload.Dragger;

const Option = Select.Option;

interface UploaderState {
  fileList: Array<any>,
  uploading: boolean,
  onSelectFile?: any,
  lastUploadedFiles: Array<any>,
}

export default class Uploader extends React.Component<any, UploaderState> {
  state = {
    fileList: new Array(),
    uploading: false,
    onSelectFile: undefined,
    lastUploadedFiles: new Array(),
  }

  handleChangeSelect(value: any) {
    // tslint:disable-next-line:no-console
    console.log(`selected ${value}`);
  }

  handleUpload = () => {
    const { fileList } = this.state;

    const ifDone = (file: any) => {
      return file.status === 'true'
    }

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
                file.uncompressedFiles = zip
                // tslint:disable-next-line:no-console
                console.log('im in loadAsync, first then, uploadingList is', uploadingList)
                this.setState({
                  onSelectFile: this.state.onSelectFile? file: this.state.onSelectFile,
                })
              },
            )
            .catch(
              () => {
                // tslint:disable-next-line:no-console
                console.log('im in loadAsync, catch')
                const loadedFile = { ...file, status: 'failed' }
                uploadingList.push(loadedFile)
                file.status = 'error'
              },
            )
            .then(
              () => {
                // tslint:disable-next-line:no-console
                console.log('im in loadAsync, second then uploadingList is', uploadingList)
                this.setState({
                  fileList,
                  lastUploadedFiles: uploadingList,
                })
              },
            )
            .then(
              () => {
                this.setState({
                  uploading: false,
                })
                // tslint:disable-next-line:no-console
                console.log('im done a iteratal with file:', this.state)
                this.forceUpdate()
              },
            )
        },
        )

    Promise.all(loadingPromises).then(() => {
      // tslint:disable-next-line:no-console
      console.log('im in loadingPromises, this.state is', this.state)
      const { lastUploadedFiles } = this.state
      const uploadStatus = lastUploadedFiles.every(ifDone)

      if (lastUploadedFiles.length === 0) {
        message.warn('no files uploaded', 10);
      } else if (uploadStatus) {
        message.success('files uploaded successfully.', 10);
      } else if (!uploadStatus) {
        message.error('some file had not uploaded.', 10);
      }
    })
  }

  render() {
    const { uploading, fileList, onSelectFile } = this.state;
    const props = {
      multiple: true,
      onRemove: (file: any) => {
        this.setState((state: UploaderState) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file: any) => {
        const isZIP = file.type === 'application/zip';
        if (!isZIP) {
          message.error('You can only upload zip file!', 10);
          file.status = 'error'
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.warn('File size is better be smaller than 2MB!', 10);
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
      uploadedList.push(<Option key={i.toString()}>{i.toString()}</Option>);
    }
    return (
      <div style={{ margin: '12px' }}>
        <Upload
          {...props}
        >
          <Button>
            <Icon type="upload" /> Select File
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 12, marginBottom: 12 }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
        <Select
          showSearch
          style={{ display: 'inline' }}
          placeholder="Imported data"
          optionFilterProp="children"
          onChange={this.handleChangeSelect}
          filterOption={(input, option) => option.props.children && typeof (option.props.children) === 'string' ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : null}
          disabled={!onSelectFile}
        >
          {uploadedList}
        </Select>
      </div>
    )
  }
}
