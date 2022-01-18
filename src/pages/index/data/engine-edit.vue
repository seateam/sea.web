<template>
  <div id="EngineEdit">
    <!-- 弹窗 搜索引擎 -->
    <el-dialog
      :title="type === 'add' ? '新建 搜索引擎' : '编辑 搜索引擎'"
      v-model="dialogShow"
      custom-class="EngineEdit-dialog"
      append-to-body
      :close-on-click-modal="false"
    >
      <div class="edit">
        <el-form :model="form" label-position="right" :label-width="isPC ? '190px' : '85px'">
          <el-form-item label="名称">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="图标" class="url">
            <el-input v-model="form.icon" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="ＰＣ端" class="url">
            <el-input v-model="form.pc" autocomplete="off" type="textarea" autosize resize="none"></el-input>
          </el-form-item>
          <el-form-item label="移动端" class="url">
            <el-input
              v-model="form.mobile"
              autocomplete="off"
              type="textarea"
              autosize
              resize="none"
            ></el-input>
          </el-form-item>
          <el-form-item label="ＡＰＰ" class="url">
            <el-input v-model="form.app" autocomplete="off" type="textarea" autosize resize="none"></el-input>
          </el-form-item>
          <el-form-item label="颜色" class="color">
            <el-input v-model="form.color" @focus="(e) => e.target.select()" clearable></el-input>
            <input type="color" v-model="form.color" />
          </el-form-item>
          <el-form-item label="标签" class="tags">
            <el-tag :key="i" v-for="(tag, i) in form.tags" closable @close="bindTagClose(i)">
              {{
                tag
              }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="tagInputShow"
              v-model="tagInput"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="bindTagAdd"
              @blur="bindTagAdd"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="tagInputShow = true">+ 新标签</el-button>
          </el-form-item>
          <el-form-item label="墙外" class="outwall">
            <el-switch v-model="form.outwall"></el-switch>
          </el-form-item>
          <el-form-item label="ＰＣ主页" class="url">
            <el-input
              v-model="form.home"
              autocomplete="off"
              type="textarea"
              autosize
              placeholder="默认不填"
              resize="none"
            ></el-input>
          </el-form-item>
          <el-form-item label="移动端主页" class="url">
            <el-input
              v-model="form.home_mobile"
              autocomplete="off"
              type="textarea"
              autosize
              placeholder="默认不填"
              resize="none"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="preview">
          <div class="engines">
            <div
              class="engine context-menu-hover"
              :disabled="form.outwall"
              :style="{ color: form.color }"
            >
              <icon-app :name="form.icon || 'shalou'" />
              <span>{{ form.name || 'Sea Personal Assistant' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="bindSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Sea from '../../../assets/js/bigsea'
export default {
  name: 'EngineEdit',
  props: ['edit', 'show', 'type'],
  data() {
    return {
      dialogShow: false,
      form: {
        name: '',
        color: '',
        icon: '',
        pc: '',
        mobile: '',
        app: '',
        home: '',
        home_mobile: '',
        tags: [],
        outwall: false,
      },
      tagInput: '',
      tagInputShow: false,
    }
  },
  computed: {
    isPC() {
      return this.$store.state.isPC
    },
    user() {
      return this.$store.getters.getUser
    },
  },
  methods: {
    bindTagClose(i) {
      this.form.tags.splice(i, 1)
    },
    bindTagAdd() {
      if (this.tagInput) {
        if (this.form.tags) {
          this.form.tags.push(this.tagInput)
        } else {
          this.form.tags = [this.tagInput]
        }
      }
      this.tagInputShow = false
      this.tagInput = ''
    },
    bindSave() {
      if (!this.form.name) {
        this.$message.info('请填搜索引擎')
        return
      }
      this.$emit('save', Sea.deepCopy(this.form))
      this.dialogShow = false
    },
  },
  created() { },
  mounted() { },
  watch: {
    show() {
      this.dialogShow = true
    },
    edit() {
      const edit = Sea.deepCopy(this.edit)
      this.form.id = edit.id
      this.form.name = edit.name || ''
      this.form.color = edit.color || ''
      this.form.icon = edit.icon || ''
      this.form.pc = edit.pc || ''
      this.form.mobile = edit.mobile || ''
      this.form.app = edit.app || ''
      this.form.home_pc = edit.home_pc || ''
      this.form.home_mobile = edit.home_mobile || ''
      this.form.tags = edit.tags || []
      this.form.outwall = edit.outwall || false
    },
  },
}
</script>
<script setup>  </script>

<style lang="scss">
.EngineEdit-dialog {
  background: #f4f4f4;

  .edit {
    display: flex;
    flex-direction: column-reverse;

    .el-form {
      flex: 1;
    }

    .preview {
      align-self: center;

      .engines {
        font-size: 18px;

        .engine {
          cursor: pointer;
          margin-bottom: 10px;
          border-radius: 2px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 114px;
          height: 80px;
          border: 1px solid #eee;
          background: #fff;

          .iconfont {
            font-size: 30px;
          }

          span {
            margin-top: 4px;
            font-size: 14px;
            line-height: 22px;
            text-align: center;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .engine.empty {
          visibility: hidden;
        }

        .engine.add {
          color: rgba(0, 0, 0, 0.3);
          font-weight: 500;
          border-color: transparent;
          background: transparent;
        }

        .engine.add:hover {
          color: #0f60ab;
        }
      }
    }
  }
}
</style>
