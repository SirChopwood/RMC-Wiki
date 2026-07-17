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
    alert: 'https://github.com/RMC-14/RMC-14/blob/master/Resources/Textures/_RMC14/Interface/marine_hud.rsi/hudsquad_cmp.png?raw=true',
    download: 'download.png',
    help: 'help.png',
    important: 'https://github.com/RMC-14/RMC-14/blob/master/Resources/Textures/_RMC14/Interface/marine_hud.rsi/hudsquad_ce.png?raw=true',
    info: 'info.png',
    tip: 'tip.png',
    todo: 'todo.png',
}
</script>

<style scoped lang="scss">
.info-box {
    display: flex;
    gap: 1rem;
    padding: 0.75rem;
    margin: 1.5rem 0;
    max-width: 100%;
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

.info-box.download {
    border-left: 4px solid #4fa808;
    background-color: #f0fff0;

    .dark & {
        background-color: #1a2e1a;
    }
}

.info-box.help {
    border-left: 4px solid #4299e1;
    background-color: #ebf8ff;

    .dark & {
        background-color: #1a2e3a;
    }
}

.info-box.important {
    border-left: 4px solid #ed8936;
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
}

.info-box.tip {
    border-left: 4px solid #fdf998;
    background-color: #fefce8;

    .dark & {
        background-color: #3a3a1a;
    }
}

.info-box.todo {
    border-left: 4px solid #f6ad55;
    background-color: #fffaf0;
    
    .dark & {
        background-color: #3a2e1a;
    }
}

.info-box-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
    transform: translateX(-100%) translateY(100%) scale(300%);
}
</style>