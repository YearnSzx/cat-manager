<template>
  <div v-loading="loading" class="cat-detail">
    <template v-if="cat">
      <section class="detail-hero">
        <div class="hero-copy">
          <p class="eyebrow">Cat profile</p>
          <h1>{{ cat.name }}</h1>
          <p class="intro">
            {{ cat.notes || `${cat.name} 的小档案，记录了它的模样、体重和每一点可爱的日常。` }}
          </p>

          <div class="hero-tags">
            <span>{{ cat.breed || '神秘小猫' }}</span>
            <span>{{ cat.gender === 'male' ? '男孩' : '女孩' }}</span>
            <span>{{ cat.color || '未知毛色' }}</span>
          </div>

          <div class="hero-actions">
            <el-button round type="primary" @click="$router.push(`/cats/edit/${cat._id}`)">
              编辑档案
            </el-button>
            <el-button round plain @click="$router.push('/cats')">
              返回相册
            </el-button>
          </div>
        </div>

        <div class="hero-gallery">
          <el-carousel
            v-if="photos.length"
            :autoplay="photos.length > 1"
            trigger="click"
            height="420px"
            indicator-position="outside"
          >
            <el-carousel-item v-for="photo in photos" :key="photo">
              <img :src="photo" :alt="cat.name" class="hero-image" />
            </el-carousel-item>
          </el-carousel>
          <div v-else class="hero-placeholder">
            <el-icon :size="54"><Picture /></el-icon>
            <span>还没有上传照片</span>
          </div>
        </div>
      </section>

      <section class="detail-grid">
        <article class="info-card">
          <h3>基本信息</h3>
          <div class="info-list">
            <div class="info-item">
              <label>名字</label>
              <span>{{ cat.name }}</span>
            </div>
            <div class="info-item">
              <label>品种</label>
              <span>{{ cat.breed || '未填写' }}</span>
            </div>
            <div class="info-item">
              <label>出生日期</label>
              <span>{{ formatDate(cat.birthDate) }}</span>
            </div>
          </div>
        </article>

        <article class="info-card warm-card">
          <h3>生活状态</h3>
          <div class="info-list">
            <div class="info-item">
              <label>体重</label>
              <span>{{ cat.weight }} kg</span>
            </div>
            <div class="info-item">
              <label>绝育情况</label>
              <span>{{ cat.isNeutered ? '已绝育' : '未绝育' }}</span>
            </div>
            <div class="info-item">
              <label>照片数量</label>
              <span>{{ photos.length }} 张</span>
            </div>
          </div>
        </article>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Picture } from '@element-plus/icons-vue'
import { getCatById } from '@/api/cat'
import type { Cat } from '@/types'
import { getCatPhotos } from '@/utils/cat'

const route = useRoute()
const loading = ref(false)
const cat = ref<Cat | null>(null)

const photos = computed(() => (cat.value ? getCatPhotos(cat.value) : []))

const loadCat = async () => {
  loading.value = true
  try {
    const res = await getCatById(route.params.id as string)
    cat.value = res.data
  } finally {
    loading.value = false
  }
}

const formatDate = (value: string) => {
  if (!value) return '未填写'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadCat()
})
</script>

<style scoped>
.cat-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 56px 20px 80px;
}

.detail-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 520px);
  gap: 28px;
  align-items: center;
}

.hero-copy,
.hero-gallery,
.info-card {
  border: 1px solid var(--color-border);
  border-radius: 34px;
  background: var(--color-card);
  box-shadow: var(--shadow-card);
}

.hero-copy {
  padding: 38px;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--color-coral);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 0;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: clamp(42px, 6vw, 72px);
  line-height: 1.02;
}

.intro {
  margin: 18px 0 0;
  color: var(--color-muted);
  font-size: 17px;
  line-height: 1.9;
}

.hero-tags,
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-tags {
  margin-top: 26px;
}

.hero-tags span {
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(239, 127, 97, 0.12);
  color: var(--color-coral);
  font-weight: 800;
}

.hero-actions {
  margin-top: 26px;
}

.hero-gallery {
  overflow: hidden;
  padding: 18px;
}

.hero-image,
.hero-placeholder {
  width: 100%;
  height: 420px;
  border-radius: 24px;
}

.hero-image {
  display: block;
  object-fit: cover;
}

.hero-placeholder {
  background:
    radial-gradient(circle at 24% 22%, rgba(255, 255, 255, 0.82), transparent 18%),
    linear-gradient(135deg, #ffe1bf, #f6b391 52%, #c7dcbc);
  color: rgba(48, 37, 31, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 800;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-top: 28px;
}

.info-card {
  padding: 30px;
}

.warm-card {
  background:
    radial-gradient(circle at top right, rgba(246, 189, 95, 0.2), transparent 28%),
    linear-gradient(135deg, rgba(255, 247, 234, 0.95), rgba(255, 236, 220, 0.88));
}

.info-card h3 {
  margin: 0 0 22px;
  color: var(--color-ink);
  font-size: 24px;
}

.info-list {
  display: grid;
  gap: 14px;
}

.info-item {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 248, 238, 0.82);
}

.info-item label {
  color: var(--color-muted);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.info-item span {
  color: var(--color-ink);
  font-size: 17px;
  line-height: 1.7;
}

@media (max-width: 900px) {
  .detail-hero,
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    padding: 30px 24px;
  }
}
</style>
