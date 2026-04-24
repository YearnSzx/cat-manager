<template>
  <div class="cat-form">
    <div class="form-card">
      <p class="eyebrow">Cat profile</p>
      <h2>{{ isEdit ? '更新毛孩子档案' : '记录一只新猫咪' }}</h2>
      <p class="form-intro">照片、生日、体重和性格备注，都会变成相册里温柔的一部分。</p>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入猫咪名字" />
        </el-form-item>
        
        <el-form-item label="品种" prop="breed">
          <el-input v-model="form.breed" placeholder="例如：英短、美短、布偶" />
        </el-form-item>
        
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio value="male">公</el-radio>
            <el-radio value="female">母</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker
            v-model="form.birthDate"
            type="date"
            placeholder="选择出生日期"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="毛色" prop="color">
          <el-input v-model="form.color" placeholder="例如：蓝白、橘色、黑色" />
        </el-form-item>
        
        <el-form-item label="体重 (kg)" prop="weight">
          <el-input-number v-model="form.weight" :min="0" :max="50" :step="0.1" />
        </el-form-item>
        
        <el-form-item label="是否绝育" prop="isNeutered">
          <el-switch v-model="form.isNeutered" />
        </el-form-item>

        <el-form-item label="照片">
          <el-upload
            class="photo-uploader"
            :show-file-list="false"
            :http-request="handlePhotoUpload"
            :before-upload="beforePhotoUpload"
          >
            <div class="photo-placeholder">
              <el-icon><Plus /></el-icon>
              <span>{{ form.photos.length ? '继续上传照片' : '上传猫咪照片' }}</span>
            </div>
          </el-upload>
          <div v-if="form.photos.length" class="photo-grid">
            <div v-for="(photo, index) in form.photos" :key="photo" class="photo-item">
              <img :src="photo" class="photo-preview" :alt="`猫咪照片 ${index + 1}`" />
              <span v-if="index === 0" class="photo-badge">封面</span>
              <button type="button" class="photo-remove" @click="removePhoto(index)">
                删除
              </button>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="form.notes"
            type="textarea"
            :rows="3"
            placeholder="其他备注信息"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button round @click="$router.push('/cats')">取消</el-button>
          <el-button round type="primary" :loading="loading" @click="handleSubmit">
            保存档案
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type {
  FormInstance,
  FormRules,
  UploadProps,
  UploadRequestOptions
} from 'element-plus'
import { getCatById, createCat, updateCat } from '@/api/cat'
import { uploadCatPhoto } from '@/api/upload'
import type { CatFormData } from '@/types'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
type UploadError = Parameters<UploadRequestOptions['onError']>[0]

const isEdit = computed(() => !!route.params.id)

const form = reactive<CatFormData>({
  name: '',
  breed: '',
  gender: 'male',
  birthDate: '',
  color: '',
  weight: 0,
  isNeutered: false,
  photo: '',
  photos: [],
  notes: ''
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
  breed: [{ required: true, message: '请输入品种', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  birthDate: [{ required: true, message: '请选择出生日期', trigger: 'change' }]
}

const loadCat = async () => {
  if (!isEdit.value) return
  
  try {
    const res = await getCatById(route.params.id as string)
    const cat = res.data
    form.name = cat.name
    form.breed = cat.breed
    form.gender = cat.gender
    form.birthDate = cat.birthDate
    form.color = cat.color
    form.weight = cat.weight
    form.isNeutered = cat.isNeutered
    form.photo = cat.photo
    form.photos = cat.photos?.length ? [...cat.photos] : (cat.photo ? [cat.photo] : [])
    form.notes = cat.notes
  } catch (error) {
    console.error(error)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    try {
      form.photo = form.photos[0] || ''

      if (isEdit.value) {
        await updateCat(route.params.id as string, form)
        ElMessage.success('更新成功')
      } else {
        await createCat(form)
        ElMessage.success('创建成功')
      }
      router.push('/cats')
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  })
}

const beforePhotoUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }

  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB')
    return false
  }

  return true
}

const handlePhotoUpload = async (options: UploadRequestOptions) => {
  try {
    const res = await uploadCatPhoto(options.file)
    form.photos.push(res.data.url)
    form.photo = form.photos[0] || ''
    ElMessage.success('照片上传成功')
    options.onSuccess(res)
  } catch (error) {
    options.onError(error as UploadError)
  }
}

const removePhoto = (index: number) => {
  form.photos.splice(index, 1)
  form.photo = form.photos[0] || ''
}

onMounted(() => {
  loadCat()
})
</script>

<style scoped>
.cat-form {
  max-width: 760px;
  margin: 0 auto;
  padding: 56px 20px 86px;
}

.form-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 38px;
  background: var(--color-card);
  padding: 44px;
  box-shadow: var(--shadow-soft);
}

.form-card::before {
  position: absolute;
  top: -90px;
  right: -80px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(246, 189, 95, 0.28);
  content: "";
}

.eyebrow {
  position: relative;
  margin: 0 0 8px;
  color: var(--color-coral);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-align: center;
  text-transform: uppercase;
}

.form-card h2 {
  position: relative;
  text-align: center;
  margin: 0;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: clamp(34px, 5vw, 52px);
  line-height: 1.1;
}

.form-intro {
  position: relative;
  max-width: 480px;
  margin: 14px auto 34px;
  color: var(--color-muted);
  line-height: 1.8;
  text-align: center;
}

:deep(.el-form-item__label) {
  color: var(--color-muted);
  font-weight: 900;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-input-number .el-input__wrapper) {
  border-radius: 16px;
  box-shadow: 0 0 0 1px var(--color-border) inset;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus),
:deep(.el-input-number .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--color-coral) inset;
}

.photo-uploader {
  width: 180px;
}

.photo-placeholder {
  width: 180px;
  height: 180px;
  border-radius: 28px;
}

.photo-preview {
  width: 100%;
  height: 180px;
  display: block;
  object-fit: cover;
  border-radius: 24px;
}

.photo-placeholder {
  border: 1px dashed rgba(123, 86, 63, 0.28);
  background: rgba(255, 248, 238, 0.72);
  color: var(--color-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: border-color 0.2s, color 0.2s;
}

.photo-placeholder:hover {
  border-color: var(--color-coral);
  color: var(--color-coral);
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  width: 100%;
  margin-top: 16px;
}

.photo-item {
  position: relative;
}

.photo-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(48, 37, 31, 0.58);
  color: #fffaf1;
  font-size: 12px;
  font-weight: 800;
}

.photo-remove {
  position: absolute;
  right: 10px;
  bottom: 10px;
  border: none;
  border-radius: 999px;
  background: rgba(255, 250, 241, 0.94);
  color: var(--color-coral);
  padding: 7px 12px;
  font-weight: 800;
  cursor: pointer;
}

@media (max-width: 680px) {
  .form-card {
    padding: 30px 22px;
  }

  :deep(.el-form-item) {
    display: block;
  }

  :deep(.el-form-item__label) {
    display: block;
    width: auto !important;
    margin-bottom: 8px;
    text-align: left;
  }
}
</style>
