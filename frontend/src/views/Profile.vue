<template>
  <div class="profile">
    <div class="profile-shell">
      <section class="hero-card">
        <div class="hero-copy">
          <p class="eyebrow">Cat keeper profile</p>
          <h2>你的猫咪星球主页</h2>
          <p class="intro">
            这里保存的是你的主人名片，也是通往所有毛孩子相册和日常记录的入口。
          </p>

          <div class="actions">
            <el-button round type="primary" @click="$router.push('/cats')">
              <el-icon><Orange /></el-icon> 进入猫咪相册
            </el-button>
            <el-button round plain @click="$router.push('/cats/create')">
              <el-icon><Plus /></el-icon> 添加新猫咪
            </el-button>
          </div>
        </div>

        <div class="avatar-panel">
          <div class="avatar-ring">
            <el-avatar :size="116" :src="userStore.userInfo?.avatar || ''">
              <el-icon :size="54"><User /></el-icon>
            </el-avatar>
          </div>
          <strong>{{ userStore.userInfo?.username || '未命名用户' }}</strong>
          <span>{{ userStore.userInfo?.email || '暂无邮箱' }}</span>
        </div>
      </section>

      <section class="details-grid">
        <article class="info-card">
          <h3>主人档案</h3>
          <div class="info-list">
            <div class="info-item">
              <label>用户名</label>
              <span>{{ userStore.userInfo?.username || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label>邮箱</label>
              <span>{{ userStore.userInfo?.email || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label>用户 ID</label>
              <span class="mono">{{ userStore.userInfo?.id || '暂无' }}</span>
            </div>
          </div>
        </article>

        <article class="info-card warm-card">
          <h3>今日提醒</h3>
          <p class="reminder">
            给猫咪拍一张新照片，或者补充一条有趣的小备注，让相册更像生活本身。
          </p>
          <div class="quick-tags">
            <span>晒太阳</span>
            <span>打呼噜</span>
            <span>偷看罐头</span>
          </div>
          <el-button round type="danger" plain @click="handleLogout">
            <el-icon><SwitchButton /></el-icon> 退出登录
          </el-button>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Orange, Plus, SwitchButton, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.profile {
  padding: 56px 20px 88px;
}

.profile-shell {
  max-width: 1120px;
  margin: 0 auto;
}

.hero-card {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) 320px;
  gap: 28px;
  padding: 40px;
  border: 1px solid var(--color-border);
  border-radius: 38px;
  background: linear-gradient(135deg, rgba(255, 249, 239, 0.95), rgba(255, 239, 219, 0.9));
  box-shadow: var(--shadow-soft);
}

.hero-card::before,
.hero-card::after {
  position: absolute;
  border-radius: 50%;
  content: "";
  pointer-events: none;
}

.hero-card::before {
  top: -70px;
  right: -30px;
  width: 220px;
  height: 220px;
  background: rgba(246, 189, 95, 0.22);
}

.hero-card::after {
  bottom: -90px;
  left: 48%;
  width: 180px;
  height: 180px;
  background: rgba(139, 191, 159, 0.18);
}

.hero-copy {
  position: relative;
  z-index: 1;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--color-coral);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero-copy h2 {
  margin: 0;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: clamp(38px, 5vw, 60px);
  line-height: 1.05;
}

.intro {
  max-width: 620px;
  margin: 16px 0 0;
  color: var(--color-muted);
  font-size: 17px;
  line-height: 1.9;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 30px;
}

.avatar-panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 28px 24px;
  border: 1px solid rgba(123, 86, 63, 0.1);
  border-radius: 30px;
  background: rgba(255, 252, 244, 0.8);
  box-shadow: var(--shadow-card);
  text-align: center;
}

.avatar-ring {
  padding: 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(239, 127, 97, 0.25), rgba(246, 189, 95, 0.36));
}

.avatar-panel strong {
  color: var(--color-ink);
  font-size: 26px;
  font-weight: 800;
}

.avatar-panel span {
  color: var(--color-muted);
  line-height: 1.7;
  word-break: break-word;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-top: 28px;
}

.info-card {
  padding: 30px;
  border: 1px solid var(--color-border);
  border-radius: 30px;
  background: var(--color-card);
  box-shadow: var(--shadow-card);
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

.mono {
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 15px;
  word-break: break-all;
}

.warm-card {
  background:
    radial-gradient(circle at top right, rgba(246, 189, 95, 0.2), transparent 28%),
    linear-gradient(135deg, rgba(255, 247, 234, 0.95), rgba(255, 236, 220, 0.88));
}

.reminder {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.9;
}

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 22px 0 24px;
}

.quick-tags span {
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(239, 127, 97, 0.12);
  color: var(--color-coral);
  font-size: 14px;
  font-weight: 800;
}

@media (max-width: 900px) {
  .hero-card,
  .details-grid {
    grid-template-columns: 1fr;
  }

  .hero-card {
    padding: 30px 24px;
  }

  .avatar-panel {
    max-width: 360px;
    margin: 0 auto;
  }
}
</style>
