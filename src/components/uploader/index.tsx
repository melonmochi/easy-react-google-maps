import React from 'react'
import { Upload, Icon, message, Button, Select } from 'antd';
import JSZip from 'jszip'
const Option = Select.Option;
const Parser = require('text2json').Parser
const parse = new Parser({hasHeader : true})

interface UploaderState {
  fileList: Array<any>,
  uploading: boolean,
  onSelectFile?: any,
  lastUploadedFiles: Array<any>,
  onSelectKey: String,
}

export default class Uploader extends React.Component<any, UploaderState> {
  state = {
    fileList: new Array(),
    uploading: false,
    onSelectFile: undefined,
    lastUploadedFiles: new Array(),
    onSelectKey: '',
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
                Object.keys(zip.files).forEach( (key) => {
                  zip.files[key].async("text").then(
                    u8 => {parse.text2json (u8, (err: any, data: any) => {
                      if (err) {
                        console.error (err)
                      } else {
                        // tslint:disable-next-line:no-console
                        console.log(data)
                      }
                    })
                  })
                });
                // tslint:disable-next-line:no-console
                console.log('im in loadAsync zip.files is', typeof(zip.files))
                file.uncompressedFiles = zip
                file.onSelectFile = file
                this.setState({
                  onSelectFile: file,
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
    const { uploading, fileList, onSelectFile, onSelectKey } = this.state;
    // tslint:disable-next-line:no-console
    console.log('in render, this.state.fileList is', this.state.fileList)
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
        const isZIP = file.type === 'application/zip';
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
          value={onSelectKey}
        >
          {uploadedList}
        </Select>
      </div>
    )
  }
}
