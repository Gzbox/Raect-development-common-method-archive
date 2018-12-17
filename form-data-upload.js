import React, { Component } from 'react';
import { Upload, message } from 'antd';

const uploadPath = (path, file) => {
  return `${path}${file.name.split(".")[0]}-${file.uid}.${file.type.split("/")[1]}`
}


export default class PicturesWall extends React.Component {
  state = {
    fileListData: [],
    ossData: {},
  };

  onStart = (file) => {
    console.log('onStart', file.name);
    // this.refs.inner.abort(file);
  }

  onSuccess = (file) => {
    console.log('onSuccess', file);
  }

  onProgress = (step, file) => {
    console.log('onProgress', Math.round(step.percent), file.name);
  }

  onError = (err) => {
    console.log('onError', err);
  }

  beforeUpload = (file) => {
    console.log('file:%o', file)
   
    const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
    if (!isJPG) {
      message.error('只能上传图片类型的文件!');
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 100;
    if (!isLt2M) {
      message.error('图片大小必须小于100M!');
      return false;
    }
    
     // console.log('isJPG:%o', isJPG)
    const reader = new FileReader();
    // reader.readAsDataURL(file); // 转为base64
    // reader.readAsBinaryString(file); // 转为二进制字符串形式的 file/blob 数据
    reader.readAsArrayBuffer(file); // 转为二进制ArrayBuffer形式的 file/blob 数据

    reader.onloadend = () => {
      const xhr = new XMLHttpRequest()
      let ot = new Date().getTime();   // 设置上传开始时间
      let oloaded = 0;// 设置上传开始时，以上传的文件大小为0

      console.log('reader:%o', reader)
      const ossData = new FormData();
      ossData.append('OSSAccessKeyId', config.accessid);
      ossData.append('policy', config.policy);
      ossData.append('Signature', config.signature);
      ossData.append('key', uploadPath(config.dir, file))
      ossData.append('file', reader.result.toString());



      xhr.open("post", config.region, true)
      xhr.onload = (evt) => {
        this.setState({
          progressBar: 0,
        })
        // 服务断接收完文件返回的结果
        message.success('上传文件成功', 3)
      }; // 请求完成
      xhr.onerror = (evt) => {
        message.warning('上传失败，请重新操作', 3)
      }; // 请求失败

      // 上传进度调用方法实现
      xhr.upload.onloadstart = () => {// 上传开始执行方法 
        ot = new Date().getTime();   // 设置上传开始时间
        oloaded = 0;// 设置上传开始时，以上传的文件大小为0
      };

      xhr.upload.onprogress = (evt) => {
        // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
        if (evt.lengthComputable) {
          console.log(evt.total);
          console.log(evt.loaded);
          console.log(`${Math.round(evt.loaded / evt.total * 100)}%`);
          this.setState({
            progressBar: Math.round(evt.loaded / evt.total * 100),
          })
        }

        // 上传进度实现方法，上传过程中会频繁调用该方法
        const nt = new Date().getTime();// 获取当前时间
        const pertime = (nt - ot) / 1000; // 计算出上次调用该方法时到现在的时间差，单位为s
        ot = new Date().getTime(); // 重新赋值时间，用于下次计算

        const perload = evt.loaded - oloaded; // 计算该分段上传的文件大小，单位b       
        oloaded = evt.loaded;// 重新赋值已上传文件大小，用以下次计算

        // 上传速度计算
        let speed = perload / pertime;// 单位b/s
        const bspeed = speed;
        let units = 'b/s';// 单位名称
        if (speed / 1024 > 1) {
          speed /= 1024;
          units = 'k/s';
        }
        if (speed / 1024 > 1) {
          speed /= 1024;
          units = 'M/s';
        }
        speed = speed.toFixed(1);
        // 剩余时间
        const resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
        console.log(`速度：${speed}${units}，剩余时间：${resttime}s`);
        if (bspeed === 0) console.log('上传已取消');
      };

      xhr.send(ossData); // 开始上传，发送form数据

   

  }

  
  render() {
    const { fileListData } = this.state;
    const uploadButton = (
      <div>
        <Button>
          <Icon type="upload" /> 点击上传
        </Button>
      </div>
    );

    return (
      <div className="clearfix">
        <Upload
          className={styles.uploadImgBox}
          name="file"
          data={ossData}
          action={config.region}
          showUploadList={false}
          beforeUpload={this.beforeUpload}
          onStart={this.onStart}
          onSuccess={this.onSuccess}
          onProgress={this.onProgress}
          onError={this.onError}
        >
          {(fileListData && fileListData.length > 9) ? null : uploadButton}
        </Upload>
      </div>
    );
  }
}
