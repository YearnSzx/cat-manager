<template>
  <div class="cat-list">
    <div class="header">
      <div>
        <p class="eyebrow">My lovely cats</p>
        <h2>我的猫咪相册</h2>
        <p class="subtitle">每一张卡片，都是一个毛孩子的小世界。</p>
      </div>
      <el-button type="primary" round @click="$router.push('/cats/create')">
        <el-icon><Plus /></el-icon> 添加猫咪
      </el-button>
    </div>

    <div v-loading="loading" class="cat-grid">
      <el-empty v-if="!loading && cats.length === 0" description="还没有猫咪，添加第一只吧！" />
      
      <el-card v-for="cat in cats" :key="cat._id" class="cat-card" shadow="hover">
        <div class="cat-photo" @click="$router.push(`/cats/${cat._id}`)">
          <div v-if="getCatPhotos(cat).length > 1" class="photo-slideshow">
            <img
              v-for="(photo, index) in getCatPhotos(cat)"
              :key="`${cat._id}-${index}`"
              :src="photo"
              :alt="cat.name"
              class="slideshow-image"
              :class="{ 'is-active': isActiveSlide(cat, index) }"
            />
          </div>
          <img v-else-if="getCatCover(cat)" :src="getCatCover(cat)" :alt="cat.name" />
          <div v-else class="photo-empty">
            <el-icon :size="48"><Picture /></el-icon>
            <span>还没有照片</span>
          </div>
          <div v-if="cat.photos?.length > 1" class="photo-count">
            {{ cat.photos.length }} 张照片
          </div>
        </div>
        <div class="cat-info">
          <div class="cat-title">
            <h3>{{ cat.name }}</h3>
            <span>{{ cat.gender === 'male' ? '男孩' : '女孩' }}</span>
          </div>
          <p class="breed">{{ cat.breed || '神秘小猫' }}</p>
          <div class="details">
            <span>{{ cat.color || '未知毛色' }}</span>
            <span>{{ cat.weight }}kg</span>
            <span>{{ cat.isNeutered ? '已绝育' : '未绝育' }}</span>
          </div>
          <p v-if="cat.notes" class="notes">{{ cat.notes }}</p>
        </div>
        <div class="actions">
          <el-button round size="small" plain @click="$router.push(`/cats/${cat._id}`)">
            查看详情
          </el-button>
          <el-button round size="small" @click="$router.push(`/cats/edit/${cat._id}`)">
            编辑
          </el-button>
          <el-button round size="small" type="danger" plain @click="handleDelete(cat._id)">
            删除
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture, Plus } from '@element-plus/icons-vue'
import { getCats, deleteCat } from '@/api/cat'
import type { Cat } from '@/types'
import { getCatCover, getCatPhotos } from '@/utils/cat'

const loading = ref(false)
const cats = ref<Cat[]>([])
const slideshowTick = ref(0)
let slideshowTimer: ReturnType<typeof setInterval> | null = null

const loadCats = async () => {
  loading.value = true
  try {
    const res = await getCats()
    cats.value = res.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这只猫咪吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteCat(id)
    ElMessage.success('删除成功')
    loadCats()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

const isActiveSlide = (cat: Cat, index: number) => {
  const photos = getCatPhotos(cat)

  if (photos.length <= 1) {
    return index === 0
  }

  return slideshowTick.value % photos.length === index
}

onMounted(() => {
  loadCats()
  slideshowTimer = setInterval(() => {
    slideshowTick.value += 1
  }, 4000)
})

onUnmounted(() => {
  if (slideshowTimer) {
    clearInterval(slideshowTimer)
  }
})
</script>

<style scoped>
.cat-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 56px 20px 80px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 34px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--color-coral);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.header h2 {
  margin: 0;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 58px);
  line-height: 1.05;
}

.subtitle {
  margin: 12px 0 0;
  color: var(--color-muted);
  font-size: 16px;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 26px;
}

.cat-card {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 32px;
  background: var(--color-card);
  box-shadow: var(--shadow-card);
  transition: transform 0.3s, box-shadow 0.3s;
}

.cat-card:hover {
  box-shadow: var(--shadow-soft);
  transform: translateY(-8px) rotate(-0.5deg);
}

.cat-photo {
  height: 240px;
  margin: -20px -20px 16px;
  background:
    radial-gradient(circle at 24% 22%, rgba(255, 255, 255, 0.82), transparent 18%),
    linear-gradient(135deg, #ffe1bf, #f6b391 52%, #c7dcbc);
  color: rgba(48, 37, 31, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.cat-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-slideshow {
  position: absolute;
  inset: 0;
}

.slideshow-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.slideshow-image.is-active {
  opacity: 1;
}

.photo-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(48, 37, 31, 0.48);
  font-weight: 800;
}

.photo-count {
  position: absolute;
  right: 14px;
  bottom: 14px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(48, 37, 31, 0.58);
  color: #fffaf1;
  font-size: 12px;
  font-weight: 800;
  backdrop-filter: blur(10px);
}

.cat-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.cat-info h3 {
  margin: 0 0 8px;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: 34px;
  line-height: 1;
}

.cat-title span {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(239, 127, 97, 0.12);
  color: var(--color-coral);
  font-size: 13px;
  font-weight: 900;
}

.breed {
  color: var(--color-muted);
  margin: 0 0 12px;
  font-weight: 800;
}

.details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--color-muted);
  font-size: 14px;
}

.details span {
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(139, 191, 159, 0.16);
}

.notes {
  margin: 16px 0 0;
  color: var(--color-muted);
  line-height: 1.7;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

@media (max-width: 720px) {
  .header {
    align-items: flex-start;
    flex-direction: column;
  }

  .cat-list {
    padding-top: 40px;
  }
}
</style>
