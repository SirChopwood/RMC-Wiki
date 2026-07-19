<template>
    <div :class="['info-box', type]" :style="{ width: width }">
        <div class="info-box-icon">
            <img :src="images[type]" class="pixelated"/>
        </div>
        <div class="info-box-content">
            <slot />
        </div>
    </div>
</template>

<script setup>
defineProps({
    type: {
        type: String,
        default: 'info'
    },
    width: {
        type: String,
        default: '100%' 
    }
})

const images = {
    alert: 'https://github.com/RMC-14/RMC-14/blob/master/Resources/Textures/_RMC14/Interface/job_icons/UNMC/military_police.rsi/hudsquad_cmp.png?raw=true',
    help: 'https://github.com/RMC-14/RMC-14/blob/master/Resources/Textures/_RMC14/Interface/job_icons/UNMC/auxiliary_support.rsi/senior_enlisted_advisor.png?raw=true',
    important: 'https://github.com/RMC-14/RMC-14/blob/master/Resources/Textures/_RMC14/Interface/job_icons/UNMC/engineering.rsi/hudsquad_ce.png?raw=true',
    info: 'https://github.com/RMC-14/RMC-14/blob/master/Resources/Textures/_RMC14/Interface/job_icons/UNMC/other.rsi/hudsquad_syn.png?raw=true',
    tip: 'https://github.com/RMC-14/RMC-14/blob/master/Resources/Textures/_RMC14/Objects/Clothing/Head/Hats/xippy_hat.rsi/icon.png?raw=true',
}
</script>

<style scoped lang="scss">
.info-box {
    display: flex;
    gap: 1rem;
    padding: 0.75rem;
    margin: 1.5rem 0;
    max-width: 100%;
    min-height: 3rem;
}

.info-box-content {
  align-content: center;
}

.info-box.alert {
    border-color: #4c1d1d;
    border-width: 2px;
    border-left: 4px solid #f56565;
    background-color: var(--page-bg);
}

.info-box.help {
  padding-left: 1rem;
    background-color: #ebf8ff90;

    .dark & {
      background-color: #271b1490;
    }

    .info-box-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
      transform: translateY(25%) scale(300%);
    }
}

.info-box.important {
    border-left: 4px solid #ed8936;
    border-right: 4px solid #ed8936;
    background-color: #fffaf0;

    .dark & {
        background-color: #3a2e1a;
    }
}

.info-box.info {
    border-left: 4px solid #4299e1;
    background-color: #ebf8ff;

    .dark & {
        background-color: #1a2e3a;
    }

    .info-box-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
      transform: translateY(25%) scale(300%);
    }
}

.info-box.tip {
    border-left: 4px solid #fdf998;
    background-color: #fefce8;

    .dark & {
        background-color: #3a3a1a;
    }
}

.info-box-icon {
    font-size: 0;
    height: fit-content;
    flex-shrink: 0;
    offset-anchor: center;
    float: left;
    transform: scale(300%);
}
</style>