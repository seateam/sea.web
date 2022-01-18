<template>
  <el-dialog id="NoteUpload" title="上传图片" v-model="showUpload" :close-on-click-modal="false">
    <div class="file">
      <el-image ref="image" class="file-image" v-if="fileUrl" :src="fileUrl"></el-image>
      <el-image ref="image" class="file-image" v-else-if="previewUrl" :src="previewUrl"></el-image>
      <div class="upload" v-if="fileUrl">
        <i class="el-icon el-icon-zoom-in" @click="showViewer = true"></i>
      </div>
      <div class="upload" v-else-if="previewUrl">
        <i class="el-icon el-icon-zoom-in" @click="showViewer = true"></i>
        <i class="el-icon el-icon-loading" v-if="uploadLoading"></i>
        <i class="el-icon el-icon-upload" v-else @click="bindUpload"></i>
        <i class="el-icon el-icon-delete" @click="bindDelete"></i>
      </div>
      <el-upload
        v-show="!previewUrl && !fileUrl"
        class="select"
        action="#"
        accept="image/*"
        list-type="picture"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="bindUploadChange"
      >
        <i slot="default" class="el-icon-plus" />
      </el-upload>
    </div>
    <div v-if="fileUrl" class="url">
      <div @click="bindCopy(fileUrl)">上传成功 复制代码</div>
      <el-input v-model="fileUrl" readonly @focus="bindFocus" />
    </div>
    <el-image-viewer
      v-if="showViewer"
      :on-close="bindCloseViewer"
      :url-list="[previewUrl || fileUrl]"
    />
  </el-dialog>
</template>

<script>
import * as qiniu from 'qiniu-js'
import * as dayjs from 'dayjs'
export default {
  name: 'NoteUpload',
  props: ['show'],
  data() {
    return {
      showViewer: false,
      showUpload: false,
      files: null,
      // 文件上传
      uploadLoading: false,
      previewUrl: '',
      uploadCancel: null,
      file: null,
      fileUrl: '',
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser
    },
  },
  methods: {
    bindCloseViewer() {
      this.showViewer = false
    },
    bindDelete() {
      if (this.uploadCancel) {
        this.uploadCancel.unsubscribe()
        this.$message.info('上传取消')
      }
      this.previewUrl = ''
    },
    bindUploadChange(file) {
      this.file = file
      this.previewUrl = file.url
    },
    bindCopy(v) {
      // ?imageView2/1/w/400/h/400
      this.$clipboard(`![图片](${v})`)
      this.$message.success('代码已复制，直接在文章粘贴')
    },
    bindFocus(event) {
      event.target.select()
    },
    // 上传
    async bindUpload() {
      this.uploadLoading = true
      const file = this.file.raw
      // 设置文件路径 key
      const time = dayjs().format('YYYY-MM-DD-hh-mm-ss')
      const note_id = this.$route.params.noteID
      file.key = `user/${this.user.id}/note/${note_id}/${time}`
      let res
      res = await Sea.Ajax({
        method: 'post',
        url: '/v3/qiniu.uptoken',
        data: { key: file.key },
      })
      if (res.uptoken) {
        this.uploadCancel = Sea.upload(qiniu, file, res.uptoken, (name, event) => {
          if (name === 'complete') {
            this.uploadLoading = false
            this.fileUrl = res.domain + event.key
            this.$message.success('上传成功')
          } else if (name === 'error') {
            this.uploadLoading = false
            this.$message.error('上传失败')
          }
        })
      }
    },
  },
  created() {
    this.$store.dispatch('actionUser')
  },
  watch: {
    show() {
      this.showUpload = true
      // 初始化
      this.previewUrl = ''
      this.fileUrl = ''
    },
  },
}
</script>

<style lang="scss">
#NoteUpload {
  .el-dialog__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 20px;

    .file {
      width: 61.8vw;
      height: 61.8vw;
      background: #f7f7f9;
      position: relative;

      .file-image {
        width: 100%;
        height: 100%;
        box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.4);

        > img {
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 0;
        }
      }

      .select {
        transition: 1s;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;

        .el-upload {
          .el-icon-plus {
            font-size: 36px;
          }
        }
      }

      .upload {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;

        .el-icon {
          font-size: 36px;
          color: rgba(255, 255, 255, 0);
          cursor: pointer;
        }
      }

      .upload:hover {
        background: rgba(0, 0, 0, 0.24);

        .el-icon {
          color: rgba(255, 255, 255, 0.44);
        }

        .el-icon:hover {
          color: rgba(255, 255, 255, 0.64);
        }

        .el-icon:active {
          color: rgba(0, 0, 0, 0.9);
        }
      }
    }

    .url {
      cursor: pointer;
      color: #67c23a;
      padding: 20px 20px 0;
      width: 100%;
    }
  }
}

@media (min-width: 1024px) {
  #NoteUpload {
    .el-dialog__body {
      padding: 10px 0 20px;

      .file {
        width: 60px;
        height: 60px;

        .select {
          .el-upload {
            .el-icon-plus {
              font-size: 12px;
            }
          }
        }

        .upload {
          .el-icon {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
